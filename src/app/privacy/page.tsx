import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy — DiskSift", description: "How DiskSift handles app, website, payment, and license data." };

export default function PrivacyPage() {
  return <LegalLayout title="Privacy Policy" updated="September 2, 2026">
    <section><h2>1. Local scanning</h2><p>DiskSift performs storage scans on your Mac. We do not upload or store your filenames, file contents, folder structure, scan results, duplicate fingerprints, or deletion history. Exact-duplicate fingerprints are calculated locally.</p></section>
    <section><h2>2. Information we process</h2><p>When you purchase or activate Pro, we may process your email address, Stripe customer and transaction identifiers, license status, license-key hash, activation identifier, app version, macOS version, and activation timestamps. We do not receive your full payment-card number.</p></section>
    <section><h2>3. Why we use this information</h2><p>We use this limited information to complete purchases, issue and recover licenses, enforce the permitted device count, provide support, prevent fraud, process refunds, deliver important product messages, and satisfy legal obligations.</p></section>
    <section><h2>4. Service providers</h2><p>Our website may use Vercel for hosting, Stripe for payments, Resend for transactional email, and Neon for license and purchase records. Those providers process information under their respective policies. Standard server logs may include IP address, browser information, requested URL, and request time for security and reliability.</p></section>
    <section><h2>5. Cookies and analytics</h2><p>DiskSift does not use advertising cookies or sell personal information. Essential cookies may be used where necessary for security or a purchase-management session. If we add optional analytics, we will update this policy and configure them to minimize personal data.</p></section>
    <section><h2>6. Retention and security</h2><p>Purchase and license records are retained while a license remains valid and as needed for accounting, fraud prevention, support, and legal compliance. License keys are stored as one-way hashes where practical. No internet service can guarantee absolute security.</p></section>
    <section><h2>7. Your choices</h2><p>You may use DiskSift Free without creating an account. You can request access, correction, or deletion of eligible personal information by contacting us. Some transaction records may need to be retained where required by law.</p></section>
    <section><h2>8. Children</h2><p>DiskSift is not directed to children under 13, and we do not knowingly collect personal information from children.</p></section>
    <section><h2>9. Changes and contact</h2><p>We may update this policy as the product changes and will revise the date above. Privacy questions and requests can be sent to <a href="mailto:privacy@disksift.com">privacy@disksift.com</a>.</p></section>
  </LegalLayout>;
}
