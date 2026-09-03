import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Refund Policy — DiskSift", description: "DiskSift Pro 15-day refund policy." };

export default function RefundPolicyPage() {
  return <LegalLayout title="Refund Policy" updated="September 2, 2026">
    <section><h2>15-day money-back guarantee</h2><p>If DiskSift Pro is not right for you, you may request a refund within 15 calendar days of the original purchase. Approved refunds are returned to the original payment method.</p></section>
    <section><h2>Requesting a refund</h2><p>Email <a href="mailto:support@disksift.com">support@disksift.com</a> from the address used at checkout. Include your Stripe receipt or order identifier if available. A reason is optional, although feedback helps us improve.</p></section>
    <section><h2>After a refund</h2><p>Once a full refund is issued, the associated Pro license is revoked and may no longer be activated on additional Macs. Access on an existing offline installation may continue until the app next validates its license status.</p></section>
    <section><h2>Processing</h2><p>We aim to review requests promptly. After we issue a refund, your bank or card provider controls how long it takes to appear on your statement.</p></section>
    <section><h2>Abuse and payment disputes</h2><p>We may deny requests outside the 15-day period or involving fraud, repeated refund abuse, unauthorized redistribution, or material violation of the Terms. This policy does not limit refund rights provided by applicable law.</p></section>
  </LegalLayout>;
}
