"use client";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/blog/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setError(data.error ?? "Could not sign in.");
    window.location.href = "/blog/admin";
  }
  return <form className="cms-login-card" onSubmit={submit}><a className="brand" href="/">DiskSift</a><h1>Blog admin</h1><p>Write, review, schedule, and publish DiskSift guides.</p><label>Email<input required name="email" type="email" autoComplete="username" /></label><label>Password<input required name="password" type="password" autoComplete="current-password" /></label>{error && <div className="cms-error">{error}</div>}<button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form>;
}
