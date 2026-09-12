"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const MEASUREMENT_ID = "G-T9FYMETSD4";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const isSensitivePage =
    pathname.startsWith("/purchase") ||
    pathname.startsWith("/blog/admin") ||
    pathname === "/civicsprep-privacy-policy";

  useEffect(() => {
    if (isSensitivePage || previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    trackEvent("page_view", { page_path: pathname, page_title: document.title });
  }, [isSensitivePage, pathname]);

  useEffect(() => {
    if (isSensitivePage) return;

    function handleClick(event: MouseEvent) {
      const element = event.target instanceof Element ? event.target : null;
      if (!element) return;
      const anchor = element.closest<HTMLAnchorElement>("a[href]");
      const button = element.closest<HTMLButtonElement>("button");

      if (anchor) {
        const url = new URL(anchor.href, window.location.href);
        const linkText = (anchor.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
        const parameters = {
          page_path: window.location.pathname,
          link_path: url.origin === window.location.origin ? `${url.pathname}${url.hash}` : url.origin,
          link_text: linkText,
        };

        if (url.pathname === "/api/download") {
          trackEvent("download_click", {
            ...parameters,
            edition: url.searchParams.get("edition") === "pro" ? "pro" : "free",
            source: url.searchParams.get("source") ?? "website",
          });
        } else if (anchor.matches(".primary, .nav-cta, .plan-button") || url.pathname === "/buy") {
          trackEvent("cta_click", parameters);
        } else {
          trackEvent("navigation_click", parameters);
        }
        return;
      }

      if (button) {
        const buttonText = (button.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
        trackEvent(button.closest(".faq-item") ? "faq_click" : "button_click", {
          page_path: window.location.pathname,
          button_text: buttonText,
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isSensitivePage]);

  useEffect(() => {
    if (isSensitivePage) return;
    const seen = new Set<string>();
    const sections = ["features", "how", "pricing", "faq"]
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting && !seen.has(id)) {
          seen.add(id);
          trackEvent("section_view", { page_path: window.location.pathname, section_name: id });
        }
      }
    }, { threshold: 0.35 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [isSensitivePage, pathname]);

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
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
