import "server-only";
import type { MailMessage } from "@/app/api/core/mailer";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** The reset email: table layout and inline styles, because email clients ignore most CSS. */
export function passwordResetEmail(params: {
  to: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
  baseUrl: string;
}): MailMessage {
  const { to, resetUrl, expiresInMinutes, baseUrl } = params;
  const name = escapeHtml(params.name);
  const url = escapeHtml(resetUrl);

  const text = `Dear ${params.name},

We received a request to reset the password for your Old Columbans Association account.

Choose a new password here (the link works once and expires in ${expiresInMinutes} minutes):
${resetUrl}

If you did not ask for this, you can ignore this email; your password will not change.

The OCA Secretariat
info@oldcolumban.net · 011-23748666`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F5F8F5;font-family:Inter,-apple-system,Segoe UI,Arial,sans-serif;color:#12251A;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8F5;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #D8E4DA;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#0F5E2D;padding:26px 32px;">
        <img src="${escapeHtml(baseUrl)}/images/oca-crest.png" width="44" height="44" alt="" style="vertical-align:middle;margin-right:12px;">
        <span style="vertical-align:middle;color:#FFFFFF;font-size:18px;font-weight:700;">Old Columbans Association</span>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#14803C;">Password reset</p>
        <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;color:#0F5E2D;">Choose a new password</h1>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.65;">Dear ${name},</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#5A6B60;">We received a request to reset the password for your Old Columbans Association account. Click the button below to choose a new one.</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:4px;background:#1B9E4B;">
          <a href="${url}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Reset my password</a>
        </td></tr></table>
        <p style="margin:24px 0 0;padding:14px 16px;background:#FBF4E3;border-left:3px solid #C9A227;font-size:13.5px;line-height:1.6;color:#5A6B60;">This link works once and expires in <b style="color:#12251A;">${expiresInMinutes} minutes</b>. If you did not ask for a reset, ignore this email &mdash; your password will not change.</p>
        <p style="margin:22px 0 0;font-size:12.5px;line-height:1.6;color:#5A6B60;">Button not working? Paste this link into your browser:<br><a href="${url}" style="color:#14803C;word-break:break-all;">${url}</a></p>
      </td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #D8E4DA;font-size:12.5px;line-height:1.6;color:#5A6B60;">
        The OCA Secretariat &middot; <a href="mailto:info@oldcolumban.net" style="color:#14803C;">info@oldcolumban.net</a> &middot; 011-23748666<br>
        St. Columba&rsquo;s School, Ashoka Place, New Delhi &ndash; 110 001
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { to, subject: "Reset your Old Columbans Association password", text, html };
}
