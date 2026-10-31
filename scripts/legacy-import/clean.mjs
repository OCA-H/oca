// Turns the old site's free-typed values into what the app stores. Each cleaner returns null when
// the value cannot be trusted, and the caller records why in an issues file.

import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Fixes UTF-8 text that was saved through a latin1 connection ("JosÃ©" → "José"), then trims it. */
export function text(value) {
  if (value === null || value === undefined) return "";
  let out = String(value);
  if (/[ÃÂâ][\x80-\xBF]/.test(out)) {
    const fixed = Buffer.from(out, "latin1").toString("utf8");
    if (!fixed.includes("�")) out = fixed;
  }
  return out.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const EMAIL = /^[^\s@,;:<>()]+@[^\s@,;:<>()]+\.[a-z]{2,}$/i;

/** One valid, lowercased email, or null. Fields holding several addresses yield the first valid one. */
export function email(value) {
  const parts = text(value).toLowerCase().split(/[\s,;/]+/).filter(Boolean);
  return parts.find((part) => EMAIL.test(part)) ?? null;
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * A real calendar date as "YYYY-MM-DD", or null. Reads "24-03-1985", "24/3/1985", "1985-03-24"
 * and "24 March 1985"; day-first wherever the order is ambiguous, as the old forms asked for.
 */
export function date(value, { minYear = 1900, maxYear = new Date().getFullYear() } = {}) {
  const raw = text(value);
  if (!raw || /^0{2,4}[-/]0{1,2}[-/]0{2,4}/.test(raw)) return null;
  let y, m, d;
  let match;
  if ((match = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) [, y, m, d] = match;
  else if ((match = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) [, d, m, y] = match;
  else if ((match = raw.match(/^(\d{1,2})\s*([A-Za-z]{3,})\.?,?\s*(\d{4})$/))) {
    const month = new Date(`${match[2].slice(0, 3)} 1, 2000`).getMonth();
    if (Number.isNaN(month)) return null;
    [d, m, y] = [match[1], month + 1, match[3]];
  } else return null;
  [y, m, d] = [Number(y), Number(m), Number(d)];
  if (y < minYear || y > maxYear) return null;
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** "2022-12-01 04:19:15" or "01-12-2022" as a Date (India time), or null. */
export function timestamp(value) {
  const raw = text(value);
  if (!raw || raw.startsWith("0000")) return null;
  const time = raw.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  const day = date(raw.split(" ")[0], { minYear: 2000, maxYear: 2100 });
  if (!day) return null;
  const clock = time ? `${pad(time[1])}:${time[2]}:${time[3] ?? "00"}` : "12:00:00";
  return new Date(`${day}T${clock}+05:30`);
}

/** A batch year the school could have had, or null ("0" and typos like "198" are rejected). */
export function batch(value) {
  const year = Number(text(value));
  return Number.isInteger(year) && year >= 1935 && year <= new Date().getFullYear() + 1 ? String(year) : null;
}

/**
 * The best mobile number among the candidates, as the app stores it: national digits plus the
 * calling code kept separately. Prefers numbers that are actually mobiles over landlines.
 * Candidates are [number, countryCodeHint] pairs; India is assumed when no code was given.
 */
export function mobile(candidates) {
  let fallback = null;
  for (const [number, codeHint] of candidates) {
    const raw = text(number);
    if (!raw || raw.replace(/\D/g, "").length < 6) continue;
    const code = text(codeHint).replace(/\D/g, "");
    const parsed = raw.startsWith("+")
      ? parsePhoneNumberFromString(raw)
      : code && code !== "91"
        ? parsePhoneNumberFromString(`+${code}${raw.replace(/^0+/, "")}`)
        : parsePhoneNumberFromString(raw, "IN");
    if (!parsed || !parsed.isPossible()) continue;
    const result = { mobile: String(parsed.nationalNumber), countryCode: `+${parsed.countryCallingCode}` };
    const type = parsed.getType();
    if (parsed.isValid() && (type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE")) return result;
    fallback ??= result;
  }
  return fallback;
}

/** Whole rupees from a float column; null for nothing paid. */
export function rupees(value) {
  const amount = Math.round(Number(value));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/** A PAN in the official format (ABCDE1234F), or null. */
export function pan(value) {
  const raw = text(value).toUpperCase().replace(/\s/g, "");
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(raw) ? raw : null;
}

/** Old CCAvenue codes: Y (success) and S (Success) were paid; N, D and blanks were not. */
export function isPaid(status) {
  return ["Y", "S"].includes(text(status).toUpperCase());
}

export function paymentState(status) {
  const code = text(status).toUpperCase();
  if (code === "Y" || code === "S") return "paid";
  if (code === "D") return "declined";
  if (code === "N") return "not completed";
  return "unknown";
}

/** "life" / "ordinary" → the app's membership type labels. */
export function membershipType(value) {
  const raw = text(value).toLowerCase();
  if (raw === "ordinary") return "Ordinary Member";
  return "Life Member";
}

/** Lowercased name with titles and punctuation removed, for matching people across tables. */
export function nameKey(...parts) {
  return parts
    .map((part) => text(part).toLowerCase())
    .join(" ")
    .replace(/\b(mr|mrs|ms|dr|capt|col|prof|brig|maj|lt|gen|sri|shri)\b\.?/g, " ")
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
