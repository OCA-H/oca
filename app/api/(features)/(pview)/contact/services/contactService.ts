import "server-only";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { Mailer } from "@/app/api/core/mailer";
import { RateLimiter } from "@/app/api/core/rateLimit";
import { getContactDetails } from "@/app/api/(features)/(pview)/site/services/siteContentService";
import { contactAcknowledgementEmail, contactInquiryEmail, type ContactInquiry } from "./contactEmails";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits with an optional leading +, after spaces, dashes, dots and brackets are dropped. */
const PHONE_PATTERN = /^\+?\d{7,15}$/;
const MAX_LENGTH = { name: 120, email: 255, batch: 20, phone: 20, subject: 150, message: 3000 } as const;

/** Each visitor may send a few messages an hour: every one also emails the address they typed. */
const limiter = new RateLimiter(5, 60 * 60 * 1000);

/** A single line: trimmed, with runs of whitespace (line breaks too) collapsed to one space. */
const line = (value: unknown) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "");

export class ContactService {
  /** Checks the form, field by field. Throws a 400 listing every problem. */
  validate(payload: Record<string, unknown>): ContactInquiry {
    const inquiry: ContactInquiry = {
      name: line(payload.name),
      email: line(payload.email).toLowerCase(),
      batch: line(payload.batch),
      phone: line(payload.phone),
      subject: line(payload.subject),
      message: typeof payload.message === "string" ? payload.message.replace(/\r\n/g, "\n").trim() : "",
    };

    const fields: FieldErrors = {};
    if (!inquiry.name) fields.name = "Please enter your name.";
    if (!inquiry.email) fields.email = "Please enter your email, so we can reply.";
    else if (!EMAIL_PATTERN.test(inquiry.email)) fields.email = "Enter a valid email address.";
    if (inquiry.phone && !PHONE_PATTERN.test(inquiry.phone.replace(/[\s\-().]/g, ""))) fields.phone = "Enter a valid phone number.";
    if (!inquiry.message) fields.message = "Please write your message.";
    for (const [key, max] of Object.entries(MAX_LENGTH)) {
      if (!fields[key] && inquiry[key as keyof ContactInquiry].length > max) fields[key] = `Please keep this under ${max} characters.`;
    }
    if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);
    return inquiry;
  }

  /**
   * Emails the enquiry to the contact email set in the admin panel, and only to it. Throws if it
   * cannot be sent, so the visitor knows to try again. Returns the time it was received, for the acknowledgement.
   */
  async sendInquiry(inquiry: ContactInquiry, ip: string, baseUrl: string): Promise<Date> {
    if (!limiter.attempt(ip)) {
      throw new HttpError(429, "You have sent several messages in a short time. Please try again in an hour, or write to us directly.");
    }
    await Mailer.ensureReady();

    const receivedAt = new Date();
    const contact = await getContactDetails();
    await Mailer.send(contactInquiryEmail({ inquiry, receivedAt, baseUrl, contact }));
    return receivedAt;
  }

  /** Emails the visitor a copy of their message. A failure is logged: the Secretariat already has it. */
  async sendAcknowledgement(inquiry: ContactInquiry, receivedAt: Date, baseUrl: string): Promise<void> {
    try {
      const contact = await getContactDetails();
      await Mailer.send(contactAcknowledgementEmail({ inquiry, receivedAt, baseUrl, contact }));
    } catch (error) {
      console.error(`Contact form: acknowledgement to ${inquiry.email} failed:`, error);
    }
  }
}
