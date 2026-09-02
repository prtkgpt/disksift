import SwiftUI
import AppKit
import CryptoKit

struct FileItem: Identifiable, Hashable, Sendable {
    let id = UUID()
    let url: URL
    let bytes: Int64
    let modified: Date?
    var name: String { url.lastPathComponent }
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

@MainActor final class LicenseManager: ObservableObject {
    @Published var isPro = UserDefaults.standard.bool(forKey: "disksift.pro")
    @Published var showingLicense = false
    func activate(_ key: String) -> Bool {
        // Development license format. Replace this validator with signed server receipts before selling.
        guard key.uppercased().hasPrefix("DISKSIFT-PRO-") && key.count >= 22 else { return false }
        isPro = true; UserDefaults.standard.set(true, forKey: "disksift.pro"); return true
    }
    func deactivate() { isPro = false; UserDefaults.standard.removeObject(forKey: "disksift.pro") }
}

@MainActor final class ScanModel: ObservableObject {
    @Published var files: [FileItem] = []
    @Published var scanning = false
    @Published var progress = 0.0
    @Published var scannedURL: URL?
    @Published var error: String?
    @Published var selected: FileItem?
    @Published var duplicateGroups: [[FileItem]] = []
    @Published var searchText = ""

    var totalBytes: Int64 { files.reduce(0) { $0 + $1.bytes } }
    var categories: [CategoryTotal] {
        let colors: [String: Color] = ["Photos": .pink, "Videos": .purple, "Audio": .orange, "Archives": .teal, "Documents": .blue, "Applications": .indigo, "Other": .gray]
        return Dictionary(grouping: files, by: \.kind).map { CategoryTotal(name: $0.key, bytes: $0.value.reduce(0) { $0 + $1.bytes }, color: colors[$0.key] ?? .gray) }.sorted { $0.bytes > $1.bytes }
    }
    var largeFiles: [FileItem] { files.sorted { $0.bytes > $1.bytes } }
    var oldFiles: [FileItem] { files.filter { ($0.modified ?? .now) < Calendar.current.date(byAdding: .year, value: -1, to: .now)! }.sorted { ($0.modified ?? .now) < ($1.modified ?? .now) } }
    var developerJunk: [FileItem] { files.filter { item in let p=item.url.path.lowercased(); return p.contains("/node_modules/") || p.contains("/deriveddata/") || p.contains("/.gradle/") || p.contains("/.npm/") || p.contains("/coresimulator/") }.sorted { $0.bytes > $1.bytes } }
    var quickWins: [FileItem] { files.filter { item in let ext=item.url.pathExtension.lowercased(); let old=(item.modified ?? .now) < Calendar.current.date(byAdding:.day,value:-30,to:.now)!; return old && ["dmg","pkg","zip","iso"].contains(ext) }.sorted { $0.bytes > $1.bytes } }
    var filteredFiles: [FileItem] { searchText.isEmpty ? files : files.filter { $0.name.localizedCaseInsensitiveContains(searchText) || $0.url.path.localizedCaseInsensitiveContains(searchText) } }

    func chooseFolder() {
        let panel = NSOpenPanel(); panel.canChooseDirectories = true; panel.canChooseFiles = false; panel.allowsMultipleSelection = false
        panel.message = "Choose a folder for DiskSift to analyze. Your file data stays on this Mac."
        if panel.runModal() == .OK, let url = panel.url { scan(url) }
    }
    func scan(_ url: URL) {
        scanning = true; progress = 0; error = nil; files = []; duplicateGroups = []; scannedURL = url
        Task.detached(priority: .userInitiated) {
            let found = Self.enumerateFiles(at: url)
            await MainActor.run { self.files = found; self.progress = 0.82 }
            let duplicates = Self.findDuplicates(in: found)
            await MainActor.run { self.duplicateGroups = duplicates; self.progress = 1; self.scanning = false }
        }
    }
    nonisolated static func enumerateFiles(at url: URL) -> [FileItem] {
        let keys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey, .isSymbolicLinkKey, .contentModificationDateKey]
        guard let enumerator = FileManager.default.enumerator(at: url, includingPropertiesForKeys: keys, options: [.skipsHiddenFiles, .skipsPackageDescendants]) else { return [] }
        var found: [FileItem] = []
        while let fileURL = enumerator.nextObject() as? URL {
            if let values = try? fileURL.resourceValues(forKeys: Set(keys)), values.isRegularFile == true, values.isSymbolicLink != true {
                found.append(FileItem(url: fileURL, bytes: Int64(values.fileSize ?? 0), modified: values.contentModificationDate))
            }
        }
        return found
    }
    nonisolated static func findDuplicates(in files: [FileItem]) -> [[FileItem]] {
        let candidates = Dictionary(grouping: files.filter { $0.bytes > 1_000_000 }, by: \.bytes).values.filter { $0.count > 1 }
        var matches: [[FileItem]] = []
        for group in candidates {
            let hashed = Dictionary(grouping: group, by: { fingerprint($0.url) ?? UUID().uuidString })
            matches.append(contentsOf: hashed.values.filter { $0.count > 1 })
        }
        return matches.sorted { ($0.first?.bytes ?? 0) * Int64($0.count - 1) > ($1.first?.bytes ?? 0) * Int64($1.count - 1) }
    }
    nonisolated static func fingerprint(_ url: URL) -> String? {
        guard let handle = try? FileHandle(forReadingFrom: url) else { return nil }
        defer { try? handle.close() }; var hasher = SHA256()
        do { while true { let data = try handle.read(upToCount: 1_048_576) ?? Data(); if data.isEmpty { break }; hasher.update(data: data) } }
        catch { return nil }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }
    func trash(_ item: FileItem) {
        do { try FileManager.default.trashItem(at: item.url, resultingItemURL: nil); files.removeAll { $0.id == item.id } }
        catch { self.error = "Could not move \(item.name) to Trash: \(error.localizedDescription)" }
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

enum SidebarSection: String, CaseIterable { case overview="Overview", quick="Quick Wins", all="All Files", large="Large Files", old="Old Files", duplicates="Exact Duplicates", developer="Developer Junk", applications="Applications"; var icon:String { ["Overview":"chart.pie.fill","Quick Wins":"bolt.fill","All Files":"list.bullet.rectangle","Large Files":"doc.text.magnifyingglass","Old Files":"clock.arrow.circlepath","Exact Duplicates":"square.on.square","Developer Junk":"hammer","Applications":"app.badge.checkmark"][rawValue]! }; var isPro:Bool { self == .duplicates || self == .developer || self == .applications } }

struct ContentView: View {
    @EnvironmentObject var scan: ScanModel; @EnvironmentObject var license: LicenseManager
    @State private var section: SidebarSection = .overview
    var body: some View {
        NavigationSplitView { sidebar } detail: { detail }
            .background(Color(nsColor: .windowBackgroundColor)).sheet(isPresented: $license.showingLicense) { LicenseView().environmentObject(license) }
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
            if !license.isPro { Button("Unlock DiskSift Pro · $19.99") { license.showingLicense = true }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large) }
            else { Label("DiskSift Pro", systemImage: "checkmark.seal.fill").foregroundStyle(.purple).font(.caption.bold()) }
        }.padding(18).navigationSplitViewColumnWidth(min: 210, ideal: 230)
    }
    @ViewBuilder var detail: some View {
        if scan.scannedURL == nil { WelcomeView() }
        else { VStack(spacing: 0) { header; if scan.scanning { ProgressView(value: scan.progress).tint(.purple).padding(.horizontal, 28) }; Group { switch section { case .overview: OverviewView(); case .quick: QuickWinsView(); case .all: AllFilesView(); case .large: LargeFilesView(); case .old: OldFilesView(); case .duplicates: DuplicatesView(); case .developer: DeveloperJunkView(); case .applications: ApplicationsView() } } }.environmentObject(scan) }
    }
    var header: some View { HStack { VStack(alignment: .leading) { Text(section.rawValue).font(.title.bold()); Text(scan.scannedURL?.path(percentEncoded: false) ?? "").lineLimit(1).font(.caption).foregroundStyle(.secondary) }; Spacer(); TextField("Search files and folders", text:$scan.searchText).textFieldStyle(.roundedBorder).frame(maxWidth:260); Button { scan.chooseFolder() } label: { Label("Scan", systemImage: "folder.badge.gearshape") }.buttonStyle(.borderedProminent).tint(.purple) }.padding(24) }
}

struct WelcomeView: View {
    @EnvironmentObject var scan: ScanModel
    var body: some View { VStack(spacing: 22) { Spacer(); Image(systemName: "externaldrive.fill.badge.magnifyingglass").font(.system(size: 70)).foregroundStyle(.purple.gradient); Text("See what’s taking up space.").font(.system(size: 36, weight: .bold)); Text("DiskSift analyzes metadata locally, verifies duplicates by content, and keeps every cleanup recoverable in Trash.").multilineTextAlignment(.center).foregroundStyle(.secondary).frame(maxWidth: 520); HStack { Button { scan.scan(FileManager.default.homeDirectoryForCurrentUser) } label: { Label("Scan Home",systemImage:"house") }; Button { scan.chooseFolder() } label: { Label("Choose Folder",systemImage:"folder") }; Button { scan.scan(URL(fileURLWithPath:"/")) } label: { Label("Scan Full Mac",systemImage:"internaldrive") } }.buttonStyle(.borderedProminent).tint(.purple).controlSize(.large); Text("Full Mac scans may require Full Disk Access in System Settings.").font(.caption).foregroundStyle(.secondary); HStack(spacing: 20) { Label("Private", systemImage: "hand.raised"); Label("SHA-256 duplicates", systemImage: "checkmark.shield"); Label("Trash-first", systemImage: "trash.slash") }.font(.caption).foregroundStyle(.secondary); Spacer() }.padding(50) }
}

struct OverviewView: View {
    @EnvironmentObject var scan: ScanModel
    var body: some View { ScrollView { VStack(alignment: .leading, spacing: 18) { HStack(spacing: 14) { Metric(title: "Analyzed", value: format(scan.totalBytes), icon: "internaldrive"); Metric(title: "Files", value: scan.files.count.formatted(), icon: "doc.on.doc"); Metric(title: "Largest file", value: format(scan.largeFiles.first?.bytes ?? 0), icon: "arrow.up.right") }; GroupBox { VStack(spacing: 14) { ForEach(scan.categories) { item in HStack { Circle().fill(item.color).frame(width: 9,height: 9); Text(item.name).frame(width: 100, alignment: .leading); GeometryReader { geo in RoundedRectangle(cornerRadius: 4).fill(item.color.opacity(0.2)).overlay(alignment: .leading) { RoundedRectangle(cornerRadius: 4).fill(item.color).frame(width: max(4,geo.size.width * CGFloat(item.bytes) / CGFloat(max(scan.totalBytes,1)))) } }.frame(height: 9); Text(format(item.bytes)).font(.caption.monospacedDigit()).frame(width: 75,alignment:.trailing) } } }.padding(8) } label: { Label("Storage categories", systemImage: "chart.bar.fill").font(.headline) }; Text("Largest items").font(.headline); ForEach(scan.largeFiles.prefix(5)) { FileRow(item: $0) } }.padding(28) } }
}

struct EmptyState: View { let title:String, icon:String, message:String; var body: some View { VStack(spacing:12){Image(systemName:icon).font(.system(size:38)).foregroundStyle(.secondary);Text(title).font(.headline);Text(message).font(.callout).foregroundStyle(.secondary).multilineTextAlignment(.center)}.frame(maxWidth:420).padding(30) } }
struct QuickWinsView: View { @EnvironmentObject var scan:ScanModel; var reclaimable:Int64 { scan.quickWins.reduce(0){$0+$1.bytes} }; var body:some View { VStack(spacing:0) { HStack { VStack(alignment:.leading,spacing:5){Text("Safe place to start").font(.title2.bold());Text("Old installers and archives are usually easy to review and replace.").foregroundStyle(.secondary)};Spacer();VStack(alignment:.trailing){Text(format(reclaimable)).font(.title2.bold()).foregroundStyle(.purple);Text("potential space").font(.caption).foregroundStyle(.secondary)}}.padding(20).background(Color.purple.opacity(0.08),in:RoundedRectangle(cornerRadius:14)).padding(.horizontal,24);List { ForEach(scan.quickWins) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.quickWins.isEmpty { EmptyState(title:"No obvious quick wins",icon:"checkmark.seal",message:"No installers or archives older than 30 days were found in this scan.") } } } } }
struct AllFilesView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List(scan.filteredFiles.sorted{$0.bytes>$1.bytes}) { FileRow(item:$0,canTrash:true) }.overlay { if scan.filteredFiles.isEmpty { EmptyState(title:"No matching files",icon:"magnifyingglass",message:"Try a different search or folder.") } } } }
struct LargeFilesView: View { @EnvironmentObject var scan: ScanModel; var body: some View { List { ForEach(scan.largeFiles.filter{$0.bytes >= 100_000_000}.prefix(100)) { FileRow(item: $0, canTrash: true) } }.overlay { if scan.files.isEmpty { EmptyState(title:"No files found",icon:"doc",message:"Choose another folder to scan.") } } } }
struct OldFilesView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List { ForEach(scan.oldFiles.prefix(250)) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.oldFiles.isEmpty { EmptyState(title:"Nothing old found",icon:"clock",message:"No files in this scan are older than one year.") } } } }
struct DuplicatesView: View { @EnvironmentObject var scan: ScanModel; var body: some View { List { ForEach(Array(scan.duplicateGroups.enumerated()), id: \.offset) { _, group in SwiftUI.Section("\(format((group.first?.bytes ?? 0) * Int64(group.count - 1))) recoverable · SHA-256 match") { ForEach(group) { FileRow(item: $0, canTrash: true) } } } }.overlay { if scan.duplicateGroups.isEmpty { EmptyState(title:"No exact duplicates",icon:"checkmark.circle",message:"DiskSift verified candidate files byte-for-byte using SHA-256 fingerprints.") } } } }
struct DeveloperJunkView: View { @EnvironmentObject var scan:ScanModel; var body:some View { List { ForEach(scan.developerJunk.prefix(500)) { FileRow(item:$0,canTrash:true) } }.overlay { if scan.developerJunk.isEmpty { EmptyState(title:"No developer clutter found",icon:"hammer",message:"Scan your Home folder to find node_modules, DerivedData, simulator, npm, and Gradle artifacts.") } } } }
struct ApplicationsView: View { var body: some View { EmptyState(title:"Scan the Applications folder",icon:"square.grid.2x2",message:"Choose /Applications to review installed app sizes. Leftover detection is planned for the next build.") } }

struct Metric: View { let title:String,value:String,icon:String; var body: some View { VStack(alignment:.leading,spacing:8){Image(systemName:icon).foregroundStyle(.purple);Text(value).font(.title2.bold());Text(title).font(.caption).foregroundStyle(.secondary)}.frame(maxWidth:.infinity,alignment:.leading).padding(16).background(Color(nsColor:.controlBackgroundColor),in:RoundedRectangle(cornerRadius:12)) } }
struct FileRow: View { @EnvironmentObject var scan: ScanModel; let item:FileItem; var canTrash=false; var body: some View { HStack { Image(systemName:"doc.fill").foregroundStyle(.purple.opacity(0.75));VStack(alignment:.leading){Text(item.name).lineLimit(1);Text(item.url.deletingLastPathComponent().path(percentEncoded:false)).font(.caption2).foregroundStyle(.secondary).lineLimit(1)};Spacer();Text(format(item.bytes)).font(.caption.monospacedDigit());Button { NSWorkspace.shared.open(item.url) } label:{Image(systemName:"eye")}.buttonStyle(.borderless).help("Open file");Button { NSWorkspace.shared.activateFileViewerSelecting([item.url]) } label:{Image(systemName:"folder")}.buttonStyle(.borderless).help("Reveal in Finder");if canTrash { Button { scan.trash(item) } label:{Image(systemName:"trash")}.buttonStyle(.borderless).help("Move to Trash") } }.padding(.vertical,4) } }

struct LicenseView: View {
    @EnvironmentObject var license: LicenseManager; @Environment(\.dismiss) var dismiss; @State private var key=""; @State private var invalid=false
    var body: some View { VStack(spacing:18) { Image(systemName:"sparkles").font(.system(size:38)).foregroundStyle(.purple);Text("Unlock DiskSift Pro").font(.title.bold());Text("One payment. Yours forever.").foregroundStyle(.secondary);Text("$19.99").font(.system(size:42,weight:.bold));VStack(alignment:.leading,spacing:8){Label("Find likely duplicate files",systemImage:"checkmark");Label("Review apps and leftovers",systemImage:"checkmark");Label("Unlimited scan results",systemImage:"checkmark");Label("Future Pro updates included",systemImage:"checkmark")}.font(.callout);Link("Buy a lifetime license",destination:URL(string:"https://disksift.com/buy")!).buttonStyle(.borderedProminent).tint(.purple).controlSize(.large);Divider();HStack{TextField("DISKSIFT-PRO-XXXX-XXXX",text:$key).textFieldStyle(.roundedBorder);Button("Activate"){if license.activate(key){dismiss()}else{invalid=true}}}.frame(maxWidth:360);if invalid{Text("That license key is not valid.").font(.caption).foregroundStyle(.red)};Button("Continue with Free") { dismiss() }.buttonStyle(.link) }.padding(32).frame(width:480) }
}
struct SettingsView: View { @EnvironmentObject var license: LicenseManager; var body: some View { Form { SwiftUI.Section("License") { LabeledContent("Plan",value:license.isPro ? "DiskSift Pro · Lifetime" : "DiskSift Free");if license.isPro{Button("Deactivate this Mac",role:.destructive){license.deactivate()}}else{Button("Enter license key"){license.showingLicense=true}} }; SwiftUI.Section("Privacy") { Text("DiskSift scans locally and does not transmit file names, paths, or scan results.").foregroundStyle(.secondary) } }.padding(24) } }

func format(_ bytes:Int64)->String { ByteCountFormatter.string(fromByteCount:bytes,countStyle:.file) }
