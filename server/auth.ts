import crypto from "crypto";
import type { Request, Response } from "express";

export const AUTH_COOKIE = "litera_session";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const DEV_SECRET = "litera-development-only-secret";

function secret(): string {
  const configured = (process.env.SESSION_SECRET || "").trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    throw Object.assign(new Error("SESSION_SECRET environment variable is required in production."), {
      code: "SESSION_SECRET_MISSING",
      status: 500,
    });
  }
  return DEV_SECRET;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * Stateless signed-cookie session: serverless functions get a new process on
 * every request, so an in-memory session store cannot keep users logged in.
 */
export function createSessionToken(userId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${Buffer.from(userId).toString("base64url")}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedUserId, expiresAt, signature] = parts;
  const expected = sign(`${encodedUserId}.${expiresAt}`);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length || !crypto.timingSafeEqual(provided, expectedBuffer)) {
    return null;
  }
  if (Number(expiresAt) * 1000 < Date.now()) {
    return null;
  }

  return Buffer.from(encodedUserId, "base64url").toString("utf8") || null;
}

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    if (name) cookies[name] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return cookies;
}

export function getSessionUserId(req: Request): string | null {
  return readSessionToken(parseCookies(req.headers.cookie)[AUTH_COOKIE]);
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
  };
}

export function setSessionCookie(res: Response, userId: string): void {
  res.cookie(AUTH_COOKIE, createSessionToken(userId), {
    ...cookieOptions(),
    maxAge: MAX_AGE_SECONDS * 1000,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
}
