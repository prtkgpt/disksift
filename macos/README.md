# DiskSift for macOS

Native SwiftUI storage analyzer for macOS 13 and newer.

## Build the downloadable DMG

```bash
chmod +x build-dmg.sh
./build-dmg.sh
```

The output is `dist/DiskSift.dmg`. The release script creates a universal Apple silicon/Intel build, signs it with the configured Developer ID identity, submits it with the configured notary profile, staples the ticket, and verifies the finished DMG.

## Product tiers

- Free: progressive local scans, clickable storage categories, sorting by size, type, name, or date, large and old file discovery, conservative Safe to Delete recommendations, search, and individual Trash-first cleanup.
- Pro ($12.99 one-time launch price): Select All Safe and batch cleanup with warnings for unclassified selections, cleanup plans, exact duplicates with keeper guidance, actionable developer-folder cleanup, three personal Macs, and updates for major version 1.

Pro activation is validated by the production license API and stored in the user’s macOS Keychain.
