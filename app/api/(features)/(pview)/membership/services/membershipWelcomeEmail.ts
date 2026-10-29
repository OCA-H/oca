import "server-only";
import type { MailMessage } from "@/app/api/core/mailer";
import {
  EMAIL_COLORS as C,
  SECRETARIAT,
  emailButton,
  emailDetails,
  emailHero,
  emailIcon,
  emailLayout,
  emailNote,
  emailParagraph,
  emailSignOff,
  emailSteps,
  emailSubhead,
  escapeHtml,
  formatPaidOn,
  formatRupees,
  iconBadge,
  type EmailDetailRow,
  type EmailStep,
} from "@/app/api/core/emailLayout";
import type { MembershipApplication } from "../schema/membershipSchema";

/** CCAvenue sends the literal "null" for fields it has no value for. */
const gatewayValue = (value: string | null) => (value && value !== "null" ? value : null);

/** The member's ID on a deep green card, in the style of the e-Membership Card. */
const memberIdCard = (memberId: string, membershipType: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.brandDeep};border-radius:12px;border-collapse:separate;">
    <tr><td style="padding:20px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td valign="middle" width="44" style="width:44px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" width="36" height="36" style="width:36px;height:36px;border-radius:8px;background:rgba(201,162,39,.16);border:1px solid ${C.gold};">${emailIcon("idcard", "gold", 20)}</td></tr></table>
        </td>
        <td valign="middle" style="font-family:Inter,-apple-system,'Segoe UI',Arial,sans-serif;">
          <p style="margin:0;font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.gold};">Your member ID</p>
          <p style="margin:4px 0 0;font-size:22px;font-weight:700;letter-spacing:.04em;color:#FFFFFF;">${escapeHtml(memberId)}</p>
        </td>
        <td align="right" valign="middle" style="font-family:Inter,-apple-system,'Segoe UI',Arial,sans-serif;">
          <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.12);font-size:12px;font-weight:600;color:${C.onDark};white-space:nowrap;">${escapeHtml(membershipType)}</span>
        </td>
      </tr></table>
    </td></tr>
  </table>`;

/**
 * The welcome email sent once a membership payment goes through. It doubles as the member's
 * payment acknowledgement. `cc` is the addresses set under Email settings in the admin panel.
 */
export function membershipWelcomeEmail(params: {
  application: MembershipApplication;
  memberId: string;
  cc: string[];
  baseUrl: string;
}): MailMessage {
  const { application, memberId, cc, baseUrl } = params;
  const fullName = [application.title, application.firstName, application.middleName, application.lastName]
    .filter(Boolean)
    .join(" ");
  const amount = formatRupees(application.amount);
  const signInUrl = `${baseUrl}/member-signin`;
  const paymentMode = gatewayValue(application.paymentMode);
  const trackingId = gatewayValue(application.trackingId);

  const rows: EmailDetailRow[] = [
    { icon: "star", label: "Membership", value: application.membershipType },
    { icon: "cap", label: "Batch", value: application.batchYear },
    { icon: "receipt", label: "Order reference", value: application.orderId },
    { icon: "rupee", label: "Amount paid", value: amount },
    { icon: "calendar", label: "Paid on", value: formatPaidOn(application.paidAt ?? application.updatedAt) },
  ];
  if (paymentMode) rows.push({ icon: "card", label: "Payment method", value: paymentMode === "Unified Payments" ? "UPI" : paymentMode });
  if (trackingId) rows.push({ icon: "shield", label: "CCAvenue reference", value: trackingId });

  const steps: EmailStep[] = [
    {
      icon: "login",
      title: "Sign in to the members’ area",
      text: "Use your email, mobile number or member ID with the password you chose.",
      href: signInUrl,
      linkLabel: "Sign in",
    },
    {
      icon: "idcard",
      title: "Get your e-Membership Card",
      text: "Your digital card is ready to view and download.",
      href: `${baseUrl}/sv/profile/membership-card`,
      linkLabel: "View card",
    },
    {
      icon: "user",
      title: "Complete your profile",
      text: "Add a photo and keep your phone and address current.",
      href: `${baseUrl}/sv/profile/account`,
      linkLabel: "Update details",
    },
  ];

  const html = emailLayout({
    baseUrl,
    title: "Welcome to the Old Columbans Association",
    preheader: `Your ${application.membershipType} registration is complete. Member ID ${memberId}.`,
    footerNote: "Please keep this email as the acknowledgement of your membership payment.",
    rows: `${emailHero({
      badge: iconBadge("check", "white", { size: 64, bg: C.brand, ring: C.gold }),
      eyebrow: "Registration complete",
      title: `Welcome to the OCA, ${application.firstName}`,
      lead: "Your membership registration has gone through.",
    })}
      <tr><td style="padding:24px 32px 32px;">
        ${emailParagraph(`Dear ${escapeHtml(fullName)},`)}
        ${emailParagraph(
          `Thank you for joining the Old Columbans Association as a ${escapeHtml(application.membershipType)}. We are delighted to welcome you back into the Columban family, and we look forward to seeing you at our gatherings.`,
          { soft: true, margin: "0 0 22px" }
        )}
        ${memberIdCard(memberId, application.membershipType)}
        ${emailSubhead("Payment details")}
        ${emailDetails(rows)}
        ${emailSubhead("What’s next")}
        ${emailSteps(steps)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 0 0;">${emailButton(signInUrl, "Sign in to the members’ area")}</td></tr></table>
        ${emailNote(
          `Questions about your membership? Write to the Secretariat at <a href="mailto:${SECRETARIAT.email}" style="color:${C.brandMid};font-weight:600;text-decoration:none;">${SECRETARIAT.email}</a>.`
        )}
        ${emailSignOff("With warm regards")}
      </td></tr>`,
  });

  const text = `Dear ${fullName},

Welcome to the Old Columbans Association. Your ${application.membershipType} registration is complete.

Your member ID: ${memberId}

PAYMENT DETAILS
${rows.map(({ label, value }) => `${label}: ${value}`).join("\n")}

WHAT'S NEXT
${steps.map((step) => `- ${step.title}: ${step.text}\n  ${step.href}`).join("\n")}

Questions about your membership? Write to the Secretariat at ${SECRETARIAT.email}.

Please keep this email as the acknowledgement of your membership payment.

With warm regards,
${SECRETARIAT.name}
${SECRETARIAT.email} · ${SECRETARIAT.phone}
${SECRETARIAT.address}`;

  return {
    to: application.email,
    ...(cc.length > 0 && { cc }),
    subject: `Welcome to the OCA – your member ID is ${memberId}`,
    text,
    html,
  };
}
