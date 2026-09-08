import { getStripe } from "@/lib/stripe";
import { fulfillProSession } from "@/lib/fulfill-pro";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  let key: string | null = null;
  let message = "No valid checkout was provided.";
  const id = (await searchParams).session_id;
  if (id && /^cs_(test_|live_)[a-zA-Z0-9]+$/.test(id)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(id);
      if (session.payment_status === "paid") {
        key = (await fulfillProSession(session)).key;
        message = "Payment confirmed. Your DiskSift Pro license is ready and has been emailed to you.";
      } else message = "Payment is still processing. Refresh this page shortly; you do not need to pay again.";
    } catch { message = "We could not finish license delivery yet. Refresh shortly or contact hello@disksift.com; do not pay again."; }
  }
  return <main className="shell" style={{ padding: "80px 24px", maxWidth: 680 }}>
    <a href="/">← DiskSift</a><h1>Thank you for choosing DiskSift Pro</h1><p role="status">{message}</p>
    {key && <><p>Your license key:</p><pre style={{ padding: 18, background: "#eee9ff", borderRadius: 10, overflowX: "auto", fontWeight: 700 }}>{key}</pre><p>Open DiskSift, choose <strong>DiskSift → Settings → Enter license key</strong>, and paste this key. It covers up to three personal Macs.</p><p><strong>Please check your email.</strong> If you do not see our message in your inbox, check your spam or junk folder. If you run into any issue or would like to share feedback, contact <a href="mailto:hello@disksift.com">hello@disksift.com</a>.</p><a className="primary" href="/api/download?edition=pro&source=purchase-success">Download DiskSift</a></>}
  </main>;
}
