import { contentBriefs } from "@/data/content-briefs";

const answers: Record<string, string> = {
  "why-is-my-mac-storage-full": "A Mac usually fills up because a few large libraries, downloads, applications, backups, or developer folders grow quietly over time. Measure folders first; the broad System Data label does not identify one removable folder.",
  "how-to-find-large-files-on-mac": "Use System Settings > General > Storage for an overview, Finder search for size filtering, or a local analyzer for a folder-by-folder view. Review every result before moving it to Trash.",
  "what-is-system-data-on-mac": "System Data is a catch-all category for Apple and third-party files that do not fit a more specific category, including caches, logs, support files, snapshots, plug-ins, and temporary data.",
  "reduce-system-data-mac": "Identify the real components first: old device backups, app caches, developer artifacts, installers, logs, and working copies. Never delete unknown items from System or Library folders in bulk.",
  "find-duplicate-files-mac": "Compare contents, not names alone. A reliable workflow groups files by size, fingerprints candidates, and lets you deliberately choose which verified copy to keep.",
  "delete-old-dmg-files-mac": "You can normally delete a DMG after copying the app to Applications and confirming it opens. Keep it only when you need that exact installer offline.",
  "delete-pkg-installers-mac": "A downloaded PKG can usually be deleted after installation succeeds. That does not uninstall the software, but retain licensed or difficult-to-replace installers when appropriate.",
  "uninstall-mac-app-completely": "Move the app to Trash first, then remove only support files clearly owned by it. Use the developer's uninstaller for security tools, drivers, VPNs, and system components.",
  "delete-mac-cache-files-safely": "Caches are generally rebuildable, but clearing all caches can sign you out, slow the next launch, or disrupt work. Quit the app and target only a known cache.",
  "clear-xcode-derived-data": "DerivedData contains rebuildable indexes and build products. Quit Xcode, remove only old project folders, and expect the next build and index to take longer.",
  "node-modules-disk-space-mac": "node_modules is large because projects install many dependency files and binaries. Remove it only from inactive projects or when a lockfile makes installation reproducible.",
  "delete-ios-simulator-data": "Delete unavailable runtimes and unused devices through Xcode settings or simctl. Preserve simulators whose local test data you still need.",
  "clean-docker-disk-space-mac": "Docker grows through images, build cache, stopped containers, and volumes. Inspect usage first because volumes can contain irreplaceable database data.",
  "clean-homebrew-cache": "Homebrew's downloaded archives are normally safe to clean using Homebrew's own commands. Review the proposed removal and never manually delete the Homebrew prefix.",
  "clean-npm-cache-mac": "npm's cache is self-healing and rarely the main problem. Verify it first; clean only for corruption or when measurement shows unusual growth.",
  "mac-other-storage": "Other is an older name for files macOS cannot place in a clearer category. Treat it as a reporting bucket and inspect actual folders and types.",
  "mac-storage-not-adding-up": "Totals differ because macOS recalculates asynchronously and treats purgeable space, APFS snapshots, clones, and shared files differently. Compare available capacity instead of summing labels.",
  "mac-system-data-keeps-growing": "System Data grows as apps cache content, developers build projects, devices create backups, or Time Machine records snapshots. Measure changes over time to identify the cause.",
  "delete-time-machine-local-snapshots": "Local snapshots are recoverable APFS history. Apple says macOS removes them as space is needed, so manual removal is usually unnecessary.",
  "clear-mac-log-files": "Most logs are small and rotate automatically. Remove only unusually large, stale logs tied to a known app after quitting it.",
  "find-old-files-mac": "Sort by last-opened or modified date, then determine whether candidates are archives, records, or active dependencies. Age is a review signal, not permission to delete.",
  "find-largest-folders-mac": "Scan from your Home folder, expand the largest branch, and repeat until you reach recognizable items. Folder totals often explain storage better than isolated files.",
  "clean-downloads-folder-mac": "Sort Downloads by size and date, remove installers already used, and relocate documents you need. Open ambiguous files before trashing them.",
  "delete-zip-files-after-extracting": "Delete a ZIP after confirming the extracted files are complete. Keep it when it is an original delivery, backup, or difficult to download again.",
  "remove-old-macos-installers": "Completed macOS installer apps can consume many gigabytes. Delete installers you are not using, but preserve a bootable copy if it is part of your recovery plan.",
  "duplicate-photos-mac": "Start with the Duplicates album in Photos when available. Never delete files directly from inside the Photos Library package in Finder.",
  "duplicate-videos-mac": "Compare videos by content and review visually; different edits or resolutions are not exact duplicates. Keep the best original and verify backups.",
  "same-name-files-not-duplicates": "Matching names prove little: different files can share a name and identical files can have different names. Confirm size and a content hash.",
  "sha256-duplicate-detection": "SHA-256 turns file bytes into a content fingerprint. Matching size and hashes provide strong evidence, with byte comparison available as a final check.",
  "delete-duplicate-files-safely": "Choose a keeper, prefer the copy in its proper library or project, trash extras, and test dependent apps. Never delete every member of a group.",
  "mac-app-leftover-files": "Apps store preferences, caches, state, containers, and data under Library. Remove only items whose bundle identifier clearly matches an uninstalled app.",
  "remove-application-support-files": "Application Support can contain databases, presets, downloads, and user work. Remove a folder only after identifying its owner and checking its contents.",
  "remove-preference-files-mac": "Preferences are usually tiny. Delete a known app's preference only to reset or finish uninstalling it, after preserving settings you need.",
  "remove-app-containers-mac": "Containers are sandboxed app data areas and can hold documents or account state. Delete one only after uninstalling its app and reviewing the data.",
  "orphaned-app-files-mac": "Confirm an orphan through its bundle identifier, receipt, or vendor name before removal. A similar name alone is not sufficient evidence.",
  "mac-disk-almost-full": "Create breathing room with known downloads or movable media, then empty Trash. Next inspect apps, documents, backups, and developer data systematically.",
  "how-much-free-space-mac": "There is no universal Apple-mandated percentage. Keep enough headroom for your largest normal tasks, updates, and temporary working files.",
  "does-full-disk-slow-mac": "Very low space can disrupt swap, caches, updates, and temporary files. Cleanup helps that condition but cannot fix unrelated CPU, memory, or network problems.",
  "free-space-before-macos-update": "Requirements vary by macOS version, model, and update type. Follow the installer's current requirement and leave extra working headroom.",
  "optimize-storage-mac": "Optimize Storage uses built-in recommendations and can keep some iCloud content on demand. Your iCloud capacity, network, and offline needs still matter.",
  "mac-storage-management-guide": "Use a repeatable cycle: measure, classify, review, remove safely, and verify. Start with large personal files and replaceable downloads.",
  "external-drive-storage-analysis": "Scan the selected volume, inspect its largest folders, and confirm a current backup before modifying archives or media libraries.",
  "icloud-drive-local-storage": "iCloud Drive keeps local copies of recent or explicitly downloaded items. Optimize Mac Storage may evict eligible copies when space is needed.",
  "full-disk-access-storage-analyzer": "macOS protects sensitive locations. An analyzer needs Full Disk Access only to measure those areas; folder-scoped scans use narrower permission.",
  "are-mac-cleaner-apps-safe": "A safer cleaner is transparent, notarized, local-first, reversible, and confirmation-based. Avoid tools that call broad system folders junk.",
  "storage-analyzer-privacy": "A private analyzer should not upload file names, paths, contents, folder structure, hashes, or scan history. Licensing should use minimal disclosed data.",
  "trash-vs-permanent-delete-mac": "Trash provides a review window; permanent deletion does not. Use Trash, test your Mac, and empty it only when confident.",
  "disksift-free-vs-pro": "Free includes local scans, large-file discovery, search, and manual actions. The planned $19.99 Pro edition adds duplicates, app cleanup, developer tools, batch workflows, and three personal Macs.",
  "how-to-use-disksift": "Install the notarized app, select a scan scope, review the largest categories, and use Reveal or Trash only for recognized items. Full Disk Access is optional for protected locations.",
  "disksift-apple-notarized": "DiskSift's DMG is Developer ID-signed and accepted by Apple's automated notary service. Notarization assists Gatekeeper; it is not App Store review or a guarantee of every cleanup decision."
};

const guidance: Record<string, string> = {
  "Developer Storage": "Developer data is often reproducible only when source code, lockfiles, images, and databases are preserved. Prefer each tool's inspection and cleanup commands.",
  "Duplicates": "Exact duplicates are established from content, not names or dates. Libraries may reference files internally, so remove copies through the owning app when possible.",
  "App Cleanup": "Support folders may contain user data. Quit the app, back up important files, identify its bundle identifier, and prefer a vendor uninstaller for system components.",
  "System Data": "System Data is a classification rather than a single folder, and its displayed size changes as macOS recalculates categories and manages purgeable space.",
  "Privacy & Safety": "Storage metadata can expose personal and business activity. Grant the narrowest useful permission and favor software that processes scans locally.",
  "Large Files": "Large does not mean unnecessary. Media libraries, virtual machines, archives, and project assets need context before removal.",
  "Quick Wins": "Installers and archives are useful first candidates because many are replaceable, but confirm installation or extraction before removal.",
  "DiskSift Guides": "DiskSift reports what is present and leaves the decision to you. It does not silently delete files or upload scan results."
};

export const articleDrafts = contentBriefs.map(([slug, title, category]) => {
  const answer = answers[slug];
  const context = guidance[category] ?? "macOS storage categories are estimates; folder-level measurement is more actionable. Available space may include purgeable capacity managed by macOS.";
  return {
    slug, title, category,
    excerpt: answer.split(/(?<=[.!?])\s/)[0],
    tags: ["Mac", "storage", category.toLowerCase()],
    body: `# ${title}\n\n## Short answer\n\n${answer}\n\n## What to understand before cleaning\n\n${context} A storage number is a starting point, not permission to delete. Check the item against your backups and the app that created it. If you cannot explain what a file does, leave it while you investigate.\n\nmacOS may take time to refresh its Storage view. Measure available space before and after cleanup, and allow categories time to recalculate.\n\n## A safe step-by-step approach\n\n- Check System Settings > General > Storage and note the available capacity.\n- Confirm important documents and libraries have a current backup.\n- Scan the smallest useful scope, usually your Home folder or the relevant project folder.\n- Sort by size, then review ownership, location, and last-used information.\n- Open or reveal uncertain items before acting.\n- Move reviewed items to Trash instead of deleting permanently.\n- Use the Mac normally before emptying Trash.\n\n## What not to do\n\nDo not bulk-delete from /System, /Library, or inside a library package. Do not remove every result merely because it is old, large, or shares a name. Avoid broad Terminal commands copied from old guides: macOS and application layouts change.\n\n## How DiskSift helps\n\nDiskSift scans locally and presents large folders and cleanup candidates without uploading file names, paths, contents, or scan results. Start with Reveal in Finder. Choose files yourself and use Trash-first cleanup so a recovery window remains. DiskSift cannot know the personal or business value of a file.\n\n## Frequently asked questions\n\n### Will this automatically make my Mac faster?\n\nNot necessarily. Cleanup addresses capacity. Performance can also depend on memory pressure, CPU load, thermal conditions, disk health, and network activity.\n\n### Why did the number not change immediately?\n\nThe item may remain in Trash, another copy may exist, or macOS may still be recalculating. Confirm the file is gone and check available capacity later.\n\n### Should I permanently delete files?\n\nOnly when you have a verified backup and accept that normal Trash recovery will be unavailable. Trash is the safer default.\n\n## Sources and further reading\n\n- [Apple: Free up storage space on Mac](https://support.apple.com/102624)\n- [Apple: About Time Machine local snapshots](https://support.apple.com/102154)\n- [DiskSift privacy policy](https://disksift.com/privacy)\n`
  };
});
