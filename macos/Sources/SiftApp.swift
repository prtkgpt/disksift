import SwiftUI
import AppKit
import CryptoKit
import Security

struct FileItem: Identifiable, Hashable, Sendable {
    let id = UUID()
    let url: URL
    let bytes: Int64
    let modified: Date?
    var name: String { url.lastPathComponent }
    var cleanupRestriction: String? {
        let path = url.standardizedFileURL.path
        let userLibrary = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library", isDirectory: true).path + "/"
        if path.contains("/CoreSimulator/") { return "Managed by Xcode. Remove unused simulator runtimes in Xcode Settings instead of deleting their internal files." }
        if ["/System/", "/Library/", "/private/", "/usr/", "/bin/", "/sbin/"].contains(where: path.hasPrefix) { return "Managed system location. Use the owning application's storage settings." }
        if path.hasPrefix(userLibrary) { return "Application data in your Library should be managed by the app that created it. DiskSift can reveal it, but will not remove it directly." }
        if path.contains("/node_modules/") { return "Project dependency. Review the complete node_modules folder in Finder; deleting individual binaries can break your project." }
        return nil
    }
    var isPlanEligible: Bool {
        let home = FileManager.default.homeDirectoryForCurrentUser
        return ["Desktop", "Documents", "Downloads", "Movies", "Music", "Pictures"].contains { url.standardizedFileURL.path.hasPrefix(home.appendingPathComponent($0, isDirectory:true).path + "/") }
    }
    var kind: String {
        let ext = url.pathExtension.lowercased()
        if ["jpg","jpeg","png","heic","gif","tiff","raw"].contains(ext) { return "Photos" }
        if ["mov","mp4","mkv","avi","m4v"].contains(ext) { return "Videos" }
        if ["mp3","m4a","wav","flac","aac"].contains(ext) { return "Audio" }
        if ["zip","dmg","pkg","iso","tar","gz","7z"].contains(ext) { return "Archives" }
        if ["pdf","doc","docx","txt","md","pages","xls","xlsx","csv"].contains(ext) { return "Documents" }
        if ["app"].contains(ext) { return "Applications" }
        return "Other"
    }
}

struct CategoryTotal: Identifiable {
    let id = UUID(); let name: String; let bytes: Int64; let color: Color
}

struct CleanupReceipt: Identifiable {
    let id = UUID()
    let movedCount: Int
    let movedBytes: Int64
    let failedCount: Int
    let completedAt: Date
}

@MainActor final class LicenseManager: ObservableObject {
    @Published var isPro: Bool
    @Published var showingLicense = false
    @Published var activationMessage: String?
    private static let keychainService = "com.disksift.app.license"
    private static let keychainAccount = "pro-license"

    init() {
        let storedKey = Self.loadLicenseKey()
        isPro = storedKey != nil
        if let storedKey { Task { _ = await validate(storedKey, interactive: false) } }
    }

    func activate(_ key: String) async -> Bool {
        await validate(key.trimmingCharacters(in: .whitespacesAndNewlines).uppercased(), interactive: true)
    }

    private func validate(_ key: String, interactive: Bool) async -> Bool {
        guard key.range(of: #"^DISKSIFT-PRO-(?:[A-Z0-9]{4}-){4}[A-Z0-9]{4}$"#, options: .regularExpression) != nil else {
            activationMessage = "Enter the complete license key from your DiskSift email."
            return false
        }
        do {
            var request = URLRequest(url: URL(string: "https://www.disksift.com/api/license/activate")!)
            request.httpMethod = "POST"
            request.timeoutInterval = 15
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: [
                "licenseKey": key,
                "deviceId": Self.deviceID(),
                "deviceName": Host.current().localizedName ?? "Mac"
            ])
            let (data, response) = try await URLSession.shared.data(for: request)
            let result = try JSONDecoder().decode(ActivationResponse.self, from: data)
            let status = (response as? HTTPURLResponse)?.statusCode ?? 500
            if status == 200 && result.valid {
                try Self.saveLicenseKey(key)
                isPro = true
                activationMessage = nil
                return true
            }
            if [400, 403, 409].contains(status) {
                if !interactive { Self.deleteLicenseKey(); isPro = false }
                activationMessage = result.message ?? "This license could not be activated."
                return false
            }
            throw URLError(.badServerResponse)
        } catch {
            if interactive { activationMessage = "Activation is temporarily unavailable. Check your internet connection and try again." }
            return false
        }
    }

    func deactivate() {
        Self.deleteLicenseKey()
        isPro = false
        activationMessage = nil
    }

    private struct ActivationResponse: Decodable { let valid: Bool; let message: String? }
    private static func deviceID() -> String {
        if let value = UserDefaults.standard.string(forKey: "disksift.device-id") { return value }
        let value = UUID().uuidString
        UserDefaults.standard.set(value, forKey: "disksift.device-id")
        return value
    }
    private static func loadLicenseKey() -> String? {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: keychainService, kSecAttrAccount as String: keychainAccount, kSecReturnData as String: true, kSecMatchLimit as String: kSecMatchLimitOne]
        var item: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess, let data = item as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
    private static func saveLicenseKey(_ key: String) throws {
        deleteLicenseKey()
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: keychainService, kSecAttrAccount as String: keychainAccount, kSecValueData as String: Data(key.utf8), kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly]
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else { throw NSError(domain: NSOSStatusErrorDomain, code: Int(status)) }
    }
    private static func deleteLicenseKey() {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: keychainService, kSecAttrAccount as String: keychainAccount]
        SecItemDelete(query as CFDictionary)
    }
}

@MainActor final class ScanModel: ObservableObject {
    @Published var files: [FileItem] = []
    @Published var scanning = false
    @Published var progress = 0.0
    @Published var scannedURL: URL?
    @Published var error: String?
    @Published var selected: FileItem?
    @Published var duplicateGroups: [[FileItem]] = []
    @Published var duplicateScanning = false
    @Published var duplicatesAnalyzed = false
    @Published var searchText = ""
    @Published var cleanupBusy = false
    @Published var status = ""
    @Published var selectedIDs: Set<UUID> = []
    @Published var cleanupReceipt: CleanupReceipt?
    @Published var showingCleanupReceipt = false
    private var scanTask: Task<Void, Never>?
    private var duplicateTask: Task<Void, Never>?
    private var generation = UUID()

    func cancelWork() {
        scanTask?.cancel(); duplicateTask?.cancel(); generation = UUID()
        scanning = false; duplicateScanning = false
        status = "Stopped. You can start a smaller folder scan."
    }

    var totalBytes: Int64 { files.reduce(0) { $0 + $1.bytes } }
    var categories: [CategoryTotal] {
        let colors: [String: Color] = ["Photos": .pink, "Videos": .purple, "Audio": .orange, "Archives": .teal, "Documents": .blue, "Applications": .indigo, "Other": .gray]
        return Dictionary(grouping: files, by: \.kind).map { CategoryTotal(name: $0.key, bytes: $0.value.reduce(0) { $0 + $1.bytes }, color: colors[$0.key] ?? .gray) }.sorted { $0.bytes > $1.bytes }
    }
    var largeFiles: [FileItem] { files }
    var oldFiles: [FileItem] { files.filter { ($0.modified ?? .now) < Calendar.current.date(byAdding: .year, value: -1, to: .now)! }.sorted { ($0.modified ?? .now) < ($1.modified ?? .now) } }
    var developerJunk: [FileItem] { files.filter { item in let p=item.url.path.lowercased(); return p.contains("/node_modules/") || p.contains("/deriveddata/") || p.contains("/.gradle/") || p.contains("/.npm/") || p.contains("/coresimulator/") }.sorted { $0.bytes > $1.bytes } }
    var quickWins: [FileItem] { files.filter { item in let ext=item.url.pathExtension.lowercased(); let old=(item.modified ?? .now) < Calendar.current.date(byAdding:.day,value:-30,to:.now)!; return old && ["dmg","pkg","zip","iso"].contains(ext) }.sorted { $0.bytes > $1.bytes } }
    var filteredFiles: [FileItem] { searchText.isEmpty ? files : files.filter { $0.name.localizedCaseInsensitiveContains(searchText) || $0.url.path.localizedCaseInsensitiveContains(searchText) } }
    var selectedItems: [FileItem] { files.filter { selectedIDs.contains($0.id) } }
    var selectedBytes: Int64 { selectedItems.reduce(0) { $0 + $1.bytes } }
    var safeQuickWins: [FileItem] { quickWins.filter { $0.cleanupRestriction == nil && $0.isPlanEligible } }
    var safeLargeFiles: [FileItem] { files.filter { $0.bytes >= 100_000_000 && $0.cleanupRestriction == nil && $0.isPlanEligible }.sorted { $0.bytes > $1.bytes } }
    var safeOldFiles: [FileItem] { oldFiles.filter { $0.cleanupRestriction == nil && $0.isPlanEligible } }
    var cleanupCandidates: [FileItem] {
        var seen: Set<UUID> = []
        return (safeQuickWins + safeLargeFiles + safeOldFiles).filter { seen.insert($0.id).inserted }
    }

    func toggleSelection(_ item: FileItem) {
        guard item.cleanupRestriction == nil else { error = item.cleanupRestriction; return }
        if selectedIDs.contains(item.id) { selectedIDs.remove(item.id) } else { selectedIDs.insert(item.id) }
    }
    func select(_ items: [FileItem]) { selectedIDs.formUnion(items.filter { $0.cleanupRestriction == nil }.map(\.id)) }
    func clearSelection() { selectedIDs.removeAll() }
    func selectDuplicateCopies(in group: [FileItem]) {
        let ordered = group.sorted { Self.keeperScore($0) > Self.keeperScore($1) }
        select(Array(ordered.dropFirst()))
    }

    func chooseFolder() {
        let panel = NSOpenPanel(); panel.canChooseDirectories = true; panel.canChooseFiles = false; panel.allowsMultipleSelection = false
        panel.message = "Choose a folder for DiskSift to analyze. Your file data stays on this Mac."
        if panel.runModal() == .OK, let url = panel.url { scan(url) }
    }
    func scan(_ url: URL) {
        guard !cleanupBusy else { return }
        cancelWork()
        let token = generation
        status = "Scanning file metadata in the background…"
        scanning = true; progress = 0; error = nil; files = []; selectedIDs = []; duplicateGroups = []; duplicateScanning = false; duplicatesAnalyzed = false; scannedURL = url
        scanTask = Task {
            for await batch in Self.fileBatches(at: url) {
                guard !Task.isCancelled, generation == token else { return }
                files.append(contentsOf: batch)
                progress = Double(files.count)
                status = "Scanning… \(files.count.formatted()) files found. Results are ready to review as they appear."
            }
            guard !Task.isCancelled, generation == token else { return }
            files.sort { $0.bytes > $1.bytes }; scanning = false
            status = "Scan complete. Build a Cleanup Plan or start with old installers in Quick Wins."
        }
    }
    func analyzeDuplicates() {
        guard !duplicateScanning && !scanning && !cleanupBusy else { return }
        let token = generation
        let snapshot = files
        duplicateScanning = true; duplicatesAnalyzed = false; duplicateGroups = []
        duplicateTask = Task.detached(priority: .utility) {
            let duplicates = Self.findDuplicates(in: snapshot)
            guard !Task.isCancelled else { return }
            await MainActor.run {
                guard self.generation == token else { return }
                self.duplicateGroups = duplicates
                self.duplicateScanning = false
                self.duplicatesAnalyzed = true
            }
        }
    }
    nonisolated static func fileBatches(at url: URL) -> AsyncStream<[FileItem]> {
        AsyncStream { continuation in
            let producer = Task.detached(priority: .utility) {
                let keys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey, .isSymbolicLinkKey, .contentModificationDateKey]
                guard let enumerator = FileManager.default.enumerator(at: url, includingPropertiesForKeys: keys, options: [.skipsHiddenFiles, .skipsPackageDescendants]) else { continuation.finish(); return }
                var batch: [FileItem] = []
                while let fileURL = enumerator.nextObject() as? URL {
                    if Task.isCancelled { break }
                    if let values = try? fileURL.resourceValues(forKeys: Set(keys)), values.isRegularFile == true, values.isSymbolicLink != true {
                        batch.append(FileItem(url: fileURL, bytes: Int64(values.fileSize ?? 0), modified: values.contentModificationDate))
                        if batch.count >= 200 { continuation.yield(batch); batch.removeAll(keepingCapacity: true) }
                    }
                }
                if !batch.isEmpty { continuation.yield(batch) }
                continuation.finish()
            }
            continuation.onTermination = { _ in producer.cancel() }
        }
    }
    nonisolated static func keeperScore(_ item: FileItem) -> Int {
        let path = item.url.path.lowercased()
        var score = 0
        if path.contains("/documents/") || path.contains("/desktop/") { score += 30 }
        if path.contains("/downloads/") { score -= 10 }
        if path.contains("/cache") || path.contains("/tmp/") { score -= 30 }
        score -= min(path.count / 20, 20)
        return score
    }
    nonisolated static func findDuplicates(in files: [FileItem]) -> [[FileItem]] {
        let candidates = Dictionary(grouping: files.filter { $0.bytes > 1_000_000 }, by: \.bytes).values.filter { $0.count > 1 }
        var matches: [[FileItem]] = []
        for group in candidates {
            if Task.isCancelled { break }
            let hashed = Dictionary(grouping: group, by: { fingerprint($0.url) ?? UUID().uuidString })
            matches.append(contentsOf: hashed.values.filter { $0.count > 1 })
        }
        return matches.sorted { ($0.first?.bytes ?? 0) * Int64($0.count - 1) > ($1.first?.bytes ?? 0) * Int64($1.count - 1) }
    }
    nonisolated static func fingerprint(_ url: URL) -> String? {
        guard let handle = try? FileHandle(forReadingFrom: url) else { return nil }
        defer { try? handle.close() }; var hasher = SHA256()
        do { while true { if Task.isCancelled { return nil }; let data = try handle.read(upToCount: 1_048_576) ?? Data(); if data.isEmpty { break }; hasher.update(data: data) } }
        catch { return nil }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }
    func trash(_ item: FileItem) {
        guard !cleanupBusy && !scanning && !duplicateScanning else { return }
        if let reason = item.cleanupRestriction { error = reason; return }
        cleanupBusy = true
        status = "Moving \(item.name) to Trash…"
        Task.detached(priority: .utility) {
            let resolved = item.url.resolvingSymlinksInPath()
            let checked = FileItem(url: resolved, bytes: item.bytes, modified: item.modified)
            var failure: String?
            if let reason = checked.cleanupRestriction { failure = reason }
            else if !FileManager.default.isDeletableFile(atPath: item.url.path) {
                failure = "This item cannot be removed by DiskSift. Reveal it in Finder or manage it in the owning app. Full Disk Access does not grant ownership of system files."
            } else {
                do { try FileManager.default.trashItem(at: item.url, resultingItemURL: nil) }
                catch { failure = "Could not move \(item.name) to Trash: \(error.localizedDescription)" }
            }
            if failure == nil && UserDefaults.standard.bool(forKey: "disksift.share-anonymous-impact") {
                await Self.reportAnonymousCleanup(bytes: item.bytes)
            }
            let result = failure
            await MainActor.run {
                self.cleanupBusy = false
                if let result { self.error = result; self.status = "Item was not removed." }
                else {
                    self.files.removeAll { $0.id == item.id }
                    self.selectedIDs.remove(item.id)
                    self.duplicateGroups = []; self.duplicatesAnalyzed = false
                    self.cleanupReceipt = CleanupReceipt(movedCount: 1, movedBytes: item.bytes, failedCount: 0, completedAt: .now)
                    self.showingCleanupReceipt = true
                    self.status = "Moved to Trash. Restore from Finder if needed. Disk space is released after Trash is emptied."
                }
            }
        }
    }
    func trashSelected() {
        guard !cleanupBusy && !scanning && !duplicateScanning else { return }
        let targets = selectedItems.filter { $0.cleanupRestriction == nil }
        guard !targets.isEmpty else { error = "Select at least one removable item first."; return }
        cleanupBusy = true
        status = "Moving \(targets.count) selected items to Trash…"
        Task.detached(priority: .utility) {
            var movedIDs: Set<UUID> = []; var movedBytes: Int64 = 0; var failed = 0
            for item in targets {
                if Task.isCancelled { break }
                let resolved = item.url.resolvingSymlinksInPath()
                let checked = FileItem(url: resolved, bytes: item.bytes, modified: item.modified)
                if checked.cleanupRestriction != nil || !FileManager.default.isDeletableFile(atPath: item.url.path) { failed += 1; continue }
                do { try FileManager.default.trashItem(at: item.url, resultingItemURL: nil); movedIDs.insert(item.id); movedBytes += item.bytes }
                catch { failed += 1 }
            }
            if movedBytes > 0 && UserDefaults.standard.bool(forKey: "disksift.share-anonymous-impact") { await Self.reportAnonymousCleanup(bytes: movedBytes) }
            await MainActor.run {
                self.files.removeAll { movedIDs.contains($0.id) }
                self.selectedIDs.subtract(movedIDs)
                self.cleanupBusy = false; self.duplicateGroups = []; self.duplicatesAnalyzed = false
                self.cleanupReceipt = CleanupReceipt(movedCount: movedIDs.count, movedBytes: movedBytes, failedCount: failed, completedAt: .now)
                self.showingCleanupReceipt = true
                self.status = failed == 0 ? "Cleanup complete. Items are recoverable from Trash." : "Cleanup finished. \(failed) item(s) were left in place because macOS did not allow access."
            }
        }
    }
    nonisolated static func reportAnonymousCleanup(bytes: Int64) async {
        let defaults = UserDefaults.standard
        let key = "disksift.impact-installation-id"
        let installationId = defaults.string(forKey: key) ?? UUID().uuidString
        defaults.set(installationId, forKey: key)
        guard let url = URL(string: "https://www.disksift.com/api/metrics/cleanup"),
              let body = try? JSONSerialization.data(withJSONObject: ["eventId": UUID().uuidString, "installationId": installationId, "bytesCleaned": bytes]) else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"; request.timeoutInterval = 8
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body
        _ = try? await URLSession.shared.data(for: request)
    }
}

@main struct DiskSiftApp: App {
    @StateObject private var scan = ScanModel(); @StateObject private var license = LicenseManager()
    var body: some Scene {
        WindowGroup { ContentView().environmentObject(scan).environmentObject(license).frame(minWidth: 960, minHeight: 650) }
            .windowStyle(.hiddenTitleBar)
        Settings { SettingsView().environmentObject(license).frame(width: 470, height: 300) }
    }
}

enum SidebarSection: String, CaseIterable { case overview="Overview", cleanup="Cleanup Plan", quick="Quick Wins", all="All Files", large="Large Files", old="Old Files", duplicates="Exact Duplicates", developer="Developer Junk"; var icon:String { ["Overview":"chart.pie.fill","Cleanup Plan":"checklist","Quick Wins":"bolt.fill","All Files":"list.bullet.rectangle","Large Files":"doc.text.magnifyingglass","Old Files":"clock.arrow.circlepath","Exact Duplicates":"square.on.square","Developer Junk":"hammer"][rawValue]! }; var isPro:Bool { self == .cleanup || self == .duplicates || self == .developer } }

struct ContentView: View {
    @EnvironmentObject var scan: ScanModel; @EnvironmentObject var license: LicenseManager
    @State private var section: SidebarSection = .overview
    @State private var confirmBatch = false
    var body: some View {
        NavigationSplitView { sidebar } detail: { detail }
            .background(Color(nsColor: .windowBackgroundColor)).sheet(isPresented: $license.showingLicense) { LicenseView().environmentObject(license) }
            .sheet(isPresented: $scan.showingCleanupReceipt) { if let receipt = scan.cleanupReceipt { CleanupReceiptView(receipt: receipt) } }
            .alert("DiskSift", isPresented: Binding(get: { scan.error != nil }, set: { if !$0 { scan.error = nil } })) { Button("OK") {} } message: { Text(scan.error ?? "") }
    }
    var sidebar: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack { Image(systemName: "sparkles").foregroundStyle(.white).padding(8).background(.purple.gradient, in: RoundedRectangle(cornerRadius: 9)); Text("DiskSift").font(.title2.bold()) }.padding(.bottom, 16)
            ForEach(SidebarSection.allCases, id: \.self) { item in
                Button { if item.isPro && !license.isPro { license.showingLicense = true } else { section = item } } label: {
                    HStack { Image(systemName: item.icon).frame(width: 24); Text(item.rawValue); Spacer(); if item.isPro && !license.isPro { Image(systemName: "lock.fill").font(.caption).foregroundStyle(.secondary) } }.padding(9).background(section == item ? Color.purple.opacity(0.13) : .clear, in: RoundedRectangle(cornerRadius: 8))
                }.buttonStyle(.plain)
            }
            Spacer()
            VStack(alignment: .leading, spacing: 8) { Label("100% local", systemImage: "hand.raised.fill").font(.caption.bold()).foregroundStyle(.purple); Text("Names and scan results never leave your Mac.").font(.caption2).foregroundStyle(.secondary) }.padding(12).background(Color.purple.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
            if !license.isPro { Button("Unlock DiskSift Pro · $12.99") { license.showingLicense = true }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large) }
            else { Label("DiskSift Pro", systemImage: "checkmark.seal.fill").foregroundStyle(.purple).font(.caption.bold()) }
        }.padding(18).navigationSplitViewColumnWidth(min: 210, ideal: 230)
    }
    @ViewBuilder var detail: some View {
        if scan.scannedURL == nil { WelcomeView() }
        else { VStack(spacing: 0) { header; if scan.scanning || scan.duplicateScanning { HStack { ProgressView().controlSize(.small); Text(scan.scanning ? "\(scan.files.count.formatted()) files found" : "Verifying duplicates"); Spacer(); Button("Stop") { scan.cancelWork() } }.padding(.horizontal, 28) }; Text(scan.status).font(.caption).foregroundStyle(.secondary).padding(.horizontal, 28); Group { switch section { case .overview: OverviewView(); case .cleanup: CleanupPlanView(); case .quick: QuickWinsView(); case .all: AllFilesView(); case .large: LargeFilesView(); case .old: OldFilesView(); case .duplicates: DuplicatesView(); case .developer: DeveloperJunkView() } }; if license.isPro && !scan.selectedIDs.isEmpty { HStack { VStack(alignment:.leading) { Text("\(scan.selectedIDs.count) selected").font(.headline); Text("\(format(scan.selectedBytes)) will move to Trash").font(.caption).foregroundStyle(.secondary) }; Spacer(); Button("Clear") { scan.clearSelection() }; Button("Review & Move to Trash") { confirmBatch = true }.buttonStyle(.borderedProminent).tint(.purple).disabled(scan.cleanupBusy || scan.scanning) }.padding(14).background(.bar).confirmationDialog("Move \(scan.selectedIDs.count) items to Trash?", isPresented: $confirmBatch) { Button("Move \(scan.selectedIDs.count) Items to Trash", role:.destructive) { scan.trashSelected() }; Button("Cancel", role:.cancel) {} } message: { Text("DiskSift will leave protected or inaccessible items untouched. You can restore moved items until you empty Trash.") } } }.environmentObject(scan).environmentObject(license) }
    }
    var header: some View { HStack { VStack(alignment: .leading) { Text(section.rawValue).font(.title.bold()); Text(scan.scannedURL?.path(percentEncoded: false) ?? "").lineLimit(1).font(.caption).foregroundStyle(.secondary) }; Spacer(); TextField("Search files and folders", text:$scan.searchText).textFieldStyle(.roundedBorder).frame(maxWidth:260); Button { scan.chooseFolder() } label: { Label("Scan", systemImage: "folder.badge.gearshape") }.buttonStyle(.borderedProminent).tint(.purple) }.padding(24) }
}

struct WelcomeView: View {
    @EnvironmentObject var scan: ScanModel
    var body: some View { VStack(spacing: 22) { Spacer(); Image(systemName: "externaldrive.fill.badge.magnifyingglass").font(.system(size: 70)).foregroundStyle(.purple.gradient); Text("See what’s taking up space.").font(.system(size: 36, weight: .bold)); Text("DiskSift analyzes metadata locally, verifies duplicates by content, and keeps every cleanup recoverable in Trash.").multilineTextAlignment(.center).foregroundStyle(.secondary).frame(maxWidth: 520); Button { scan.scan(FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Downloads")) } label: { Label("Start with Downloads", systemImage: "bolt.fill") }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large); Text("Start here for installers, archives, and downloads you recognize. Review results before removal.").font(.caption).foregroundStyle(.secondary); HStack { Button { scan.scan(FileManager.default.homeDirectoryForCurrentUser) } label: { Label("Scan Home",systemImage:"house") }; Button { scan.chooseFolder() } label: { Label("Choose Folder",systemImage:"folder") }; Button { scan.scan(URL(fileURLWithPath:"/")) } label: { Label("Scan Full Mac",systemImage:"internaldrive") } }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large); Text("Full Mac scans may require Full Disk Access in System Settings.").font(.caption).foregroundStyle(.secondary); HStack(spacing: 20) { Label("Private", systemImage: "hand.raised"); Label("SHA-256 duplicates", systemImage: "checkmark.shield"); Label("Trash-first", systemImage: "trash.slash") }.font(.caption).foregroundStyle(.secondary); Spacer() }.padding(50) }
}

struct OverviewView: View {
    @EnvironmentObject var scan: ScanModel
    var body: some View { ScrollView { VStack(alignment: .leading, spacing: 18) { HStack(spacing: 14) { Metric(title: "Analyzed", value: format(scan.totalBytes), icon: "internaldrive"); Metric(title: "Files", value: scan.files.count.formatted(), icon: "doc.on.doc"); Metric(title: "Largest file", value: format(scan.largeFiles.first?.bytes ?? 0), icon: "arrow.up.right") }; GroupBox { VStack(spacing: 14) { ForEach(scan.categories) { item in HStack { Circle().fill(item.color).frame(width: 9,height: 9); Text(item.name).frame(width: 100, alignment: .leading); GeometryReader { geo in RoundedRectangle(cornerRadius: 4).fill(item.color.opacity(0.2)).overlay(alignment: .leading) { RoundedRectangle(cornerRadius: 4).fill(item.color).frame(width: max(4,geo.size.width * CGFloat(item.bytes) / CGFloat(max(scan.totalBytes,1)))) } }.frame(height: 9); Text(format(item.bytes)).font(.caption.monospacedDigit()).frame(width: 75,alignment:.trailing) } } }.padding(8) } label: { Label("Storage categories", systemImage: "chart.bar.fill").font(.headline) }; Text("Largest items").font(.headline); ForEach(scan.largeFiles.prefix(5)) { FileRow(item: $0) } }.padding(28) } }
}

struct EmptyState: View { let title:String, icon:String, message:String; var body: some View { VStack(spacing:12){Image(systemName:icon).font(.system(size:38)).foregroundStyle(.secondary);Text(title).font(.headline);Text(message).font(.callout).foregroundStyle(.secondary).multilineTextAlignment(.center)}.frame(maxWidth:420).padding(30) } }
struct CleanupPlanView: View {
    @EnvironmentObject var scan: ScanModel
    var candidateBytes: Int64 { scan.cleanupCandidates.reduce(0) { $0 + $1.bytes } }
    var body: some View {
        ScrollView {
            VStack(alignment:.leading, spacing:18) {
                HStack {
                    VStack(alignment:.leading, spacing:5) { Text("Your review queue").font(.title2.bold()); Text("Only user-owned candidates are counted. Nothing moves until you confirm.").foregroundStyle(.secondary) }
                    Spacer()
                    VStack(alignment:.trailing) { Text(format(candidateBytes)).font(.title.bold()).foregroundStyle(.purple); Text("reviewable space").font(.caption).foregroundStyle(.secondary) }
                }.padding(20).background(Color.purple.opacity(0.08), in:RoundedRectangle(cornerRadius:14))
                CleanupBucket(title:"Old installers & archives", detail:"Replaceable downloads older than 30 days", icon:"shippingbox", items:scan.safeQuickWins)
                CleanupBucket(title:"Large files", detail:"User-owned files of 100 MB or more", icon:"arrow.up.right.square", items:scan.safeLargeFiles)
                CleanupBucket(title:"Old files", detail:"Files not modified in more than one year", icon:"clock.arrow.circlepath", items:scan.safeOldFiles)
                if scan.cleanupCandidates.isEmpty { EmptyState(title:"No cleanup candidates yet",icon:"checkmark.seal",message:"Let this scan finish or choose a broader user folder such as Downloads or Home.").frame(maxWidth:.infinity) }
                Text("DiskSift excludes system-managed locations and individual project dependencies from this plan. Always review names and folders before continuing.").font(.caption).foregroundStyle(.secondary)
            }.padding(28)
        }
    }
}
struct CleanupBucket: View {
    @EnvironmentObject var scan: ScanModel
    let title:String, detail:String, icon:String, items:[FileItem]
    var bytes:Int64 { items.reduce(0) { $0 + $1.bytes } }
    var body: some View { GroupBox { HStack { VStack(alignment:.leading,spacing:4) { Text("\(items.count.formatted()) candidates · \(format(bytes))").font(.headline); Text(detail).font(.caption).foregroundStyle(.secondary) }; Spacer(); Button("Select for review") { scan.select(items) }.disabled(items.isEmpty || scan.scanning) }.padding(8) } label: { Label(title,systemImage:icon) } }
}
struct QuickWinsView: View { @EnvironmentObject var scan:ScanModel; var reclaimable:Int64 { scan.safeQuickWins.reduce(0){$0+$1.bytes} }; var body:some View { VStack(spacing:0) { HStack { VStack(alignment:.leading,spacing:5){Text("Safe place to start").font(.title2.bold());Text("Old installers and archives are usually easy to review and replace.").foregroundStyle(.secondary)};Spacer();VStack(alignment:.trailing){Text(format(reclaimable)).font(.title2.bold()).foregroundStyle(.purple);Text("reviewable space").font(.caption).foregroundStyle(.secondary)}}.padding(20).background(Color.purple.opacity(0.08),in:RoundedRectangle(cornerRadius:14)).padding(.horizontal,24);List { ForEach(scan.quickWins) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.quickWins.isEmpty { EmptyState(title:"No obvious quick wins",icon:"checkmark.seal",message:"No installers or archives older than 30 days were found in this scan.") } } } } }
struct AllFilesView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List(scan.filteredFiles) { FileRow(item:$0,canTrash:true) }.overlay { if scan.filteredFiles.isEmpty { EmptyState(title:"No matching files",icon:"magnifyingglass",message:"Try a different search or folder.") } } } }
struct LargeFilesView: View { @EnvironmentObject var scan: ScanModel; var body: some View { List { ForEach(scan.largeFiles.filter{$0.bytes >= 100_000_000}.prefix(100)) { FileRow(item: $0, canTrash: true) } }.overlay { if scan.files.isEmpty { EmptyState(title:"No files found",icon:"doc",message:"Choose another folder to scan.") } } } }
struct OldFilesView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List { ForEach(scan.oldFiles.prefix(250)) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.oldFiles.isEmpty { EmptyState(title:"Nothing old found",icon:"clock",message:"No files in this scan are older than one year.") } } } }
struct DuplicatesView: View {
    @EnvironmentObject var scan: ScanModel
    var body: some View {
        Group {
            if scan.duplicateScanning {
                VStack(spacing: 14) {
                    ProgressView().controlSize(.large)
                    Text("Verifying duplicate candidates…").font(.headline)
                    Text("This reads file contents in the background. You can keep using other DiskSift views.").font(.caption).foregroundStyle(.secondary)
                }
            } else if !scan.duplicatesAnalyzed {
                VStack(spacing: 14) {
                    Image(systemName: "square.on.square").font(.system(size: 42)).foregroundStyle(.purple)
                    Text("Find exact duplicates").font(.title2.bold())
                    Text("The fast scan groups candidates by size. Start verification when you need it; DiskSift will then compare their SHA-256 fingerprints.").multilineTextAlignment(.center).foregroundStyle(.secondary).frame(maxWidth: 470)
                    Button("Analyze Duplicates") { scan.analyzeDuplicates() }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large)
                }
            } else {
                List {
                    ForEach(Array(scan.duplicateGroups.enumerated()), id: \.offset) { _, group in
                        DuplicateGroupView(group: group)
                    }
                }.overlay {
                    if scan.duplicateGroups.isEmpty { EmptyState(title:"No exact duplicates",icon:"checkmark.circle",message:"No matching SHA-256 fingerprints were found among files larger than 1 MB.") }
                }
            }
        }
    }
}
struct DuplicateGroupView: View {
    @EnvironmentObject var scan: ScanModel
    let group:[FileItem]
    var ordered:[FileItem] { group.sorted { ScanModel.keeperScore($0) > ScanModel.keeperScore($1) } }
    var body: some View {
        SwiftUI.Section("\(format((group.first?.bytes ?? 0) * Int64(max(group.count - 1, 0)))) recoverable · SHA-256 match") {
            HStack { Label("Recommended keeper is marked below",systemImage:"checkmark.shield").font(.caption).foregroundStyle(.secondary); Spacer(); Button("Select copies") { scan.selectDuplicateCopies(in: group) } }
            ForEach(Array(ordered.enumerated()), id:\.element.id) { index, item in FileRow(item:item,canTrash:true,badge:index == 0 ? "KEEP" : nil) }
        }
    }
}
struct DeveloperJunkView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List { ForEach(scan.developerJunk.prefix(500)) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.developerJunk.isEmpty { EmptyState(title:"No developer clutter found",icon:"hammer",message:"Scan your Home folder to find node_modules, DerivedData, simulator, npm, and Gradle artifacts.") } } } }
struct Metric: View { let title:String,value:String,icon:String; var body: some View { VStack(alignment:.leading,spacing:8){Image(systemName:icon).foregroundStyle(.purple);Text(value).font(.title2.bold());Text(title).font(.caption).foregroundStyle(.secondary)}.frame(maxWidth:.infinity,alignment:.leading).padding(16).background(Color(nsColor:.controlBackgroundColor),in:RoundedRectangle(cornerRadius:12)) } }
struct FileRow: View { @EnvironmentObject var scan: ScanModel; @EnvironmentObject var license:LicenseManager; let item:FileItem; var canTrash=false; var badge:String?=nil; @State private var confirmTrash = false; var body: some View { HStack { if canTrash && license.isPro && item.cleanupRestriction == nil { Button { scan.toggleSelection(item) } label:{Image(systemName:scan.selectedIDs.contains(item.id) ? "checkmark.square.fill" : "square").foregroundStyle(scan.selectedIDs.contains(item.id) ? .purple : .secondary)}.buttonStyle(.borderless).disabled(scan.scanning || scan.duplicateScanning || scan.cleanupBusy).help("Select for cleanup") };Image(systemName:"doc.fill").foregroundStyle(.purple.opacity(0.75));VStack(alignment:.leading){HStack { Text(item.name).lineLimit(1); if let badge { Text(badge).font(.caption2.bold()).foregroundStyle(.green).padding(.horizontal,5).background(Color.green.opacity(0.12),in:Capsule()) } };Text(item.url.deletingLastPathComponent().path(percentEncoded:false)).font(.caption2).foregroundStyle(.secondary).lineLimit(1)};Spacer();Text(format(item.bytes)).font(.caption.monospacedDigit());Button { NSWorkspace.shared.open(item.url) } label:{Image(systemName:"eye")}.buttonStyle(.borderless).help("Open file");Button { NSWorkspace.shared.activateFileViewerSelecting([item.url]) } label:{Image(systemName:"folder")}.buttonStyle(.borderless).help("Reveal in Finder");if canTrash { Button { if let reason = item.cleanupRestriction { scan.error = reason } else { confirmTrash = true } } label:{Image(systemName: item.cleanupRestriction == nil ? "trash" : "info.circle")}.buttonStyle(.borderless).disabled(scan.scanning || scan.duplicateScanning || scan.cleanupBusy).help(item.cleanupRestriction ?? "Review and move to Trash").confirmationDialog("Move \(item.name) to Trash?", isPresented: $confirmTrash) { Button("Move to Trash", role: .destructive) { scan.trash(item) }; Button("Cancel", role: .cancel) {} } message: { Text("Confirm you no longer need this file. You can restore it from Trash until Trash is emptied.") } } }.padding(.vertical,4) } }

struct CleanupReceiptView: View {
    @Environment(\.dismiss) var dismiss
    let receipt:CleanupReceipt
    var body:some View { VStack(spacing:18) { Image(systemName:receipt.movedCount > 0 ? "checkmark.circle.fill" : "exclamationmark.circle").font(.system(size:48)).foregroundStyle(receipt.movedCount > 0 ? .green : .orange); Text("Cleanup receipt").font(.title.bold()); Text(format(receipt.movedBytes)).font(.system(size:36,weight:.bold)).foregroundStyle(.purple); Text("\(receipt.movedCount) item(s) moved to Trash").font(.headline); if receipt.failedCount > 0 { Text("\(receipt.failedCount) item(s) stayed in place because macOS did not allow access.").foregroundStyle(.secondary).multilineTextAlignment(.center) }; Text("Nothing was permanently deleted. Storage becomes available after you review and empty Trash.").foregroundStyle(.secondary).multilineTextAlignment(.center).frame(maxWidth:380); HStack { Button("Open Trash") { NSWorkspace.shared.open(FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent(".Trash")) }; Button("Done") { dismiss() }.buttonStyle(.borderedProminent).tint(.purple) } }.padding(34).frame(width:480) }
}

struct LicenseView: View {
    @EnvironmentObject var license: LicenseManager; @Environment(\.dismiss) var dismiss; @State private var key=""; @State private var activating=false
    var body: some View { VStack(spacing:18) { Image(systemName:"sparkles").font(.system(size:38)).foregroundStyle(.purple);Text("Unlock DiskSift Pro").font(.title.bold());Text("One payment. Yours forever.").foregroundStyle(.secondary);Text("$12.99 launch price").font(.system(size:34,weight:.bold));VStack(alignment:.leading,spacing:8){Label("Build a safe cleanup plan",systemImage:"checkmark");Label("Select and trash files in one batch",systemImage:"checkmark");Label("Find exact duplicates and choose copies",systemImage:"checkmark");Label("Use on three personal Macs",systemImage:"checkmark")}.font(.callout);Link("Buy a lifetime license",destination:URL(string:"https://disksift.com/buy")!).buttonStyle(.borderedProminent).tint(.purple).controlSize(.large);Divider();HStack{TextField("DISKSIFT-PRO-XXXX-XXXX-XXXX-XXXX-XXXX",text:$key).textFieldStyle(.roundedBorder).disabled(activating);Button(activating ? "Activating…" : "Activate"){activating=true;Task{if await license.activate(key){dismiss()};activating=false}}.disabled(activating)}.frame(maxWidth:420);if let message=license.activationMessage{Text(message).font(.caption).foregroundStyle(.red).multilineTextAlignment(.center)};Text("Activation checks only your license and an anonymous device identifier. Your scan data never leaves your Mac.").font(.caption2).foregroundStyle(.secondary).multilineTextAlignment(.center);Button("Continue with Free") { dismiss() }.buttonStyle(.link) }.padding(32).frame(width:500) }
}
struct SettingsView: View { @EnvironmentObject var license: LicenseManager; @AppStorage("disksift.share-anonymous-impact") private var shareImpact=false; var body: some View { Form { SwiftUI.Section("License") { LabeledContent("Plan",value:license.isPro ? "DiskSift Pro · Lifetime" : "DiskSift Free");if license.isPro{Button("Deactivate this Mac",role:.destructive){license.deactivate()}}else{Button("Enter license key"){license.showingLicense=true}} }; SwiftUI.Section("Privacy") { Toggle("Share anonymous cleaned-space totals",isOn:$shareImpact);Text(shareImpact ? "DiskSift sends only bytes moved to Trash and a pseudonymous installation ID—never file names, paths, contents, or scan results." : "Off by default. DiskSift does not send cleanup totals.").font(.caption).foregroundStyle(.secondary) } }.padding(24) } }

func format(_ bytes:Int64)->String { ByteCountFormatter.string(fromByteCount:bytes,countStyle:.file) }
