export interface SessionUser {
  id: number;
  memberId: string;
  email: string;
  fullName: string;
  role: string;
  batchYear?: string | null;
  house?: string | null;
  membershipType: string;
}

export interface SessionData {
  user: SessionUser;
  exp: number; // Unix timestamp in seconds
  iat: number; // Unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = "oca_session";
export const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const AUTH_SECRET =
  process.env.AUTH_SECRET || "oca_secret_key_alumni_community_secure_salt_2026";

/** Base64URL encode string or Uint8Array */
export function base64UrlEncode(input: string | Uint8Array): string {
  let base64: string;
  if (typeof input === "string") {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  } else {
    let binary = "";
    for (let i = 0; i < input.byteLength; i++) {
      binary += String.fromCharCode(input[i]);
    }
    base64 = btoa(binary);
  }
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/** Base64URL decode string */
export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Creates an HMAC-SHA256 signature for data using Web Crypto API.
 */
async function signHmacWeb(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

/**
 * Signs a session payload into a compact token string.
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionData = {
    user,
    iat: now,
    exp: now + SESSION_EXPIRY_SECONDS,
  };

  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = await signHmacWeb(payloadEncoded, AUTH_SECRET);
  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifies a token and returns the parsed SessionData if valid, or null.
 */
export async function verifySessionToken(token: string): Promise<SessionData | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;
  try {
    const expectedSig = await signHmacWeb(payloadEncoded, AUTH_SECRET);
    if (signature !== expectedSig) return null;

    const jsonStr = base64UrlDecode(payloadEncoded);
    const session: SessionData = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);

    if (!session.exp || session.exp < now) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Parses cookies from cookie header.
 */
export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(";")) {
    const [name, ...vals] = pair.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(vals.join("="));
    }
  }
  return cookies;
}

/**
 * Generates Set-Cookie header value for the session.
 */
export function buildSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_EXPIRY_SECONDS}; HttpOnly; SameSite=Lax${
    isProd ? "; Secure" : ""
  }`;
}

/**
 * Generates Set-Cookie header value to clear the session.
 */
export function buildClearSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${
    isProd ? "; Secure" : ""
  }`;
}
