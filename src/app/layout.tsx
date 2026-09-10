import "./globals.css";
import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.disksift.com"),
  title: "DiskSift — Make space for what matters",
  description: "Find what is taking up space on your Mac, review large files, and clean up safely with a private, Apple-notarized storage analyzer.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DiskSift",
    title: "DiskSift — Find what is taking up space on your Mac",
    description: "Scan locally, understand your storage, and review files safely before anything moves to Trash.",
  },
  twitter: { card: "summary", title: "DiskSift — Make space for what matters", description: "A private, safety-first Mac storage analyzer." },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
