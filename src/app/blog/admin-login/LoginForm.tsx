"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/blog/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setError(data.error ?? "Could not sign in.");
    router.push("/blog/admin"); router.refresh();
  }
  return <form className="cms-login-card" onSubmit={submit}><Link className="brand" href="/">DiskSift</Link><h1>Blog admin</h1><p>Write, review, schedule, and publish DiskSift guides.</p><label>Email<input required name="email" type="email" autoComplete="username" /></label><label>Password<input required name="password" type="password" autoComplete="current-password" /></label>{error && <div className="cms-error">{error}</div>}<button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>;
}
