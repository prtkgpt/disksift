import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "disksift_blog_admin";
const MAX_AGE = 60 * 60 * 8;

function secret() { return process.env.BLOG_SESSION_SECRET ?? ""; }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminIsConfigured() {
  return Boolean(process.env.BLOG_ADMIN_EMAIL && process.env.BLOG_ADMIN_PASSWORD && secret().length >= 32);
}

export function validateAdminCredentials(email: string, password: string) {
  if (!adminIsConfigured()) return false;
  return safeEqual(email.trim().toLowerCase(), process.env.BLOG_ADMIN_EMAIL!.trim().toLowerCase()) &&
    safeEqual(password, process.env.BLOG_ADMIN_PASSWORD!);
}

export function createAdminSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isAdminSessionValid() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token || !adminIsConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now() / 1000; }
  catch { return false; }
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: MAX_AGE });
}

export function clearAdminCookie() { cookies().set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 }); }
