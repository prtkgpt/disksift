type Step = { heading: string; text: string };
type Faq = { question: string; answer: string };

type ConsumerTopic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  priority: boolean;
  answer: string;
  causes: string[];
  steps: Step[];
  avoid: string[];
  faq: Faq[];
  related: { label: string; href: string }[];
  sources: { label: string; href: string }[];
};

const topics: ConsumerTopic[] = [
  {
    slug: "free-up-space-on-mac-without-deleting-important-files",
    title: "How to Free Up Space on a Mac Without Deleting Important Files",
    excerpt: "A calm cleanup plan that starts with replaceable downloads, verified duplicates, and files you recognize—not mysterious system folders.",
    category: "Safe Mac Cleanup",
    tags: ["Mac storage full", "free up space", "safe cleanup"],
    priority: true,
    answer: "Start with evidence, not a one-click clean button. Check how much space is actually available, find the largest user-owned files, and begin with items that are replaceable: old installers, completed downloads, duplicate copies, and videos you already backed up. Move reviewed items to Trash first. Leave System, Library, application data, and unfamiliar files alone until you know what created them.",
    causes: [
      "A few large videos, downloads, or device backups can matter more than thousands of tiny files.",
      "Photos, Messages, and Mail can keep local copies even when the same content also exists online.",
      "The System Data label combines many unrelated items, so its total is not a delete list.",
      "Trash still occupies disk space until it is emptied, and macOS storage categories can take time to refresh."
    ],
    steps: [
      { heading: "Write down the current available space", text: "Open Apple menu > System Settings > General > Storage. Use available capacity as your before-and-after number. The colored categories are useful clues, but they may recalculate slowly." },
      { heading: "Confirm your backup", text: "Make sure documents, photos, and work files exist in a current backup before cleanup. Cloud sync is not always the same as a separate backup because deletions may sync too." },
      { heading: "Review the largest personal files", text: "Look in Downloads, Movies, Desktop, Documents, and your home folder. Sort by size. Open or reveal anything you do not recognize before deciding." },
      { heading: "Take the low-risk wins", text: "Old DMG and PKG installers are often replaceable after the installed app works. ZIP files may be removable after you verify the extracted folder. Exact duplicate copies can be reviewed after content verification." },
      { heading: "Use Trash as a safety window", text: "Move selected items to Trash, use the Mac normally, and only empty Trash after you are confident nothing is missing. Storage is not fully reclaimed until then." }
    ],
    avoid: ["Deleting everything labeled System Data", "Removing folders from /System or /Library", "Deleting inside a Photos library package in Finder", "Trusting file age or a familiar name as proof that an item is disposable"],
    faq: [
      { question: "What is usually safest to remove first?", answer: "Old installers and archives you can download again, followed by exact duplicate copies where you have deliberately chosen a keeper." },
      { question: "Will freeing storage make my Mac faster?", answer: "It can help when the drive is extremely full and macOS lacks working space, but it will not fix unrelated CPU, memory, battery, or network problems." }
    ],
    related: [
      { label: "What can I safely delete on my Mac?", href: "https://www.disksift.com/blog/what-can-i-safely-delete-on-my-mac" },
      { label: "Why is my Mac storage full?", href: "https://www.disksift.com/blog/why-is-my-mac-storage-full" }
    ],
    sources: [{ label: "Apple: Free up storage space on Mac", href: "https://support.apple.com/102624" }]
  },
  {
    slug: "what-can-i-safely-delete-on-my-mac",
    title: "What Can I Safely Delete on My Mac?",
    excerpt: "A plain-English guide to low-risk files, files that need review, and Mac folders you should not delete manually.",
    category: "Safe Mac Cleanup",
    tags: ["safe to delete", "Mac cleaner", "Mac storage"],
    priority: true,
    answer: "There is no universal folder called junk. A file is low risk only when you understand what it is, why it exists, and how you would recover it. Old downloaded installers and verified duplicate copies are good starting points. Personal media and documents require judgment. System files and application databases should be managed by macOS or the app that owns them.",
    causes: [
      "Downloaded DMG and PKG files usually remain after installation and do not uninstall the app when removed.",
      "ZIP archives may duplicate already extracted files, but sometimes the archive is the original delivery or backup.",
      "Large videos, documents, and photos may be valuable even when they have not been opened recently.",
      "Caches are often rebuildable, but broad cache deletion can sign you out, discard offline content, or make apps rebuild slowly."
    ],
    steps: [
      { heading: "Classify before selecting", text: "Identify whether the item is an installer, archive, personal document, media file, backup, app, or app data. If the category is unclear, reveal it in Finder and inspect its folder." },
      { heading: "Ask whether it is replaceable", text: "A download available from a trusted vendor is different from the only copy of a family video. Check the source and your backup before removal." },
      { heading: "For duplicates, choose a keeper", text: "Matching names are not enough. Verify file contents, keep the copy in the most appropriate folder, and remove only the extra copies—not every file in the group." },
      { heading: "Let the owning app manage its data", text: "Delete Photos items in Photos, Mail attachments in Mail, Messages attachments in Messages, device backups through Finder, and unused apps through their official uninstall process when provided." },
      { heading: "Trash, verify, then empty", text: "Trash-first cleanup provides a recovery period. Open important apps and files before permanently emptying Trash." }
    ],
    avoid: ["Anything inside /System", "Unknown folders in either Library folder", "Time Machine backup contents", "An entire Photos library because individual photos look duplicated", "Files selected only because an automated tool calls them junk"],
    faq: [
      { question: "Is it safe to delete DMG files?", answer: "Usually, after the app has been copied to Applications and launches successfully. Keep rare installers you cannot easily obtain again." },
      { question: "Is it safe to delete cache files?", answer: "A known app cache may be rebuildable, but use the app's own controls when possible and avoid deleting all caches indiscriminately." }
    ],
    related: [
      { label: "Delete old DMG files safely", href: "https://www.disksift.com/blog/delete-old-dmg-files-mac" },
      { label: "Move to Trash vs permanent delete", href: "https://www.disksift.com/blog/trash-vs-permanent-delete-mac" }
    ],
    sources: [{ label: "Apple: Find and delete files on your Mac", href: "https://support.apple.com/guide/mac-help/find-and-delete-files-mchlp1225/mac" }]
  },
  {
    slug: "mac-storage-not-updating-after-deleting-files",
    title: "Mac Storage Not Updating After You Delete Files? Try This",
    excerpt: "Why the storage number may not change immediately—and how to confirm whether your cleanup actually freed space.",
    category: "Mac Storage Problems",
    tags: ["storage not updating", "Mac storage", "Trash"],
    priority: true,
    answer: "First check Trash. Moving a file there does not immediately return its space. If Trash is empty, give macOS time to recalculate and compare the available capacity shown by Disk Utility or Finder rather than relying only on a colored category. Cloud sync, local snapshots, and an application that recreates a cache can also make the number appear unchanged.",
    causes: ["The deleted file is still in Trash", "The Storage settings panel is showing a cached category total", "A synced service downloaded another local copy", "The same content exists elsewhere", "An app recreated working files after relaunch", "Purgeable or snapshot space is being reported differently"],
    steps: [
      { heading: "Confirm the file is really gone", text: "Search for the filename and check Trash. Do not empty Trash until you are sure the correct item was removed." },
      { heading: "Measure available capacity", text: "In Finder, select the startup disk and choose File > Get Info, or open Disk Utility. Available space is the number that matters when installing an update or copying a file." },
      { heading: "Wait for category recalculation", text: "Close and reopen Storage settings after a few minutes. Large changes can take longer to appear, especially while Spotlight or cloud services are active." },
      { heading: "Check for regenerated or synced data", text: "Look at the same folder again. Mail, Photos, Messages, browsers, and cloud drives may restore content based on their settings." },
      { heading: "Restart only if needed", text: "A normal restart can close processes holding temporary files and refresh reporting. It should not be the first step if unsaved work is open." }
    ],
    avoid: ["Deleting more files simply because the chart did not refresh", "Disabling backups to force a smaller number", "Using Terminal snapshot commands without understanding the recovery impact"],
    faq: [
      { question: "Why did emptying Trash not change System Data?", answer: "The available capacity may have changed before the System Data category recalculated. Check the disk's available space directly." },
      { question: "Can an open app keep deleted space in use?", answer: "Some apps keep temporary files or recreate caches. Quit the owning app and measure again rather than deleting unrelated files." }
    ],
    related: [
      { label: "Why Mac storage numbers do not add up", href: "https://www.disksift.com/blog/mac-storage-not-adding-up" },
      { label: "What System Data means", href: "https://www.disksift.com/blog/what-is-system-data-on-mac" }
    ],
    sources: [{ label: "Apple: See used and available storage space", href: "https://support.apple.com/guide/mac-help/see-used-and-available-storage-space-mchlp1774/mac" }]
  },
  {
    slug: "documents-taking-up-space-on-mac",
    title: "Why Are Documents Taking Up So Much Space on My Mac?",
    excerpt: "The Documents category can include far more than word-processing files. Here is how to find the real space users safely.",
    category: "Mac Storage Problems",
    tags: ["Documents storage", "large files", "Mac storage"],
    priority: true,
    answer: "On macOS, Documents is a broad storage category. It can include PDFs and spreadsheets, but also ZIP archives, disk images, project folders, downloaded files, and other content that does not fit Photos, Music, or Applications. Do not delete the category as a group. Sort actual files and folders by size, then review the largest recognizable items.",
    causes: ["Downloaded archives and installers", "Screen recordings and exported videos saved outside Photos", "Old work or school project folders", "Virtual machine images and application exports", "Multiple copies created by email, browsers, or collaboration tools"],
    steps: [
      { heading: "Open Apple's storage view", text: "Go to System Settings > General > Storage and open the Documents recommendations if available. Review Large Files and Downloads rather than assuming every listed item is expendable." },
      { heading: "Inspect folders, not only filenames", text: "A single project folder can contain thousands of files. A folder-level scan explains the total better than a list of small internal items." },
      { heading: "Sort largest first", text: "Start with the top ten items. A few multi-gigabyte videos or archives usually offer more value than deleting hundreds of tiny documents." },
      { heading: "Open uncertain files", text: "Preview the item and reveal its location. The surrounding folder often tells you which app, client, class, or project owns it." },
      { heading: "Move or archive intentionally", text: "Files you rarely need may belong on a backed-up external drive. Confirm the copied file opens before removing the Mac copy." }
    ],
    avoid: ["Selecting all Documents", "Deleting an unfamiliar package or project database", "Moving a Photos or music library while its app is open", "Assuming iCloud means a separate backup exists"],
    faq: [
      { question: "Why is a video counted as Documents?", answer: "Storage categories depend on file location and how macOS classifies the item. A video outside a media library may appear under Documents." },
      { question: "Can DiskSift delete the Documents category?", answer: "No. DiskSift lets you browse the files behind a category so you can select specific items you recognize." }
    ],
    related: [
      { label: "How to find the largest folders on Mac", href: "https://www.disksift.com/blog/find-largest-folders-mac" },
      { label: "Clean the Downloads folder safely", href: "https://www.disksift.com/blog/clean-downloads-folder-mac" }
    ],
    sources: [{ label: "Apple: Optimize storage space on your Mac", href: "https://support.apple.com/guide/mac-help/optimize-storage-space-sysp4ee93ca4/mac" }]
  },
  {
    slug: "delete-iphone-backups-from-mac",
    title: "How to Find and Delete Old iPhone Backups From a Mac",
    excerpt: "Local iPhone and iPad backups can use many gigabytes. Manage them through Finder so you know which device and backup you are removing.",
    category: "Device Backups",
    tags: ["iPhone backup", "Mac storage", "MobileSync"],
    priority: true,
    answer: "Use Finder's Manage Backups screen instead of deleting random folders. Connect the iPhone or iPad, select it in Finder, open the General tab, and choose Manage Backups. Review the device and date, then delete only a backup you no longer need. If it is your only recovery copy, create a current replacement first.",
    causes: ["Each local device backup can contain settings, messages, app data, photos, and other device content", "Old phones may leave backups behind after you upgrade", "Archived backups are intentionally preserved and may not be replaced by the next backup", "A local encrypted backup and an iCloud backup are separate recovery methods"],
    steps: [
      { heading: "Decide which backup protects you", text: "Check whether you use iCloud Backup, local Finder backups, or both. Confirm the most recent successful backup before removing an older one." },
      { heading: "Open Manage Backups", text: "Connect the device, open Finder, select the device in the sidebar, choose General, and click Manage Backups." },
      { heading: "Match the device and date", text: "Do not judge by folder names in MobileSync. Finder presents the device context more clearly and can show the backup in Finder if you need to inspect its location." },
      { heading: "Delete only the obsolete backup", text: "Control-click the chosen backup and select Delete. Preserve an archived backup when it is needed for a downgrade, migration, legal record, or device recovery." },
      { heading: "Verify available space", text: "After deletion, confirm the disk's available space. Storage categories may take time to update." }
    ],
    avoid: ["Deleting the entire MobileSync folder", "Removing the newest backup before confirming another recovery copy", "Assuming an iCloud Photos library is a complete device backup"],
    faq: [
      { question: "Where are iPhone backups stored on Mac?", answer: "Apple documents the local location as ~/Library/Application Support/MobileSync/Backup/, but recommends managing backups through Finder or the Apple Devices app." },
      { question: "Does deleting a Mac backup erase the iPhone?", answer: "No, but it removes that recovery copy. The data currently on the phone remains unless changed separately." }
    ],
    related: [{ label: "Why System Data keeps growing", href: "https://www.disksift.com/blog/mac-system-data-keeps-growing" }],
    sources: [{ label: "Apple: Locate and manage iPhone and iPad backups", href: "https://support.apple.com/108809" }]
  },
  {
    slug: "delete-large-messages-attachments-on-mac",
    title: "How to Delete Large Messages Attachments on a Mac",
    excerpt: "Photos and videos in Messages can quietly consume storage. Review them inside Messages and understand what sync will delete elsewhere.",
    category: "Messages & Mail",
    tags: ["Messages attachments", "Mac storage", "large videos"],
    priority: true,
    answer: "Delete Messages attachments through the Messages app, not by removing files from hidden Library folders. Open a conversation, click the person or group at the top, review Photos or other attachment categories, and select only items you no longer need. If Messages in iCloud is enabled, a deletion can also affect your other devices.",
    causes: ["Long-running conversations accumulate photos, videos, audio messages, and documents", "The same attachment may appear on multiple Apple devices through Messages in iCloud", "Recently Deleted keeps removed messages and attachments recoverable for a limited period", "Automatic retention can be set to a shorter period, but that changes future behavior for all conversations"],
    steps: [
      { heading: "Check whether Messages uses iCloud", text: "Before cleanup, understand that synced deletions may appear on every device signed into the same Apple Account." },
      { heading: "Review one conversation", text: "Open Messages, select a conversation, click the contact or group icon, and expand an attachment category such as Photos." },
      { heading: "Start with large videos", text: "Videos usually reclaim more space than images or documents. Preview each one and save an important copy before deletion." },
      { heading: "Delete through Messages", text: "Shift-click the attachments you reviewed, Control-click, and choose Delete. This keeps the app's database consistent." },
      { heading: "Review Recently Deleted", text: "Messages keeps deleted content in Recently Deleted for up to 30 days. Permanently removing it ends that recovery window." }
    ],
    avoid: ["Deleting Messages database files in Library", "Removing an entire conversation to eliminate one large video", "Forgetting that iCloud sync can propagate the deletion"],
    faq: [
      { question: "Can I keep a photo but remove it from Messages?", answer: "Save or export the attachment first, confirm the saved copy opens, and then delete the message attachment." },
      { question: "Why did space not return immediately?", answer: "The attachment may remain in Recently Deleted, and macOS may still be updating its storage calculation." }
    ],
    related: [{ label: "Find and delete large videos on Mac", href: "https://www.disksift.com/blog/find-and-delete-large-videos-on-mac" }],
    sources: [{ label: "Apple: Delete messages and attachments on Mac", href: "https://support.apple.com/guide/messages/delete-messages-and-conversations-icht1035/mac" }]
  },
  {
    slug: "photos-library-too-large-on-mac",
    title: "Photos Library Too Large on Mac? Your Safe Options",
    excerpt: "Reduce a large Photos library without opening its package and deleting internal files in Finder.",
    category: "Photos & Videos",
    tags: ["Photos Library", "Mac storage", "iCloud Photos"],
    priority: true,
    answer: "Never open the Photos Library package and delete its internal files. Use Photos to remove unwanted items and review Recently Deleted. If you use iCloud Photos, Optimize Mac Storage can keep smaller local versions when space is needed. Another option is moving the entire library to a correctly formatted external drive after creating a backup.",
    causes: ["Original photos, 4K video, Live Photos, RAW images, and edits can be large", "Download Originals to This Mac intentionally keeps full-resolution local copies", "Deleted photos remain in Recently Deleted temporarily", "Multiple Photos libraries can exist in the Pictures folder", "Exports may create additional copies outside the library"],
    steps: [
      { heading: "Measure the library without opening it", text: "Quit Photos, find the Photos Library in Pictures, and use Get Info to see its size. Do not choose Show Package Contents for cleanup." },
      { heading: "Review inside Photos", text: "Use the Duplicates album when available, inspect large videos, and delete only media you recognize. Confirm important originals have a backup." },
      { heading: "Understand Recently Deleted", text: "Photos retains deleted items for a recovery period. Emptying Recently Deleted makes the removal permanent and may sync through iCloud Photos." },
      { heading: "Consider Optimize Mac Storage", text: "With iCloud Photos enabled, Photos > Settings > iCloud > Optimize Mac Storage allows macOS to keep space-saving local versions when storage is tight." },
      { heading: "Move the whole library carefully", text: "Apple supports moving a Photos library to a Mac-formatted external drive. Follow Apple's steps, open the moved library successfully, and keep a separate backup before deleting the original." }
    ],
    avoid: ["Deleting files inside the library package", "Treating iCloud sync as the only backup", "Moving the library to a Time Machine disk or an unsupported network/cloud location", "Disconnecting an external library while Photos is open"],
    faq: [
      { question: "Will Optimize Mac Storage delete my originals?", answer: "Full-resolution originals remain in iCloud; the Mac can keep smaller versions locally. Verify iCloud sync is complete and understand your iCloud storage plan first." },
      { question: "Can DiskSift clean inside Photos Library?", answer: "DiskSift should help identify the library's size, but photo removal belongs inside Photos so the library database remains consistent." }
    ],
    related: [{ label: "How to find duplicate photos on Mac", href: "https://www.disksift.com/blog/duplicate-photos-mac" }],
    sources: [
      { label: "Apple: Use iCloud Photos on Mac", href: "https://support.apple.com/guide/photos/use-icloud-photos-phtf5e48489c/mac" },
      { label: "Apple: Move your Photos library", href: "https://support.apple.com/108345" }
    ]
  },
  {
    slug: "macbook-air-storage-full",
    title: "MacBook Air Storage Full? A Safe 15-Minute Plan",
    excerpt: "A practical first response for a 128 GB or 256 GB MacBook Air that is running out of space.",
    category: "Mac Storage Problems",
    tags: ["MacBook Air storage full", "startup disk full", "free space"],
    priority: true,
    answer: "When a MacBook Air is nearly full, aim to create breathing room before chasing every category. Start with the largest replaceable item in Downloads, empty Trash after reviewing it, and restart if an update is blocked. Then identify the largest personal folders, device backups, media libraries, and applications. Avoid aggressive System Data cleanup while the Mac is under pressure.",
    causes: ["Smaller 128 GB and 256 GB drives fill quickly with photos, video, games, or creative apps", "A macOS update needs temporary working space beyond the download size", "iPhone backups and Messages attachments can grow quietly", "Cloud files can still have local downloaded copies", "Old installers remain after apps are installed"],
    steps: [
      { heading: "Minute 1: record available space", text: "Open System Settings > General > Storage. If the Mac is struggling, close large apps and save active work before cleanup." },
      { heading: "Minutes 2–5: inspect Downloads", text: "Sort Downloads by size. Old DMG installers, completed ZIP archives, and videos you already moved elsewhere are common first candidates." },
      { heading: "Minutes 6–9: check large personal files", text: "Review Movies, Desktop, and Documents. Move important but inactive media to a backed-up external drive rather than deleting it." },
      { heading: "Minutes 10–12: inspect backups and attachments", text: "Use Finder's Manage Backups for old iPhone backups. Review Messages and Mail attachments through their apps." },
      { heading: "Minutes 13–15: verify and empty Trash", text: "Open anything you moved or copied, then empty Trash only when confident. Recheck available space and let category totals refresh." }
    ],
    avoid: ["Installing several cleaner apps while space is critically low", "Deleting unknown Library folders", "Moving irreplaceable files without verifying the destination and backup", "Assuming every old file is unnecessary"],
    faq: [
      { question: "How much space should I free first?", answer: "There is no universal target. Create enough room for the blocked task plus working headroom; large macOS updates may need substantially more than their download size." },
      { question: "Should I buy iCloud storage?", answer: "It may help if your workflow suits optimized cloud storage, but it is not a substitute for reviewing large local files or keeping a separate backup." }
    ],
    related: [
      { label: "How much free space should a Mac have?", href: "https://www.disksift.com/blog/how-much-free-space-mac" },
      { label: "Clean Downloads safely", href: "https://www.disksift.com/blog/clean-downloads-folder-mac" }
    ],
    sources: [{ label: "Apple: Free up storage space on Mac", href: "https://support.apple.com/102624" }]
  },
  {
    slug: "remove-mail-attachments-from-mac-storage",
    title: "How to Remove Downloaded Mail Attachments From a Mac",
    excerpt: "Find large email attachments, save anything important, and remove them through Mail without damaging its data.",
    category: "Messages & Mail",
    tags: ["Mail attachments", "Mac storage", "email downloads"],
    priority: false,
    answer: "Manage attachments inside Mail. Select a message and choose Message > Remove Attachments after saving anything you need. For IMAP accounts, Apple notes that removing an attachment can also remove it from the mail server, so confirm your account behavior and preserve important files first. Mail's download settings can reduce future local storage use.",
    causes: ["Mail can automatically download attachments for offline access", "Large PDFs, videos, and image threads accumulate over years", "Saving an attachment to Downloads creates another copy", "Multiple mail accounts may each retain local content"],
    steps: [
      { heading: "Find messages with large attachments", text: "Use Mail search and mailbox sorting to narrow the review. Start with senders, projects, or date ranges you recognize." },
      { heading: "Save the files you need", text: "Use File > Save Attachments or the attachment menu. Verify the saved file before removing it from the message." },
      { heading: "Remove attachments in Mail", text: "Select the message and choose Message > Remove Attachments. The message remains, but the attachment behavior can depend on the account type." },
      { heading: "Review download preferences", text: "Mail > Settings > Accounts includes attachment download behavior. Choosing a narrower setting can reduce new local downloads." },
      { heading: "Check Downloads for extra copies", text: "Attachments you explicitly saved may also exist in Downloads. Treat those as separate files and review them independently." }
    ],
    avoid: ["Deleting Mail's Library folders in Finder", "Removing a server-side attachment before saving the only needed copy", "Assuming deleting a download removes the copy attached to the message"],
    faq: [
      { question: "Does Remove Attachments delete the email?", answer: "The message remains, but the attachment is removed. Apple notes that IMAP behavior can affect the server copy." },
      { question: "Why is Mail storage still large?", answer: "Mail also stores message indexes and cached content. Let Mail and macOS recalculate after cleanup rather than deleting its database manually." }
    ],
    related: [{ label: "Clean Downloads safely", href: "https://www.disksift.com/blog/clean-downloads-folder-mac" }],
    sources: [{ label: "Apple: View, save, or delete email attachments", href: "https://support.apple.com/guide/mail/view-save-or-delete-email-attachments-mlhlp1123/mac" }]
  },
  {
    slug: "find-and-delete-large-videos-on-mac",
    title: "How to Find and Delete Large Videos on a Mac",
    excerpt: "Locate space-hungry recordings and exports across Movies, Downloads, Photos, Messages, and project folders.",
    category: "Photos & Videos",
    tags: ["large videos", "screen recordings", "Mac storage"],
    priority: false,
    answer: "Large videos are often the fastest path to meaningful space because one file can use several gigabytes. Search by size and type across your home folder, but delete through the owning app when the video lives inside Photos, Messages, or a video-editing library. Preview each file and verify backups or exports before moving it to Trash.",
    causes: ["Screen recordings default to high-quality video and are easy to forget", "Phone and camera imports may exist in Photos and again in Downloads", "Video editors create render files, proxies, and exported versions", "Messages conversations can retain years of clips", "Meeting apps may save local recordings"],
    steps: [
      { heading: "Scan the user folders", text: "Start with Movies, Downloads, Desktop, and Documents. Filter for MOV, MP4, M4V, and MKV files and sort largest first." },
      { heading: "Preview before acting", text: "Use Quick Look or open the video. Similar names can represent an original, edited version, compressed delivery, or incomplete recording." },
      { heading: "Find the owner", text: "A file inside a Photos or editing library should be managed through that app. A standalone export in Downloads can be reviewed directly." },
      { heading: "Confirm the destination", text: "If archiving to an external drive, copy first, play the copied video, and confirm the backup before deleting the source." },
      { heading: "Clean generated media through the editor", text: "Final Cut Pro, iMovie, and other editors have controls for generated render or proxy files. Use those controls instead of deleting package internals." }
    ],
    avoid: ["Deleting every file with the same name", "Removing video-library package contents in Finder", "Assuming a cloud thumbnail proves the full original is backed up"],
    faq: [
      { question: "What video files are usually safe to delete?", answer: "Completed exports you can recreate and verified copies you no longer need are candidates, but only you can confirm their value." },
      { question: "Why do screen recordings use so much space?", answer: "Long duration, high resolution, and high frame rate can create multi-gigabyte recordings even when the desktop content looks simple." }
    ],
    related: [{ label: "Find large files on Mac", href: "https://www.disksift.com/blog/how-to-find-large-files-on-mac" }],
    sources: [{ label: "Apple: Free up storage space on Mac", href: "https://support.apple.com/102624" }]
  },
  {
    slug: "screenshots-taking-up-space-on-mac",
    title: "Are Screenshots Taking Up Space on Your Mac?",
    excerpt: "How to find old screenshots, review them quickly, and prevent your Desktop from filling up again.",
    category: "Everyday Cleanup",
    tags: ["screenshots", "Desktop cleanup", "Mac storage"],
    priority: false,
    answer: "A single screenshot is usually small, but years of high-resolution PNG files can add up. Search for screenshot filenames and image types, sort by size or date, and review batches with Quick Look. Preserve screenshots that document receipts, instructions, work, or legal records. Then change the screenshot save location if Desktop clutter is the recurring problem.",
    causes: ["Retina displays create relatively large PNG images", "Screenshots remain after being pasted into a document or message", "Long scrolling captures and screen recordings are much larger", "Desktop stacks can hide how many files have accumulated"],
    steps: [
      { heading: "Search the likely folders", text: "Check Desktop, Downloads, and Documents for names beginning with Screenshot or Screen Shot. Also filter PNG and JPG files by date." },
      { heading: "Use Quick Look in batches", text: "Select an item and press Space to preview. Arrow through nearby files so you can recognize receipts, references, and throwaway captures quickly." },
      { heading: "Sort by size and age", text: "Large screen recordings may appear alongside images. Review the biggest files first, then older groups." },
      { heading: "Move reviewed files to Trash", text: "Keep uncertain records. Trash the obvious repeats and temporary captures, then verify before emptying Trash." },
      { heading: "Choose a better save location", text: "Press Shift-Command-5, open Options, and choose a dedicated folder. A single folder is easier to review periodically than a scattered Desktop." }
    ],
    avoid: ["Bulk deleting screenshots without previews", "Removing images used by active presentations or documentation", "Confusing screen recordings with still screenshots"],
    faq: [
      { question: "Why are some screenshots much larger?", answer: "Display resolution, captured area, image complexity, and file format all affect size. Screen recordings are video and can be dramatically larger." },
      { question: "Can I change screenshots from PNG to JPG?", answer: "Conversion can reduce size, but it adds complexity and may reduce image quality. Cleaning unneeded captures usually has a clearer benefit." }
    ],
    related: [{ label: "Find old files on Mac", href: "https://www.disksift.com/blog/find-old-files-mac" }],
    sources: [{ label: "Apple: Take a screenshot on Mac", href: "https://support.apple.com/102646" }]
  },
  {
    slug: "cloud-files-using-space-on-mac",
    title: "Why Are iCloud, Dropbox, or Google Drive Files Using Mac Storage?",
    excerpt: "Cloud files can still have local copies. Learn what online-only, downloaded, and optimized storage states actually mean.",
    category: "Cloud Storage",
    tags: ["iCloud Drive", "Dropbox", "Google Drive"],
    priority: false,
    answer: "Cloud storage does not automatically mean zero local storage. Files you recently opened, pinned for offline use, or chose to download may remain on the Mac. Each service has its own command for making a file online-only or removing a local download. Use that command rather than deleting a synced file, because normal deletion may remove it from the cloud and other devices too.",
    causes: ["Recently opened files are cached locally", "Folders are marked available offline", "iCloud Optimize Mac Storage is disabled or has not needed to evict content", "A sync client stores temporary working data", "The same file also exists in Downloads or another non-synced folder"],
    steps: [
      { heading: "Identify the sync provider", text: "Reveal the file in Finder and note whether it lives in iCloud Drive, Dropbox, Google Drive, OneDrive, or another managed folder." },
      { heading: "Read the availability icon", text: "Finder and the provider's extension show whether an item is downloaded, syncing, pinned, or online-only. Do not infer status from the folder name alone." },
      { heading: "Use the provider's remove-download action", text: "For iCloud Drive, Finder can offer Remove Download for eligible items. Other providers use labels such as Online-only or Free up space." },
      { heading: "Verify online access", text: "Before removing a local copy, confirm sync is complete and the file appears through the provider's website or another device." },
      { heading: "Look for independent duplicates", text: "An exported or emailed copy outside the synced folder will not be affected by optimization and must be reviewed separately." }
    ],
    avoid: ["Pressing Delete when the goal is only to remove the local copy", "Making essential travel files online-only before going offline", "Assuming synchronization provides versioned backup protection"],
    faq: [
      { question: "Will Remove Download delete my iCloud file?", answer: "For an eligible, fully synced iCloud Drive file, Remove Download removes the local copy while keeping it in iCloud. Confirm the cloud status first." },
      { question: "Why did the file download again?", answer: "Opening it or marking its folder for offline use can restore a local copy. Provider settings and available disk space influence caching." }
    ],
    related: [{ label: "Why iCloud Drive uses local storage", href: "https://www.disksift.com/blog/icloud-drive-local-storage" }],
    sources: [{ label: "Apple: Optimize storage space on your Mac", href: "https://support.apple.com/guide/mac-help/optimize-storage-space-sysp4ee93ca4/mac" }]
  },
  {
    slug: "mac-cleaner-without-subscription",
    title: "Looking for a Mac Cleaner Without a Subscription?",
    excerpt: "What to compare when you want occasional storage cleanup without another recurring charge.",
    category: "Choosing a Mac Cleaner",
    tags: ["Mac cleaner no subscription", "one-time purchase", "storage analyzer"],
    priority: false,
    answer: "For occasional storage cleanup, compare the workflow before comparing the price. A useful no-subscription tool should show where space went, let you inspect files before acting, protect system locations, use Trash when possible, and explain what its paid license includes. Avoid paying for vague speed promises or an automatic junk score you cannot verify.",
    causes: ["Many maintenance apps bundle antivirus, VPN, memory tools, and recurring plans", "Storage cleanup is often needed only when a drive becomes crowded", "Free scanners sometimes charge only at the final delete step", "Lifetime can mean the current major version rather than every future release"],
    steps: [
      { heading: "Define the job", text: "If you need to find large personal files, choose a storage analyzer. If you need malware protection or an app uninstaller, those are different jobs and may justify different software." },
      { heading: "Test the free workflow", text: "Confirm the app can finish a real scan, browse categories, sort useful results, and reveal files before payment. A screenshot is not evidence that the workflow works on your Mac." },
      { heading: "Check deletion safeguards", text: "Look for protected system paths, clear warnings, duplicate keeper guidance, confirmation, and Trash-first actions." },
      { heading: "Read the license terms", text: "Check the number of Macs, refund period, update policy, and whether activation requires an account or only a license key." },
      { heading: "Verify privacy and notarization", text: "Read what metadata leaves the Mac and check that the download is signed and notarized. Notarization is a security baseline, not a guarantee of cleanup quality." }
    ],
    avoid: ["Buying before testing the scan", "Assuming lifetime includes every future major version", "Choosing based only on the largest claimed cleanup number", "Granting Full Disk Access without understanding why it is needed"],
    faq: [
      { question: "Is a one-time Mac cleaner better?", answer: "It may fit occasional cleanup better, but only if the product remains useful and the update terms are clear. Pricing model does not replace product quality." },
      { question: "Does DiskSift have a subscription?", answer: "DiskSift offers a free edition and a one-time Pro license for the purchased major version, with the current device and refund terms shown on its pricing page." }
    ],
    related: [
      { label: "Are Mac cleaner apps safe?", href: "https://www.disksift.com/blog/are-mac-cleaner-apps-safe" },
      { label: "DiskSift Free vs Pro", href: "https://www.disksift.com/blog/disksift-free-vs-pro" }
    ],
    sources: [{ label: "DiskSift pricing and feature details", href: "https://www.disksift.com/#pricing" }]
  },
  {
    slug: "disk-space-analyzer-vs-mac-cleaner",
    title: "Disk Space Analyzer vs Mac Cleaner: What Do You Actually Need?",
    excerpt: "One explains your storage; the other may automate removal. Here is how to choose the safer tool for your problem.",
    category: "Choosing a Mac Cleaner",
    tags: ["disk space analyzer", "Mac cleaner", "storage app"],
    priority: false,
    answer: "A disk space analyzer measures and organizes files so you can understand what consumes capacity. A Mac cleaner usually adds rules that label items for removal and may include unrelated maintenance tools. If your question is “what is taking up space?”, start with an analyzer. Automation becomes useful only after the results are transparent and the deletion rules are conservative.",
    causes: ["Apple's Storage view reports broad categories but may not expose the responsible folder", "Treemaps are good at showing proportion but can overwhelm nontechnical users", "Cleaner apps promise convenience but vary widely in what they classify as junk", "Some products combine cleanup with security and performance features"],
    steps: [
      { heading: "Start with the question", text: "Choose analysis when you need an explanation. Choose a specialized uninstaller for app removal. Choose Photos or Messages for content managed inside those libraries." },
      { heading: "Look for understandable results", text: "Useful tools show full file paths, sizes, types, dates, and a way to preview or reveal the item. A category total without drill-down is not actionable." },
      { heading: "Separate safe recommendations from personal files", text: "An old installer may be replaceable; a large family video is not junk. The product should make that distinction obvious." },
      { heading: "Check responsiveness on a real drive", text: "A scanner should work in the background, remain stoppable, and avoid freezing while sorting large result sets." },
      { heading: "Prefer reversible cleanup", text: "Moving reviewed items to Trash gives you a recovery window. Permanent actions should be rare and clearly labeled." }
    ],
    avoid: ["Tools that hide file locations", "Automatic removal of personal files", "Claims that storage cleanup fixes every kind of slow Mac", "Permanent deletion without a review step"],
    faq: [
      { question: "Can Finder replace a disk space analyzer?", answer: "Finder can search and sort files, but folder-size analysis across a large home directory is slower to assemble manually. Use whichever gives you enough context to decide safely." },
      { question: "Is a treemap necessary?", answer: "No. A sorted category and file browser can be easier for many people. The important part is accurate size information and clear drill-down." }
    ],
    related: [{ label: "How to find large files on Mac", href: "https://www.disksift.com/blog/how-to-find-large-files-on-mac" }],
    sources: [{ label: "Apple: Free up storage space on Mac", href: "https://support.apple.com/102624" }]
  },
  {
    slug: "empty-trash-not-freeing-space-on-mac",
    title: "Emptying Trash Did Not Free Space on Your Mac: What Now?",
    excerpt: "Confirm the real available-space number, look for files still in use or recreated, and avoid deleting more at random.",
    category: "Mac Storage Problems",
    tags: ["empty Trash", "storage not freed", "Mac disk full"],
    priority: false,
    answer: "Check the startup disk's available capacity before assuming cleanup failed. The Storage chart may lag. If available space truly did not change, confirm you emptied the correct user's Trash, restart apps that may hold or recreate temporary data, and check whether a synced service restored the item. Do not respond by deleting System files.",
    causes: ["Storage categories have not recalculated", "Another macOS user account has its own Trash", "An application recreated a cache or download", "The removed item was an APFS clone or shared data and did not consume the amount you expected", "Cloud sync downloaded another local copy", "The file was on a different volume"],
    steps: [
      { heading: "Compare the right disk", text: "Use Finder Get Info or Disk Utility for the startup volume. Make sure the deleted file was actually stored on that volume." },
      { heading: "Confirm Trash is empty", text: "Open Trash and look for remaining items. Other user accounts have separate Trash locations and must be handled by those users." },
      { heading: "Quit the owning application", text: "Browsers, editors, sync clients, and media apps can keep working files. Quit normally, reopen the storage view, and measure again." },
      { heading: "Look for the item again", text: "Search by name or scan the original folder. A sync tool or app may have restored a local copy." },
      { heading: "Allow macOS to update", text: "Wait, then reopen System Settings. A stale category label does not mean the drive lacks newly available capacity." }
    ],
    avoid: ["Repeatedly emptying Trash while important files are under review", "Deleting Time Machine snapshots solely to change the chart", "Using destructive Terminal commands copied from an old forum post"],
    faq: [
      { question: "Does Trash use disk space?", answer: "Yes. Files generally continue to occupy capacity until Trash is emptied, although APFS storage accounting can make the exact reclaimed amount less intuitive." },
      { question: "Why is System Data still the same?", answer: "System Data is a broad, recalculated category. Available disk capacity is a better immediate measure of whether space was reclaimed." }
    ],
    related: [{ label: "Mac storage not updating after deletion", href: "https://www.disksift.com/blog/mac-storage-not-updating-after-deleting-files" }],
    sources: [{ label: "Apple: Delete files and folders on Mac", href: "https://support.apple.com/guide/mac-help/delete-files-and-folders-mchlp1093/mac" }]
  }
];

function renderBody(topic: ConsumerTopic) {
  const steps = topic.steps.map((step, index) => `### ${index + 1}. ${step.heading}\n\n${step.text}`).join("\n\n");
  const faqs = topic.faq.map(item => `### ${item.question}\n\n${item.answer}`).join("\n\n");
  const related = topic.related.map(item => `- [${item.label}](${item.href})`).join("\n");
  const sources = topic.sources.map(item => `- [${item.label}](${item.href})`).join("\n");
  return `## Quick answer\n\n${topic.answer}\n\n## Why this happens\n\n${topic.causes.map(item => `- ${item}`).join("\n")}\n\n## A safe step-by-step plan\n\n${steps}\n\n## What not to do\n\n${topic.avoid.map(item => `- ${item}`).join("\n")}\n\n## How DiskSift can help\n\nDiskSift is a local Mac storage analyzer. It shows the largest categories and files, lets you sort and reveal results, and separates conservative Safe to Delete recommendations from personal files that need your judgment. File names, paths, contents, and scan results stay on your Mac. Start with the free edition and review every action before moving anything to Trash.\n\n## Frequently asked questions\n\n${faqs}\n\n## Related DiskSift guides\n\n${related}\n\n## Sources\n\n${sources}\n`;
}

export const consumerSeoArticles = topics.map(topic => ({
  slug: topic.slug,
  title: topic.title,
  excerpt: topic.excerpt,
  category: topic.category,
  tags: topic.tags,
  authorName: "Prateek G.",
  priority: topic.priority,
  body: renderBody(topic),
}));

export const developerArticleSlugs = [
  "clear-xcode-derived-data",
  "node-modules-disk-space-mac",
  "delete-ios-simulator-data",
  "clean-docker-disk-space-mac",
  "clean-homebrew-cache",
  "clean-npm-cache-mac",
];
