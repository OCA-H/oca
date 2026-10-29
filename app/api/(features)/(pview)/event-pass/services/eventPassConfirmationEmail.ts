import "server-only";
import type { MailMessage } from "@/app/api/core/mailer";
import type { ContactDetailsContent } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";
import {
  EMAIL_COLORS as C,
  contactSignature,
  emailBody,
  emailContactLink,
  emailDetails,
  emailHero,
  emailLayout,
  emailNote,
  emailParagraph,
  emailSignOff,
  emailSubhead,
  escapeHtml,
  formatPaidOn,
  formatRupees,
  iconBadge,
  type EmailDetailRow,
} from "@/app/api/core/emailLayout";
import type { EventPassBooking } from "../schema/eventPassBookingSchema";
import { PASS_CARD_MISSING } from "./eventPassCard";

/** What the printed pass says; keep in step with the artwork in public/images/passes. */
const EVENT = {
  name: "OCA Annual Dinner",
  date: "Friday, 18 December 2026",
  venue: "Qutub Golf Course, New Delhi",
} as const;

/** CCAvenue sends the literal "null" for fields it has no value for. */
const gatewayValue = (value: string | null) => (value && value !== "null" ? value : null);

/** "Dr. Asha Rao" → "Asha": the full name is stored with the member's title. */
const firstName = (fullName: string) =>
  fullName.replace(/^(mr|mrs|ms|miss|dr|prof|col|capt|maj|gen|lt|brig|rev|hon)\.?\s+/i, "").split(" ")[0];

/**
 * The email sent once a pass payment goes through, with the member's digital pass attached.
 * It doubles as the payment acknowledgement. `card` is the pass from renderPassCard(); a detail
 * missing from it (a couple pass booked without the spouse's name, a member with no batch on
 * record) shows as "NA" on the card and here, and the email asks the member to send it in.
 */
export function eventPassConfirmationEmail(params: {
  booking: EventPassBooking;
  card: Buffer;
  /** Whether the pass admits a spouse, so a missing spouse name is called out. */
  includesSpouse: boolean;
  batch: string | null | undefined;
  cc: string[];
  baseUrl: string;
  contact: ContactDetailsContent;
}): MailMessage {
  const { booking, card, includesSpouse, batch, cc, baseUrl, contact } = params;
  const amount = formatRupees(booking.amount);
  const paymentMode = gatewayValue(booking.paymentMode);
  const trackingId = gatewayValue(booking.trackingId);
  const cardFile = `OCA-Annual-Dinner-Pass-${booking.orderId}.jpg`;

  const eventRows: EmailDetailRow[] = [
    { icon: "star", label: "Pass", value: booking.passLabel },
    { icon: "user", label: "Member", value: booking.fullName },
  ];
  if (includesSpouse) eventRows.push({ icon: "user", label: "Spouse", value: booking.spouseName || PASS_CARD_MISSING });
  eventRows.push(
    { icon: "idcard", label: "Membership no.", value: booking.memberId },
    { icon: "cap", label: "Batch", value: batch || PASS_CARD_MISSING },
    { icon: "calendar", label: "Date", value: EVENT.date },
    { icon: "pin", label: "Venue", value: EVENT.venue }
  );

  const paymentRows: EmailDetailRow[] = [
    ...booking.lineItems.map((item) => ({ icon: "receipt" as const, label: item.label, value: formatRupees(item.amount) })),
    { icon: "rupee", label: "Amount paid", value: amount },
    { icon: "card", label: "Order reference", value: booking.orderId },
    { icon: "calendar", label: "Paid on", value: formatPaidOn(booking.paidAt ?? booking.updatedAt) },
  ];
  if (paymentMode) paymentRows.push({ icon: "card", label: "Payment method", value: paymentMode === "Unified Payments" ? "UPI" : paymentMode });
  if (trackingId) paymentRows.push({ icon: "shield", label: "CCAvenue reference", value: trackingId });

  const missing = [
    ...(includesSpouse && !booking.spouseName ? ["your spouse’s name"] : []),
    ...(batch ? [] : ["your batch"]),
  ].join(" and ");
  const fixLine = missing
    ? `Your pass shows ${PASS_CARD_MISSING} where ${missing} should be. Send it to the Secretariat at ${contact.email} and we will send you an updated pass.`
    : `Spotted a mistake on it? Write to the Secretariat at ${contact.email} and we will send a corrected one.`;

  const html = emailLayout({
    baseUrl,
    contact,
    title: `Your ${EVENT.name} pass`,
    preheader: `Your ${booking.passLabel} pass for ${EVENT.date} is attached.`,
    footerNote: "Please keep this email as the acknowledgement of your pass payment.",
    rows: `${emailHero({
      badge: iconBadge("check", "white", { size: 64, bg: C.brand, ring: C.gold }),
      eyebrow: "Pass confirmed",
      title: `See you at the dinner, ${firstName(booking.fullName)}`,
      lead: `Your ${EVENT.name} pass is attached to this email.`,
    })}
      ${emailBody(`
        ${emailParagraph(`Dear ${escapeHtml(booking.fullName)},`)}
        ${emailParagraph(
          `Thank you for booking the ${escapeHtml(booking.passLabel)} for the ${EVENT.name}. Your digital pass, with your name on it, is attached as <b>${escapeHtml(cardFile)}</b>. Please show it on your phone, or bring a printout, at the entrance.`,
          { soft: true, margin: "0 0 4px" }
        )}
        ${emailSubhead("Your pass")}
        ${emailDetails(eventRows)}
        ${emailSubhead("Payment details")}
        ${emailDetails(paymentRows)}
        ${emailNote(`${escapeHtml(fixLine).replace(escapeHtml(contact.email), emailContactLink(contact))} The pass is not transferable.`)}
        ${emailSignOff("With warm regards", contact)}
      `)}`,
  });

  const text = `Dear ${booking.fullName},

Thank you for booking the ${booking.passLabel} for the ${EVENT.name}. Your digital pass is attached as ${cardFile}. Please show it on your phone, or bring a printout, at the entrance.

YOUR PASS
${eventRows.map(({ label, value }) => `${label}: ${value}`).join("\n")}

PAYMENT DETAILS
${paymentRows.map(({ label, value }) => `${label}: ${value}`).join("\n")}

${fixLine} The pass is not transferable.

Please keep this email as the acknowledgement of your pass payment.

With warm regards,
${contactSignature(contact)}`;

  return {
    to: booking.email,
    ...(cc.length > 0 && { cc }),
    subject: `Your ${EVENT.name} pass – ${booking.passLabel}`,
    text,
    html,
    attachments: [{ filename: cardFile, content: card, contentType: "image/jpeg" }],
  };
}
