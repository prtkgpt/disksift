import BuyProButton from "@/components/BuyProButton";
import Link from "next/link";

export default async function BuyPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const query = await searchParams;
  return <main className="shell" style={{ padding: "80px 24px", maxWidth: 680 }}>
    <Link href="/">← DiskSift</Link><h1>DiskSift Pro</h1>
    <p>$12.99 USD launch price · One payment · Up to three personal Macs · Updates for major version 1.</p>
    <p>Secure checkout is handled by Stripe. Your license key appears after payment and is sent to your email.</p>
    {query.canceled && <p role="status">Checkout canceled. You can try again when ready.</p>}
    <BuyProButton />
  </main>;
}
