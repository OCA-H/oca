import "server-only";
import type { MailMessage } from "@/app/api/core/mailer";
import type { ContactDetailsContent } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";
import type { ContributionWithFund } from "../schema/contributionSchema";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const paidOn = (date: Date) =>
  `${date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;

/** CCAvenue sends the literal "null" for fields it has no value for. */
const gatewayValue = (value: string | null) => (value && value !== "null" ? value : null);

/** "ABCDE1234F" → "XXXXX1234F", enough for the donor to recognise in an email. */
const maskPan = (pan: string) => `XXXXX${pan.slice(5)}`;

/** "Sponsor a teacher (2 teachers)", or just the fund for a free amount. */
export const fundLine = (contribution: ContributionWithFund) => {
  const { units, fund } = contribution;
  if (!units) return fund.label;
  const unit = fund.unitLabel ?? "unit";
  return `${fund.label} (${units} ${unit}${units > 1 ? "s" : ""})`;
};

/**
 * The thank-you email sent once a contribution is paid: table layout and inline styles, because
 * email clients ignore most CSS. Doubles as the member's payment acknowledgement. `cc` is the
 * addresses set under Email settings in the admin panel; `contact` the Contact details set there.
 */
export function contributionThankYouEmail(
  contribution: ContributionWithFund,
  baseUrl: string,
  cc: string[],
  contact: ContactDetailsContent
): MailMessage {
  const amount = rupees(contribution.amount);
  const towards = fundLine(contribution);
  const paymentMode = gatewayValue(contribution.paymentMode);
  const trackingId = gatewayValue(contribution.trackingId);
  const rows: [string, string][] = [
    ["Order reference", contribution.orderId],
    ["Contribution towards", towards],
    ["Amount", amount],
    ["Paid on", paidOn(contribution.paidAt ?? contribution.updatedAt)],
  ];
  if (paymentMode) rows.push(["Payment method", paymentMode === "Unified Payments" ? "UPI" : paymentMode]);
  if (trackingId) rows.push(["CCAvenue reference", trackingId]);

  const taxNote = contribution.wants80g
    ? `Your 80G receipt will be issued by the Secretariat${contribution.pan ? ` against PAN ${maskPan(contribution.pan)}` : ""}. If we need anything more for it, we will write to you at this address.`
    : "You did not ask for an 80G receipt. If you would like one, reply to this email with your PAN and the order reference above.";

  const text = `Dear ${contribution.donorName},

Thank you for your contribution of ${amount} to the ${towards}.

Gifts like yours are how the Old Columbans Association keeps its promise to St. Columba's School: to its teachers, its students, and the generations still to come. We are grateful that you chose to stand behind it.

${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}

${taxNote}

Please keep this email as the acknowledgement of your payment.

With gratitude,
${contact.name}
${contact.email} · ${contact.phone}
${contact.address}`;

  const rowsHtml = rows
    .map(
      ([label, value], i) => `<tr>
          <td style="padding:10px 0;${i > 0 ? "border-top:1px solid #E6EEE7;" : ""}font-size:13.5px;color:#5A6B60;">${escapeHtml(label)}</td>
          <td align="right" style="padding:10px 0;${i > 0 ? "border-top:1px solid #E6EEE7;" : ""}font-size:13.5px;font-weight:600;color:#12251A;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F5F8F5;font-family:Inter,-apple-system,Segoe UI,Arial,sans-serif;color:#12251A;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8F5;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #D8E4DA;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#0F5E2D;padding:26px 32px;">
        <img src="${escapeHtml(baseUrl)}/images/oca-crest.png" width="44" height="44" alt="OCA crest" style="vertical-align:middle;margin-right:12px;">
        <span style="vertical-align:middle;color:#FFFFFF;font-size:18px;font-weight:700;">Old Columbans Association</span>
      </td></tr>
      <tr><td align="center" style="padding:34px 32px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="64" height="64" style="width:64px;height:64px;border-radius:32px;background:#FBF4E3;border:2px solid #C9A227;font-size:30px;line-height:64px;color:#C9A227;">&#9829;</td></tr></table>
        <p style="margin:18px 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#14803C;">Contribution received</p>
        <h1 style="margin:0;font-size:24px;line-height:1.3;color:#0F5E2D;">Thank you for your contribution</h1>
        <p style="margin:10px 0 0;font-size:30px;font-weight:700;color:#12251A;">${escapeHtml(amount)}</p>
        <p style="margin:4px 0 0;font-size:14px;color:#5A6B60;">towards the ${escapeHtml(towards)}</p>
      </td></tr>
      <tr><td style="padding:28px 32px 32px;">
        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;">Dear ${escapeHtml(contribution.donorName)},</p>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#5A6B60;">Gifts like yours are how the Old Columbans Association keeps its promise to St. Columba&rsquo;s School &mdash; to its teachers, its students, and the generations still to come. We are grateful that you chose to stand behind it.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;padding:6px 18px;background:#F8FBF8;border:1px solid #D8E4DA;border-radius:10px;">
          ${rowsHtml}
        </table>
        <p style="margin:22px 0 0;padding:14px 16px;background:#FBF4E3;border-left:3px solid #C9A227;font-size:13.5px;line-height:1.6;color:#5A6B60;">${escapeHtml(taxNote)}</p>
        <p style="margin:22px 0 0;font-size:15px;line-height:1.65;">With gratitude,<br><b style="color:#0F5E2D;">${escapeHtml(contact.name)}</b></p>
      </td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #D8E4DA;font-size:12.5px;line-height:1.6;color:#5A6B60;">
        Please keep this email as the acknowledgement of your payment.<br>
        ${escapeHtml(contact.name)} &middot; <a href="mailto:${escapeHtml(contact.email)}" style="color:#14803C;">${escapeHtml(contact.email)}</a> &middot; ${escapeHtml(contact.phone)}<br>
        ${escapeHtml(contact.address)}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return {
    to: contribution.email,
    ...(cc.length > 0 && { cc }),
    subject: `Thank you for your contribution of ${amount} – Old Columbans Association`,
    text,
    html,
  };
}
