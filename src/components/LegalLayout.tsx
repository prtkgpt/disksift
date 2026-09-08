import type { ReactNode } from "react";
import Link from "next/link";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <nav className="legal-nav shell"><Link className="brand" href="/"><span className="legal-logo">✦</span>DiskSift</Link><Link href="/">← Back to home</Link></nav>
      <article className="legal-card">
        <p className="section-kicker">DISKSIFT LEGAL</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        {children}
      </article>
      <footer className="legal-footer shell"><span>© 2026 DiskSift</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refund-policy">Refunds</Link></span></footer>
    </main>
  );
}
