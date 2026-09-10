import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CivicsPrep",
  description: "How the CivicsPrep U.S. citizenship exam preparation app handles information.",
  robots: { index: false, follow: false },
};

export default function CivicsPrepPrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <nav className="legal-nav shell">
        <span className="brand"><span className="legal-logo">★</span>CivicsPrep</span>
        <Link href="/">DiskSift</Link>
      </nav>

      <article className="legal-card">
        <p className="section-kicker">CIVICSPREP LEGAL</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: September 10, 2026</p>

        <section>
          <h2>1. Overview</h2>
          <p>CivicsPrep is a U.S. citizenship exam preparation app. This policy explains how the current version of CivicsPrep handles information when you use the app or contact us.</p>
        </section>

        <section>
          <h2>2. Study data stays on your device</h2>
          <p>CivicsPrep does not require an account. Your answers, study progress, saved preferences, and practice results are stored locally on your device. We do not receive this study data. It may be included in a device backup if you enable backups through Apple; those backups are governed by your settings and Apple&apos;s terms.</p>
        </section>

        <section>
          <h2>3. Information we may receive</h2>
          <p>If you contact us for support or feedback, we receive the information you choose to send, such as your email address, message, and any attachments. Apple may also provide us with aggregated or de-identified App Store, crash, and performance information according to your device and App Store analytics settings. CivicsPrep does not use that information to identify you.</p>
        </section>

        <section>
          <h2>4. How we use information</h2>
          <p>We use support communications to answer your request, troubleshoot problems, improve the app, prevent abuse, and meet legal obligations. Aggregated or de-identified diagnostics may be used to understand app reliability and fix crashes.</p>
        </section>

        <section>
          <h2>5. No advertising or tracking</h2>
          <p>CivicsPrep does not sell personal information, display third-party advertising, create advertising profiles, or track you across apps and websites owned by other companies. The app does not request access to your contacts, precise location, photos, microphone, or camera for its study features. Google Analytics is not loaded on this privacy-policy page.</p>
        </section>

        <section>
          <h2>6. Service providers and disclosures</h2>
          <p>Apple provides app distribution, device services, and optional diagnostics under Apple&apos;s own privacy terms. Email providers may process support messages sent to us. We do not share personal information with other parties except as needed to provide support, protect the app and its users, comply with law, or complete a business transfer. Providers acting for us must protect information consistently with this policy and applicable law.</p>
        </section>

        <section>
          <h2>7. Retention, deletion, and your choices</h2>
          <p>Study data remains on your device until you reset it in the app or delete the app and its data through your device settings. Support communications are retained only as reasonably needed to resolve the request, maintain security records, and meet legal requirements. You may ask us to access, correct, or delete eligible information you sent us, or withdraw a prior consent, by emailing us. Some records may be retained where required by law.</p>
        </section>

        <section>
          <h2>8. Children&apos;s privacy</h2>
          <p>CivicsPrep is intended for people preparing for the U.S. naturalization test and is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has sent us personal information, contact us so we can review and delete it where appropriate.</p>
        </section>

        <section>
          <h2>9. Security and international use</h2>
          <p>We use reasonable administrative and technical safeguards for information we receive. No method of storage or transmission is completely secure. If you contact us from outside the United States, your information may be processed in the United States or other countries where our service providers operate.</p>
        </section>

        <section>
          <h2>10. Changes to this policy</h2>
          <p>We may update this policy when CivicsPrep&apos;s features or data practices change. We will post the revised policy here and update the date above. Material changes will be communicated where appropriate.</p>
        </section>

        <section>
          <h2>11. Contact us</h2>
          <p>For privacy questions, requests, or concerns about CivicsPrep, email <a href="mailto:hello@disksift.com">hello@disksift.com</a>.</p>
        </section>
      </article>

      <footer className="legal-footer shell">
        <span>© 2026 CivicsPrep</span>
        <span>Privacy contact: <a href="mailto:hello@disksift.com">hello@disksift.com</a></span>
      </footer>
    </main>
  );
}
