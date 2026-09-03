import type { ReactNode } from "react";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <nav className="legal-nav shell"><a className="brand" href="/"><span className="legal-logo">✦</span>DiskSift</a><a href="/">← Back to home</a></nav>
      <article className="legal-card">
        <p className="section-kicker">DISKSIFT LEGAL</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        {children}
      </article>
      <footer className="legal-footer shell"><span>© 2026 DiskSift</span><span><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/refund-policy">Refunds</a></span></footer>
    </main>
  );
}
