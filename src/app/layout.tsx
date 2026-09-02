import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DiskSift — Make space for what matters",
  description: "A private, guided storage checkup for Mac and iPhone."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
