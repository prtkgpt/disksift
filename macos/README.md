# DiskSift for macOS

Native SwiftUI storage analyzer for macOS 13 and newer.

## Build the downloadable DMG

```bash
chmod +x build-dmg.sh
./build-dmg.sh
```

The output is `dist/DiskSift.dmg`. This local build is ad-hoc signed for development. Public distribution requires an Apple Developer ID certificate and notarization.

## Product tiers

- Free: local folder scans, storage categories, and the 20 largest files.
- Pro ($19.99 one-time): duplicate discovery, app review, unlimited results, and future Pro updates.

The current license validator is intentionally marked as development-only. Connect the purchase URL and replace it with signed license receipt verification before accepting payments.
