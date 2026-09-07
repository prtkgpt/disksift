import "./globals.css";
import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "DiskSift — Make space for what matters",
  description: "A private, Apple-notarized storage analyzer for Mac. DiskSift for iPhone is coming soon."
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
