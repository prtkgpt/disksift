"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function BuyProButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function buy() {
    setBusy(true);
    setError("");
    trackEvent("begin_checkout", {
      currency: "USD",
      value: 12.99,
      items: [{ item_id: "disksift_pro_v1", item_name: "DiskSift Pro", price: 12.99, quantity: 1 }],
    });
    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error("Checkout unavailable");
      window.location.assign(data.url);
    } catch {
      trackEvent("checkout_error", { page_path: window.location.pathname });
      setError("Checkout is unavailable. Please try again later.");
      setBusy(false);
    }
  }
  return <><button className="plan-button" onClick={buy} disabled={busy}>{busy ? "Opening secure checkout…" : "Buy DiskSift Pro · $12.99"}</button>{error && <p role="alert">{error}</p>}</>;
}
