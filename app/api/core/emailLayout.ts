import "server-only";
import { themeColors } from "@/template/theme/colors";

// The building blocks of the website's emails, in the site's theme: the branded frame (header,
// gold rule, footer with the Secretariat's contacts) and the pieces that go inside it.
// Table layout and inline styles throughout, because email clients ignore most CSS. Icons are
// PNGs from public/images/email (see scripts/build-email-icons.mjs), linked by absolute address;
// each sits in a coloured cell, so the layout holds when a client blocks images.

const { brand, gold, neutrals, tints, onDark } = themeColors;

/** The theme colours the emails use, so templates never hard-code their own. */
export const EMAIL_COLORS = {
  brand: brand.DEFAULT,
  brandMid: brand.mid,
  brandDeep: brand.deep,
  brandDarkest: brand.darkest,
  gold: gold.DEFAULT,
  goldDark: gold.dark,
  bg: neutrals.bg,
  card: neutrals.card,
  border: neutrals.border,
  divider: "#E6EEE7",
  text: neutrals.text,
  textSoft: neutrals.textSoft,
  tintGreen: tints.teal,
  tintGold: tints.gold,
  panel: "#F8FBF8",
  onDark: onDark.DEFAULT,
  onDarkSoft: onDark.soft,
} as const;

const C = EMAIL_COLORS;
const SANS = "Inter,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "Raleway,'Segoe UI',Arial,sans-serif";

export const SECRETARIAT = {
  name: "The OCA Secretariat",
  email: "info@oldcolumban.net",
  phone: "011-23748666",
  phoneHref: "+911123748666",
  address: "St. Columba’s School, Ashoka Place, New Delhi – 110 001",
} as const;

export type EmailIcon =
  | "check"
  | "idcard"
  | "star"
  | "cap"
  | "receipt"
  | "rupee"
  | "calendar"
  | "card"
  | "shield"
  | "login"
  | "user"
  | "mail"
  | "phone"
  | "pin";
export type EmailIconTone = "green" | "white" | "gold" | "soft";

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** "₹2,000". */
export const formatRupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

/** "29 Oct 2026, 4:05 pm IST": payments are always shown in Indian time. */
export const formatPaidOn = (date: Date) =>
  `${date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;

/** An icon as an <img>. Decorative unless given `alt`. */
export const emailIcon = (baseUrl: string, name: EmailIcon, tone: EmailIconTone, size: number, alt = "") =>
  `<img src="${escapeHtml(baseUrl)}/images/email/${name}-${tone}.png" width="${size}" height="${size}" alt="${escapeHtml(alt)}" style="display:block;width:${size}px;height:${size}px;border:0;outline:none;">`;

/** An icon centred in a round coloured badge. */
export const iconBadge = (baseUrl: string, name: EmailIcon, tone: EmailIconTone, opts: { size: number; bg: string; ring?: string }) => {
  const icon = Math.round(opts.size * 0.5);
  const border = opts.ring ? `border:2px solid ${opts.ring};` : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>
    <td align="center" valign="middle" width="${opts.size}" height="${opts.size}" style="width:${opts.size}px;height:${opts.size}px;border-radius:${opts.size}px;background:${opts.bg};${border}">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td>${emailIcon(baseUrl, name, tone, icon)}</td></tr></table>
    </td></tr></table>`;
};

/** The page heading block: badge, small eyebrow, heading and lead line, centred. */
export const emailHero = (p: { badge: string; eyebrow: string; title: string; lead?: string }) => `<tr><td align="center" style="padding:36px 32px 4px;">
    ${p.badge}
    <p style="margin:18px 0 6px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.brandMid};">${escapeHtml(p.eyebrow)}</p>
    <h1 style="margin:0;font-family:${SERIF};font-size:26px;line-height:1.3;font-weight:700;color:${C.brandDeep};">${escapeHtml(p.title)}</h1>
    ${p.lead ? `<p style="margin:10px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.textSoft};">${escapeHtml(p.lead)}</p>` : ""}
  </td></tr>`;

/** A body paragraph. `html` is inserted as is: escape anything it carries from the user. */
export const emailParagraph = (html: string, opts: { soft?: boolean; margin?: string } = {}) =>
  `<p style="margin:${opts.margin ?? "0 0 14px"};font-family:${SANS};font-size:15px;line-height:1.65;color:${opts.soft ? C.textSoft : C.text};">${html}</p>`;

/** A small section heading inside the body. */
export const emailSubhead = (text: string) =>
  `<p style="margin:28px 0 12px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.brandMid};">${escapeHtml(text)}</p>`;

export interface EmailDetailRow {
  icon: EmailIcon;
  label: string;
  value: string;
}

/** A panel of label/value rows, each with its icon. */
export const emailDetails = (baseUrl: string, rows: EmailDetailRow[]) => {
  const body = rows
    .map(({ icon, label, value }, i) => {
      const line = i > 0 ? `border-top:1px solid ${C.divider};` : "";
      return `<tr>
          <td width="34" valign="middle" style="width:34px;padding:12px 0;${line}">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="26" height="26" style="width:26px;height:26px;border-radius:6px;background:${C.tintGreen};">${emailIcon(baseUrl, icon, "green", 16)}</td></tr></table>
          </td>
          <td valign="middle" style="padding:12px 12px 12px 0;${line}font-family:${SANS};font-size:13.5px;color:${C.textSoft};">${escapeHtml(label)}</td>
          <td align="right" valign="middle" style="padding:12px 0;${line}font-family:${SANS};font-size:13.5px;font-weight:600;color:${C.text};">${escapeHtml(value)}</td>
        </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
      <tr><td style="padding:4px 18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
      </td></tr>
    </table>`;
};

export interface EmailStep {
  icon: EmailIcon;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}

/** A list of next steps, each with its icon, a line of help and a link. */
export const emailSteps = (baseUrl: string, steps: EmailStep[]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps
    .map(
      (step, i) => `<tr>
        <td width="52" valign="top" style="width:52px;padding:${i > 0 ? "16px" : "0"} 0 0;">${iconBadge(baseUrl, step.icon, "green", { size: 40, bg: C.tintGreen })}</td>
        <td valign="top" style="padding:${i > 0 ? "16px" : "0"} 0 0;font-family:${SANS};">
          <p style="margin:2px 0 2px;font-size:14.5px;font-weight:700;color:${C.text};">${escapeHtml(step.title)}</p>
          <p style="margin:0;font-size:13.5px;line-height:1.55;color:${C.textSoft};">${escapeHtml(step.text)} <a href="${escapeHtml(step.href)}" style="color:${C.brandMid};font-weight:600;text-decoration:none;">${escapeHtml(step.linkLabel)}&nbsp;&rarr;</a></p>
        </td>
      </tr>`
    )
    .join("")}</table>`;

/** The site's primary button, as a table so it holds its shape in every client. */
export const emailButton = (href: string, label: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>
    <td align="center" style="border-radius:6px;background:${C.brand};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 30px;font-family:${SANS};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:6px;">${escapeHtml(label)}&nbsp;&rarr;</a>
    </td></tr></table>`;

/** A gold-edged note, for what the reader should keep or know. */
export const emailNote = (html: string) =>
  `<p style="margin:24px 0 0;padding:14px 16px;background:${C.tintGold};border-left:3px solid ${C.gold};font-family:${SANS};font-size:13.5px;line-height:1.6;color:${C.textSoft};">${html}</p>`;

/** The sign-off: "With warm regards, / The OCA Secretariat". */
export const emailSignOff = (closing: string) =>
  emailParagraph(`${escapeHtml(closing)},<br><b style="font-family:${SERIF};color:${C.brandDeep};">${SECRETARIAT.name}</b>`, { margin: "26px 0 0" });

const footerLine = (baseUrl: string, icon: EmailIcon, html: string) => `<tr>
    <td width="22" valign="top" style="width:22px;padding:3px 0;">${emailIcon(baseUrl, icon, "soft", 14)}</td>
    <td valign="top" style="padding:2px 0;font-family:${SANS};font-size:12.5px;line-height:1.5;color:${C.textSoft};">${html}</td>
  </tr>`;

/**
 * The full email: branded header, the given body rows (<tr>s, e.g. from emailHero and a content
 * row), and the footer. `preheader` is the line inbox lists show beside the subject.
 */
export function emailLayout(p: { baseUrl: string; title: string; preheader: string; rows: string; footerNote?: string }): string {
  const base = escapeHtml(p.baseUrl);
  const link = `color:${C.brandMid};text-decoration:none;`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(p.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${SANS};color:${C.text};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(p.preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:${C.card};border:1px solid ${C.border};border-radius:16px;overflow:hidden;border-collapse:separate;">
      <tr><td style="background:${C.brandDeep};padding:22px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td valign="middle" style="padding-right:14px;"><img src="${base}/images/oca-crest.png" width="46" height="46" alt="OCA crest" style="display:block;border:0;"></td>
          <td valign="middle" style="font-family:${SERIF};">
            <p style="margin:0;font-size:18px;font-weight:700;line-height:1.2;color:#FFFFFF;">Old Columbans Association</p>
            <p style="margin:3px 0 0;font-family:${SANS};font-size:12px;line-height:1.3;color:${C.onDarkSoft};">St. Columba’s School, New Delhi</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.gold};">&nbsp;</td></tr>
      ${p.rows}
      <tr><td style="padding:20px 32px 24px;background:${C.panel};border-top:1px solid ${C.border};">
        ${p.footerNote ? `<p style="margin:0 0 12px;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.textSoft};">${p.footerNote}</p>` : ""}
        <p style="margin:0 0 8px;font-family:${SERIF};font-size:13.5px;font-weight:700;color:${C.brandDeep};">${SECRETARIAT.name}</p>
        <table role="presentation" cellpadding="0" cellspacing="0">
          ${footerLine(p.baseUrl, "mail", `<a href="mailto:${SECRETARIAT.email}" style="${link}">${SECRETARIAT.email}</a>`)}
          ${footerLine(p.baseUrl, "phone", `<a href="tel:${SECRETARIAT.phoneHref}" style="${link}">${SECRETARIAT.phone}</a>`)}
          ${footerLine(p.baseUrl, "pin", escapeHtml(SECRETARIAT.address))}
        </table>
      </td></tr>
    </table>
    <p style="margin:16px 0 0;font-family:${SANS};font-size:11.5px;color:${C.textSoft};">&copy; ${new Date().getFullYear()} Old Columbans Association &middot; <a href="${base}" style="${link}">${escapeHtml(new URL(p.baseUrl).host)}</a></p>
  </td></tr>
</table>
</body></html>`;
}
