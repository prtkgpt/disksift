"use client";
import { useMemo, useState } from "react";

type Post = { id?: string; title: string; slug: string; excerpt: string; body: string; category: string; tags: string[]; status: string; publishedAt: string | null; updatedAt?: string };
const empty: Post = { title: "", slug: "", excerpt: "", body: "", category: "Mac Storage", tags: [], status: "DRAFT", publishedAt: null };
const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminDashboard({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts); const [selected, setSelected] = useState<Post>({ ...empty });
  const [query, setQuery] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => posts.filter(p => `${p.title} ${p.status}`.toLowerCase().includes(query.toLowerCase())), [posts, query]);
  const update = (key: keyof Post, value: unknown) => setSelected(current => ({ ...current, [key]: value }));
  async function save() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/blog/admin/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(selected) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(data.error ?? "Could not save.");
    const next = [data, ...posts.filter(p => p.id !== data.id)]; setPosts(next); setSelected(data); setMessage("Saved.");
  }
  async function seed() {
    if (!confirm("Create the 50 unpublished editorial briefs? Existing slugs will be skipped.")) return;
    setBusy(true); const response = await fetch("/api/blog/admin/seed", { method: "POST" }); const data = await response.json();
    const refresh = await fetch("/api/blog/admin/posts"); setPosts(await refresh.json()); setBusy(false); setMessage(`${data.created ?? 0} drafts created.`);
  }
  async function logout() { await fetch("/api/blog/admin/logout", { method: "POST" }); window.location.href = "/blog/admin-login"; }
  return <main className="cms"><header><a className="brand" href="/">DiskSift</a><span>Content Studio</span><div><a href="/blog" target="_blank">View blog ↗</a><button onClick={logout}>Log out</button></div></header><div className="cms-layout"><aside><button className="cms-new" onClick={() => setSelected({ ...empty })}>+ New article</button><button className="cms-seed" disabled={busy} onClick={seed}>Create 50-post draft queue</button><input placeholder="Search articles…" value={query} onChange={e => setQuery(e.target.value)} /><div className="cms-post-list">{filtered.map(post => <button key={post.id} className={post.id === selected.id ? "active" : ""} onClick={() => setSelected(post)}><strong>{post.title}</strong><span>{post.status} · {post.category}</span></button>)}</div></aside><section className="cms-editor"><div className="cms-editor-head"><div><small>{selected.id ? "EDIT ARTICLE" : "NEW ARTICLE"}</small><h1>{selected.title || "Untitled article"}</h1></div><button className="cms-save" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save article"}</button></div>{message && <div className="cms-message">{message}</div>}<div className="cms-fields"><label>Title<input value={selected.title} onChange={e => { update("title", e.target.value); if (!selected.id) update("slug", toSlug(e.target.value)); }} /></label><label>URL slug<input value={selected.slug} onChange={e => update("slug", toSlug(e.target.value))} /></label><label className="wide">Excerpt<textarea rows={3} value={selected.excerpt} onChange={e => update("excerpt", e.target.value)} /></label><label>Category<input value={selected.category} onChange={e => update("category", e.target.value)} /></label><label>Tags, comma-separated<input value={selected.tags.join(", ")} onChange={e => update("tags", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} /></label><label>Status<select value={selected.status} onChange={e => update("status", e.target.value)}><option>DRAFT</option><option>REVIEW</option><option>SCHEDULED</option><option>PUBLISHED</option></select></label><label>Publish date<input type="datetime-local" value={selected.publishedAt ? selected.publishedAt.slice(0,16) : ""} onChange={e => update("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)} /></label><label className="wide">Article (Markdown)<textarea className="cms-body" value={selected.body} onChange={e => update("body", e.target.value)} /></label></div></section></div></main>;
}
