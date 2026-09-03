"use client";

import { useMemo, useState } from "react";

type Device = "Mac" | "iPhone";
type Category = { name: string; color: string; value: number; hint: string };

const deviceData: Record<Device, Category[]> = {
  Mac: [
    { name: "Applications", color: "#ff725e", value: 36, hint: "Remove apps you no longer use" },
    { name: "Documents", color: "#725cff", value: 28, hint: "Review downloads and large archives" },
    { name: "Photos", color: "#ffb443", value: 22, hint: "Optimize your Photos library" },
    { name: "System Data", color: "#45b8a6", value: 31, hint: "Clear safe caches and old backups" },
    { name: "Other", color: "#a7a9b0", value: 11, hint: "Inspect old installers and duplicates" }
  ],
  iPhone: [
    { name: "Photos", color: "#ff725e", value: 39, hint: "Review videos and duplicate photos" },
    { name: "Apps", color: "#725cff", value: 31, hint: "Offload apps you rarely open" },
    { name: "Messages", color: "#ffb443", value: 16, hint: "Delete large message attachments" },
    { name: "iOS", color: "#45b8a6", value: 12, hint: "Keep space ready for updates" },
    { name: "Other", color: "#a7a9b0", value: 8, hint: "Clear Safari data and offline media" }
  ]
};

function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/><path d="M19 16l.8 3.2L23 20l-3.2.8L19 24l-.8-3.2L15 20l3.2-.8L19 16Z"/></svg>;
}

export default function MarketingPage() {
  const [device, setDevice] = useState<Device>("Mac");
  const [capacity, setCapacity] = useState(256);
  const [used, setUsed] = useState(128);
  const [analyzed, setAnalyzed] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const categories = deviceData[device];
  const ratio = Math.min(used / capacity, 1);
  const reclaimable = Math.round(used * (device === "Mac" ? .18 : .14));
  const bars = useMemo(() => categories.map((c) => ({ ...c, amount: Math.round(c.value / categories.reduce((a, x) => a + x.value, 0) * used) })), [categories, used]);

  const switchDevice = (next: Device) => {
    setDevice(next); setCapacity(next === "Mac" ? 256 : 128);
    setUsed(next === "Mac" ? 128 : 91); setAnalyzed(false);
  };

  return <main>
    <nav className="nav shell"><a className="brand" href="#top"><span className="brand-mark"><SparkIcon /></span>DiskSift</a><div className="nav-links"><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="/blog">Blog</a><a href="#faq">FAQ</a></div><a className="nav-cta" href="/downloads/DiskSift.dmg" download>Download for Mac <span>↓</span></a></nav>

    <section className="hero shell" id="top"><div className="eyebrow"><span /> Native macOS app · 100% local</div><h1>Make space for<br/><em>what matters.</em></h1><p className="hero-copy">A calm, private storage analyzer for your Mac. Scan folders locally, find your largest files, and reclaim space safely.</p><div className="hero-actions"><a className="primary" href="/downloads/DiskSift.dmg" download>Download DiskSift Free <span>↓</span></a><a className="text-link" href="#how">See how it works <span>↓</span></a></div><div className="notarized-badge"><span className="notarized-icon">✓</span><span><strong>Notarized by Apple</strong><small>Developer ID verified · Safe to open with Gatekeeper</small></span></div>
      <div className="device-window"><div className="window-top"><div className="traffic"><i/><i/><i/></div><span>Storage overview</span><b>•••</b></div><div className="window-body"><aside><div className="mini-brand"><span className="brand-mark"><SparkIcon /></span>DiskSift</div>{["Overview","Categories","Cleanup plan"].map((x,i)=><div className={`side-item ${i===0?"active":""}`} key={x}><span>{i===0?"◫":i===1?"◉":"✓"}</span>{x}</div>)}<div className="safe-note">◈<div><strong>Your data stays yours</strong><small>Nothing is uploaded.</small></div></div></aside>
        <div className="preview-content"><div className="preview-head"><div><small>YOUR MAC</small><h3>Here’s your space.</h3></div><button>MacBook Pro⌄</button></div><div className="preview-card"><div className="storage-line"><div><strong>128 GB</strong><span> used of 256 GB</span></div><b>50% full</b></div><div className="storage-bar">{deviceData.Mac.map(c=><span key={c.name} style={{background:c.color,flex:c.value}} />)}</div><div className="legend">{deviceData.Mac.slice(0,4).map(c=><span key={c.name}><i style={{background:c.color}}/>{c.name}</span>)}</div></div><div className="insight-row"><div className="donut"><span>18<small>GB</small></span></div><div><small>QUICK WIN</small><h4>You could reclaim 18 GB</h4><p>That’s room for roughly 4,500 more photos.</p></div><button>View plan →</button></div></div>
      </div></div>
    </section>
    <section className="trust-strip"><span>Built for your Mac</span><span>✓ Apple notarized</span><span>◆ Apple silicon + Intel</span><span>◈ 100% local</span><span>✦ Useful free plan</span></section>

    <section className="audit-section shell" id="audit"><div className="section-kicker">YOUR FREE MAC CHECKUP</div><h2>Let’s find your space.</h2><p>Enter what you see in macOS Storage. We’ll help you understand where to start.</p><div className="audit-card"><div className="device-toggle"><button className={device==="Mac"?"selected":""} onClick={()=>switchDevice("Mac")}>◆ <span><strong>Mac</strong><small>Available now</small></span></button><button className="coming-soon-option" disabled aria-disabled="true">▯ <span><strong>iPhone</strong><small>Coming soon</small></span><b>SOON</b></button></div>
      <div className="audit-grid"><div><label>Device capacity <b>{capacity} GB</b></label><input aria-label="Device capacity" type="range" min="64" max={device==="Mac"?"2048":"1024"} step="32" value={capacity} onChange={e=>{setCapacity(+e.target.value);setUsed(Math.min(used,+e.target.value));setAnalyzed(false)}}/></div><div><label>Space currently used <b>{used} GB</b></label><input aria-label="Space used" type="range" min="8" max={capacity} value={used} onChange={e=>{setUsed(+e.target.value);setAnalyzed(false)}}/></div></div><button className="analyze" onClick={()=>setAnalyzed(true)}><SparkIcon /> Build my cleanup plan</button>
      {analyzed&&<div className="results"><div className="result-summary"><span><SparkIcon /></span><div><small>YOUR BEST OPPORTUNITY</small><h3>Reclaim about {reclaimable} GB</h3><p>Start with these areas—largest impact first.</p></div><b>{Math.round(ratio*100)}% full</b></div>{[...bars].sort((a,b)=>b.amount-a.amount).slice(0,3).map((c,i)=><div className="result-row" key={c.name}><strong>{i+1}</strong><div><span>{c.name}<b>{c.amount} GB</b></span><div><i style={{width:`${Math.max(12,c.amount/used*100)}%`,background:c.color}}/></div><small>{c.hint}</small></div></div>)}</div>}</div></section>

    <section className="how shell" id="how"><div className="how-copy"><div className="section-kicker">HOW IT WORKS</div><h2>Clarity, without<br/>the clutter.</h2><p>DiskSift turns confusing Mac storage into a short, useful plan. No technical knowledge needed.</p><div className="steps">{[["01","Scan your Mac","Choose your Home folder, another folder, or the full Mac."],["02","Get a clear breakdown","See large, old, duplicate, and easy-to-remove items."],["03","Take safe action","Open, reveal, or move reviewed files to Trash."]].map(s=><div className="step" key={s[0]}><b>{s[0]}</b><div><h3>{s[1]}</h3><p>{s[2]}</p></div></div>)}</div></div><div className="phone-card"><div className="coming-soon-banner"><strong>DiskSift for iPhone</strong><span>Coming soon</span></div><div className="phone phone-preview"><div className="island"/><div className="phone-head"><small>IPHONE CONCEPT PREVIEW</small><strong>128 GB</strong><span>71% used</span></div><div className="phone-bar">{deviceData.iPhone.map(c=><i key={c.name} style={{background:c.color,flex:c.value}}/>)}</div><p>Planned recommendations</p>{deviceData.iPhone.slice(0,3).map((c,i)=><div className="phone-row" key={c.name}><span style={{background:c.color}}>{i===0?"▧":i===1?"▦":"●"}</span><div><strong>{c.name}</strong><small>{c.hint}</small></div><b>{[39,31,16][i]} GB</b></div>)}</div></div></section>

    <section className="pricing shell" id="pricing"><div className="section-kicker">SIMPLE PRICING</div><h2>Start free. Own Pro forever.</h2><p>The essentials stay free. Upgrade once when you want DiskSift to do the repetitive work for you.</p><div className="one-time-pill">ONE PAYMENT · NO SUBSCRIPTION</div><div className="price-grid">
      <article className="price-card"><div className="plan-head"><span>FREE</span><h3>$0</h3><p>Forever. No account needed.</p></div><a href="/downloads/DiskSift.dmg" download className="plan-button secondary">Download DiskSift Free</a><div className="feature-title">Everything you need to get started</div>{["Full-drive storage overview","Interactive category map","Large file finder","Manual cleanup recommendations","One Mac"].map(x=><div className="feature" key={x}>✓ <span>{x}</span></div>)}<div className="feature muted">— <span>Duplicate file detection</span></div><div className="feature muted">— <span>App leftover removal</span></div></article>
      <article className="price-card pro"><div className="popular">BEST VALUE</div><div className="plan-head"><span>DISKSIFT PRO · LIFETIME</span><h3>$19.99<small> one time</small></h3><p>Pay once. Activate Pro on up to three personal Macs.</p></div><button className="plan-button">Buy DiskSift Pro</button><div className="feature-title">Everything in Free, plus</div>{["Smart duplicate detection","Complete app uninstaller","Orphaned leftover cleanup","Live CPU, memory & network monitor","Unlimited scan results","Three personal Macs","Future updates for this major version"].map(x=><div className="feature" key={x}>✦ <span>{x}</span></div>)}<small className="trial-note">15-day money-back guarantee · No subscription</small></article>
    </div><div className="pricing-note">One Pro license covers up to three Macs you personally control. No paid feature is required to safely use the free version.</div></section>

    <section className="privacy" id="privacy"><div className="shell privacy-inner"><div className="privacy-icon">◈</div><div><div className="section-kicker">BUILT AROUND PRIVACY</div><h2>Your storage is<br/>your business.</h2></div><div className="privacy-copy"><p>DiskSift scans on your Mac. Filenames, file contents, folder structures, duplicate fingerprints, and cleanup history are never uploaded to us.</p><div><span>✓ No account for Free</span><span>✓ No files uploaded</span><span>✓ No advertising cookies</span><span>✓ Trash-first cleanup</span></div><a className="privacy-policy-link" href="/privacy">Read our Privacy Policy →</a></div></div></section>

    <section className="faq shell" id="faq"><div><div className="section-kicker">GOOD TO KNOW</div><h2>Questions,<br/>answered.</h2></div><div>{[["Is DiskSift notarized by Apple?","Yes. The public DiskSift DMG is signed with our Apple Developer ID, submitted to Apple’s notary service, and distributed with Apple’s notarization ticket stapled to it."],["Which download works with my Mac?","The single DiskSift download is a universal app containing native Apple silicon and Intel versions."],["Is my scan data uploaded?","No. Scanning, file categorization, duplicate hashing, and cleanup decisions happen locally on your Mac. We do not receive your filenames, paths, contents, or scan results."],["Why might DiskSift request Full Disk Access?","macOS protects certain folders. Full Disk Access is needed only if you choose to analyze protected locations across the full Mac; folder scans can work with the folders you select."],["Why does duplicate analysis take longer?","The initial scan reads fast file metadata. Exact duplicate analysis is optional because it must read candidate files and compare SHA-256 fingerprints byte-for-byte."],["What can I do with DiskSift Free?","Free includes storage overview, Quick Wins, search, large-file and old-file discovery, plus open, reveal, and Trash-first actions."],["What does DiskSift Pro add?","Pro adds exact duplicate analysis, developer-junk discovery, app cleanup tools, batch workflows, unlimited results, and activation on up to three personal Macs."],["Will DiskSift delete anything automatically?","No. Cleanup requires your action, shows the selected file, and uses the macOS Trash where supported so recovery remains possible."],["Is Pro a subscription?","No. DiskSift Pro is a one-time $19.99 purchase. It includes the Pro features and updates for the purchased major version."],["Can I get a refund?","Yes. Eligible Pro purchases have a 15-day money-back guarantee. See the Refund Policy for details."]].map((f,i)=><div className="faq-item" key={f[0]}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}><span>{f[0]}</span><b>{openFaq===i?"−":"+"}</b></button>{openFaq===i&&<p>{f[1]}</p>}</div>)}</div></section>
    <footer><div className="shell footer-inner"><div><a className="brand" href="#top"><span className="brand-mark"><SparkIcon /></span>DiskSift</a><p>A clearer way to make space<br/>on your Mac.</p></div><div className="footer-links"><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="/blog">Mac storage guides</a><a href="#faq">FAQ</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/refund-policy">Refund Policy</a></div><div><small>TRUSTED DOWNLOAD</small><p>✓ Apple notarized<br/>◆ Apple silicon &amp; Intel</p></div></div><div className="shell copyright">© 2026 DiskSift. Built with care for your digital space.<a href="#top">Back to top ↑</a></div></footer>
  </main>;
}
