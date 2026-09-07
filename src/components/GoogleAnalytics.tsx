"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const MEASUREMENT_ID = "G-T9FYMETSD4";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const isSensitivePage =
    pathname.startsWith("/purchase") || pathname.startsWith("/blog/admin");

  if (isSensitivePage) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
