// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "DiskSift",
    platforms: [.macOS(.v13)],
    targets: [.executableTarget(name: "DiskSift", path: "Sources")]
)
