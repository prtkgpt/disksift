import { prisma } from "@/lib/prisma";
import { ensureMetricsSchema } from "@/lib/metrics-schema";
import { ensurePaymentSchema } from "@/lib/payment-schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Building DiskSift in Public", description: "Transparent DiskSift product and impact metrics." };

export default async function BuildInPublicPage() {
  let freeDownloads = 0, proDownloads = 0, licenses = 0, revenue = 0, bytesCleaned = 0;
  try {
    await Promise.all([ensureMetricsSchema(), ensurePaymentSchema()]);
    const downloads = await prisma.$queryRaw<Array<{ edition: string; count: bigint }>>`SELECT "edition", COUNT(*)::bigint AS count FROM "DownloadEvent" GROUP BY "edition"`;
    freeDownloads = Number(downloads.find(row => row.edition === "free")?.count ?? 0);
    proDownloads = Number(downloads.find(row => row.edition === "pro")?.count ?? 0);
    const sales = await prisma.$queryRaw<Array<{ licenses: bigint; revenue: bigint }>>`SELECT COUNT(*)::bigint AS licenses, COALESCE(SUM("amountCents"), 0)::bigint AS revenue FROM "ProPurchase" WHERE "livemode" = true AND "status" = 'ACTIVE'`;
    licenses = Number(sales[0]?.licenses ?? 0); revenue = Number(sales[0]?.revenue ?? 0);
    const impact = await prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT COALESCE(SUM("bytesCleaned"), 0)::bigint AS bytes FROM "CleanupReport"`;
    bytesCleaned = Number(impact[0]?.bytes ?? 0);
  } catch { /* Show zeroes until infrastructure is ready. */ }
  const cleanedGB = bytesCleaned / 1_000_000_000;
  const annualStorageEquivalent = cleanedGB * 0.02 * 12;
  const metrics = [
    [freeDownloads.toLocaleString(), "Free download starts"],
    [licenses.toLocaleString(), "Active Pro licenses"],
    [proDownloads.toLocaleString(), "Pro download starts"],
    [`$${(revenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Net product sales"],
    [`${cleanedGB.toLocaleString("en-US", { maximumFractionDigits: 1 })} GB`, "Space moved to Trash"],
    [`$${annualStorageEquivalent.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, "Annual storage equivalent"]
  ];
  return <main className="public-metrics"><nav className="shell"><a className="brand" href="/">✦ DiskSift</a><a href="/">Back to product →</a></nav><header className="shell"><div className="section-kicker">BUILDING IN PUBLIC</div><h1>We’re earning<br/>your trust in public.</h1><p>Real product activity, updated from DiskSift’s systems. No vanity projections.</p></header><section className="metrics-grid shell">{metrics.map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</section><section className="metrics-notes shell"><h2>How these numbers work</h2><p><strong>Downloads</strong> count starts from DiskSift links, not guaranteed completed installations. Pro licenses and revenue include completed live purchases whose licenses remain active; refund counts are not published, and refunded purchases are excluded from sales totals.</p><p><strong>Space cleaned</strong> includes only users who explicitly enable anonymous impact sharing in the Mac app. We receive a byte total and anonymous installation identifier—not file names, paths, contents, or scan results.</p><p><strong>Annual storage equivalent</strong> is an illustrative calculation: reported GB × $0.02 per GB per month × 12. It is not cash saved, a promise of savings, or the price of a particular storage plan.</p><h2>What we are shipping next</h2><ol><li>Batch, permission-aware cleanup with a clear reclaimable total.</li><li>Duplicate groups with recommended keepers and multi-select Trash actions.</li><li>Safe workflows for developer caches, build artifacts, and simulators.</li><li>A before-and-after cleanup receipt inside the app.</li><li>App uninstall and leftover review after the core cleanup workflow is reliable.</li></ol></section></main>;
}
