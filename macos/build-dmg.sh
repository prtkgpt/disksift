#!/bin/zsh
set -euo pipefail
cd "${0:A:h}"
swift build -c release --arch arm64 --arch x86_64
BUILD_ROOT="$(mktemp -d /private/tmp/disksift-dmg.XXXXXX)"
APP="$BUILD_ROOT/DiskSift.app"
STAGE="$BUILD_ROOT/stage"
trap 'rm -rf "$BUILD_ROOT"' EXIT
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$STAGE" dist
cp .build/apple/Products/Release/DiskSift "$APP/Contents/MacOS/DiskSift"
cp Info.plist "$APP/Contents/Info.plist"
cp Assets/DiskSiftIcon.icns "$APP/Contents/Resources/DiskSiftIcon.icns"
 xattr -cr "$APP"
codesign --force --deep --sign - "$APP"
codesign --verify --deep --strict "$APP"
cp -R "$APP" "$STAGE/DiskSift.app"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "DiskSift" -srcfolder "$STAGE" -ov -format UDZO "$BUILD_ROOT/DiskSift.dmg"
cp "$BUILD_ROOT/DiskSift.dmg" "dist/DiskSift.dmg"
hdiutil verify "dist/DiskSift.dmg"
echo "Created $(pwd)/dist/DiskSift.dmg"
