import Link from "next/link";

export function BlogCta() {
  return <section className="blog-cta"><div><span>READY TO FIND YOUR SPACE?</span><h2>See what is filling up your Mac.</h2><p>Scan locally, understand the largest folders, and review every cleanup action before anything moves to Trash.</p></div><div className="blog-cta-actions"><a className="primary" href="/api/download?edition=free&source=blog-cta">Download DiskSift Free ↓</a><Link href="/#pricing">Explore Pro · $12.99 once</Link><small>Launch price · Apple notarized · No subscription</small></div></section>;
}

export function SiteFooter() {
  return <footer className="compact-site-footer"><div className="shell footer-inner"><div><Link className="brand" href="/">DiskSift</Link><p>A clearer way to make space on your Mac.</p></div><div className="footer-links"><Link href="/#how">How it works</Link><Link href="/#pricing">Pricing</Link><Link href="/blog">Blog</Link><Link href="/#faq">FAQ</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refund-policy">Refunds</Link></div><div><small>TRUSTED DOWNLOAD</small><p>✓ Apple notarized<br/>◆ Apple silicon &amp; Intel</p></div></div><div className="shell copyright">© 2026 DiskSift.<a href="#top">Back to top ↑</a></div></footer>;
}
