#!/bin/zsh
set -euo pipefail
cd "${0:A:h}"
SIGNING_IDENTITY="${SIGNING_IDENTITY:-Developer ID Application: Prateek Gupta (ZVX28N3U64)}"
NOTARY_PROFILE="${NOTARY_PROFILE:-DiskSift-Notary}"

security find-identity -v -p codesigning | grep -Fq "$SIGNING_IDENTITY" || {
  echo "Missing signing identity: $SIGNING_IDENTITY" >&2
  exit 1
}

swift build -c release --arch arm64 --arch x86_64
BUILD_ROOT="$(mktemp -d /private/tmp/disksift-dmg.XXXXXX)"
STAGE="$BUILD_ROOT/stage"
APP="$STAGE/DiskSift.app"
VERIFY_MOUNT="$BUILD_ROOT/verify-mount"
trap 'hdiutil detach "$VERIFY_MOUNT" >/dev/null 2>&1 || true; rm -rf "$BUILD_ROOT"' EXIT
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$STAGE" dist
cp .build/apple/Products/Release/DiskSift "$APP/Contents/MacOS/DiskSift"
cp Info.plist "$APP/Contents/Info.plist"
cp Assets/DiskSiftIcon.icns "$APP/Contents/Resources/DiskSiftIcon.icns"
xattr -cr "$APP"
codesign --force --options runtime --timestamp --sign "$SIGNING_IDENTITY" "$APP"
codesign --verify --deep --strict --verbose=2 "$APP"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "DiskSift Installer" -srcfolder "$STAGE" -format UDZO -ov "$BUILD_ROOT/DiskSift.dmg"
mkdir -p "$VERIFY_MOUNT"
hdiutil attach -nobrowse -readonly -mountpoint "$VERIFY_MOUNT" "$BUILD_ROOT/DiskSift.dmg"
codesign --verify --deep --strict --verbose=2 "$VERIFY_MOUNT/DiskSift.app"
hdiutil detach "$VERIFY_MOUNT"
codesign --force --timestamp --sign "$SIGNING_IDENTITY" "$BUILD_ROOT/DiskSift.dmg"
xcrun notarytool submit "$BUILD_ROOT/DiskSift.dmg" --keychain-profile "$NOTARY_PROFILE" --wait
xcrun stapler staple "$BUILD_ROOT/DiskSift.dmg"
xcrun stapler validate "$BUILD_ROOT/DiskSift.dmg"
spctl --assess --type open --context context:primary-signature --verbose=2 "$BUILD_ROOT/DiskSift.dmg"
hdiutil attach -nobrowse -readonly -mountpoint "$VERIFY_MOUNT" "$BUILD_ROOT/DiskSift.dmg"
codesign --verify --deep --strict --verbose=2 "$VERIFY_MOUNT/DiskSift.app"
spctl --assess --type execute --verbose=2 "$VERIFY_MOUNT/DiskSift.app"
hdiutil detach "$VERIFY_MOUNT"
cp "$BUILD_ROOT/DiskSift.dmg" "dist/DiskSift.dmg"
cp "$BUILD_ROOT/DiskSift.dmg" "../public/downloads/DiskSift.dmg"
hdiutil verify "dist/DiskSift.dmg"
echo "Created signed and notarized $(pwd)/dist/DiskSift.dmg"
