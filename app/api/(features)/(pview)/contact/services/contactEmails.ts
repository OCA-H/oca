import "server-only";
import type { MailMessage } from "@/app/api/core/mailer";
import type { ContactDetailsContent } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";
import {
  EMAIL_COLORS as C,
  contactSignature,
  emailBody,
  emailDetails,
  emailHero,
  emailLayout,
  emailMessage,
  emailParagraph,
  emailSignOff,
  emailSubhead,
  escapeHtml,
  formatPaidOn,
  iconBadge,
  type EmailDetailRow,
} from "@/app/api/core/emailLayout";

/** What a visitor sent through the "Get in touch" form on the home page, already checked. */
export interface ContactInquiry {
  name: string;
  email: string;
  batch: string;
  phone: string;
  subject: string;
  message: string;
}

/** "Dr. Asha Rao" → "Asha", for a friendlier heading. */
const firstName = (fullName: string) =>
  fullName.replace(/^(mr|mrs|ms|miss|dr|prof|col|capt|maj|gen|lt|brig|rev|hon)\.?\s+/i, "").split(" ")[0];

/**
 * The enquiry, to the Secretariat: the email under Contact details in the admin panel, with no
 * copies. Replying answers the visitor directly.
 */
export function contactInquiryEmail(params: {
  inquiry: ContactInquiry;
  receivedAt: Date;
  baseUrl: string;
  contact: ContactDetailsContent;
}): MailMessage {
  const { inquiry, receivedAt, baseUrl, contact } = params;
  const title = inquiry.subject || `A message from ${inquiry.name}`;
  const rows: EmailDetailRow[] = [
    { icon: "user", label: "Name", value: inquiry.name },
    ...(inquiry.batch ? [{ icon: "cap" as const, label: "Batch / Year", value: inquiry.batch }] : []),
    { icon: "mail", label: "Email", value: inquiry.email },
    ...(inquiry.phone ? [{ icon: "phone" as const, label: "Phone", value: inquiry.phone }] : []),
    { icon: "calendar", label: "Received", value: formatPaidOn(receivedAt) },
  ];

  const html = emailLayout({
    baseUrl,
    contact,
    title,
    preheader: `${inquiry.name} wrote in through the website: ${inquiry.message.slice(0, 90)}`,
    footerNote: "Sent from the “Get in touch” form on the website. Reply to this email to answer the sender.",
    rows: `${emailHero({
      badge: iconBadge("mail", "white", { size: 64, bg: C.brand, ring: C.gold }),
      eyebrow: "Website enquiry",
      title,
      lead: `${inquiry.name} wrote in through the “Get in touch” form.`,
    })}
      ${emailBody(`
        ${emailSubhead("From")}
        ${emailDetails(rows)}
        ${emailSubhead("Their message")}
        ${emailMessage({
          from: inquiry.name,
          meta: [inquiry.batch && `Batch of ${inquiry.batch}`, inquiry.email].filter(Boolean).join(" · "),
          subject: inquiry.subject,
          message: inquiry.message,
        })}
        ${emailParagraph(`Reply to this email to answer ${escapeHtml(inquiry.name)} at ${escapeHtml(inquiry.email)}.`, { soft: true, margin: "22px 0 0" })}
      `)}`,
  });

  const text = `${title}

${inquiry.name} wrote in through the "Get in touch" form on the website.

FROM
${rows.map(({ label, value }) => `${label}: ${value}`).join("\n")}

MESSAGE
${inquiry.message}

Reply to this email to answer ${inquiry.name} at ${inquiry.email}.`;

  return {
    to: contact.email,
    replyTo: inquiry.email,
    subject: `Website enquiry: ${title}`,
    text,
    html,
  };
}

/** The acknowledgement, to the visitor, with a copy of their message. Replies reach the Secretariat. */
export function contactAcknowledgementEmail(params: {
  inquiry: ContactInquiry;
  receivedAt: Date;
  baseUrl: string;
  contact: ContactDetailsContent;
}): MailMessage {
  const { inquiry, receivedAt, baseUrl, contact } = params;
  const rows: EmailDetailRow[] = [
    ...(inquiry.subject ? [{ icon: "mail" as const, label: "Subject", value: inquiry.subject }] : []),
    { icon: "calendar", label: "Sent", value: formatPaidOn(receivedAt) },
  ];
  const intro = `Thank you for writing to the Old Columbans Association. ${contact.name} has received your message and will get back to you at this address soon.`;
  const urgent = `If it is urgent, call us on ${contact.phone}.`;

  const html = emailLayout({
    baseUrl,
    contact,
    title: "We have received your message",
    preheader: `Thank you for writing in. ${contact.name} will get back to you soon.`,
    footerNote: "You are receiving this because you wrote to us through the “Get in touch” form on our website.",
    rows: `${emailHero({
      badge: iconBadge("check", "white", { size: 64, bg: C.brand, ring: C.gold }),
      eyebrow: "Message received",
      title: `Thank you, ${firstName(inquiry.name)}`,
      lead: "We have received your message.",
    })}
      ${emailBody(`
        ${emailParagraph(`Dear ${escapeHtml(inquiry.name)},`)}
        ${emailParagraph(escapeHtml(intro), { soft: true, margin: "0 0 4px" })}
        ${emailSubhead("Your message")}
        ${emailMessage({
          from: inquiry.name,
          meta: `Sent ${formatPaidOn(receivedAt)}`,
          subject: inquiry.subject,
          message: inquiry.message,
        })}
        ${emailParagraph(escapeHtml(urgent), { soft: true, margin: "22px 0 0" })}
        ${emailSignOff("With warm regards", contact)}
      `)}`,
  });

  const text = `Dear ${inquiry.name},

${intro}

YOUR MESSAGE
${rows.map(({ label, value }) => `${label}: ${value}`).join("\n")}

${inquiry.message}

${urgent}

With warm regards,
${contactSignature(contact)}`;

  return {
    to: inquiry.email,
    replyTo: contact.email,
    subject: "We have received your message – Old Columbans Association",
    text,
    html,
  };
}
