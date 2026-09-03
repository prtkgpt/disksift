import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Terms of Service — DiskSift", description: "Terms governing use of DiskSift for macOS." };

export default function TermsPage() {
  return <LegalLayout title="Terms of Service" updated="September 2, 2026">
    <section><h2>1. Agreement</h2><p>These Terms govern your download, installation, purchase, and use of the DiskSift website and macOS application. By using DiskSift, you agree to these Terms. If you do not agree, do not use the software.</p></section>
    <section><h2>2. Free and Pro licenses</h2><p>DiskSift Free may be used without payment. A valid DiskSift Pro purchase grants you a personal, non-exclusive, non-transferable license to use the Pro features on up to three Macs you personally control. You may not resell, sublicense, share, publish, or circumvent a license key or activation mechanism.</p></section>
    <section><h2>3. One-time purchase</h2><p>DiskSift Pro is sold for a one-time fee, not a recurring subscription. Your license covers the Pro features included in the purchased major version. We may charge separately for a future major version, but we will not convert your purchase into a subscription without your express consent.</p></section>
    <section><h2>4. Safe use and deletion</h2><p>DiskSift identifies files that may be useful to review; it cannot determine whether every file is important to you. Review every selection before acting. Cleanup actions are designed to use the macOS Trash where supported, but you remain responsible for backups and deletion decisions.</p></section>
    <section><h2>5. Availability and updates</h2><p>We may improve, change, or discontinue features and may provide security or compatibility updates. We do not guarantee that DiskSift will support every Mac, storage device, filesystem, or future macOS release.</p></section>
    <section><h2>6. Acceptable use</h2><p>You may not reverse engineer DiskSift except where applicable law expressly permits it, interfere with its licensing service, use it unlawfully, or distribute modified copies as an official DiskSift release.</p></section>
    <section><h2>7. Disclaimer</h2><p>DiskSift is provided “as is” and “as available” to the extent permitted by law. We disclaim implied warranties including merchantability, fitness for a particular purpose, and non-infringement. Nothing in these Terms excludes rights that cannot legally be excluded.</p></section>
    <section><h2>8. Limitation of liability</h2><p>To the extent permitted by law, DiskSift will not be liable for indirect, incidental, special, consequential, or punitive damages, loss of data, or loss of profits arising from use of the software. Our total liability will not exceed the amount you paid for DiskSift during the twelve months preceding the claim.</p></section>
    <section><h2>9. Refunds and termination</h2><p>Eligible purchases are covered by our <a href="/refund-policy">Refund Policy</a>. We may suspend a license obtained fraudulently, shared beyond its permitted use, refunded, charged back, or used in material violation of these Terms.</p></section>
    <section><h2>10. Contact</h2><p>Questions about these Terms can be sent to <a href="mailto:support@disksift.com">support@disksift.com</a>.</p></section>
  </LegalLayout>;
}
