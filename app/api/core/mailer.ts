import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import { inlineImages } from "./emailLayout";
import { HttpError } from "./httpError";

// Sends email through the SMTP mailbox in the SMTP_* settings (see .env.example).
// With every SMTP_* setting empty, development prints each message to the server terminal
// instead, so flows like password reset can be tested before a mailbox is set up.
// Partly filled settings, and production without them, are errors.

export interface MailMessage {
  to: string;
  /** Copied recipients, visible to everyone on the email. */
  cc?: string[];
  /** Where replies go, when not to MAIL_FROM: e.g. the visitor who wrote in through the contact form. */
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  /** Files sent with the email, e.g. an event pass. */
  attachments?: Attachment[];
}

const REQUIRED_SETTINGS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"] as const;

/** How long a successful SMTP login is trusted before ensureReady() checks again. */
const VERIFIED_FOR_MS = 10 * 60 * 1000;

// `next dev` re-runs modules on every edit; keep one connection pool across reloads.
// Keyed by the settings, so editing .env (which `next dev` reloads in place) takes effect.
const cache = globalThis as typeof globalThis & {
  ocaMailer?: Transporter;
  ocaMailerKey?: string;
  ocaMailerVerifiedAt?: number;
};

const settingsKey = () =>
  [...REQUIRED_SETTINGS, "SMTP_SECURE"].map((key) => process.env[key] ?? "").join("\u0000");

const unavailable = () => new HttpError(503, "Email is not available right now. Please try again later.");

export class Mailer {
  static get isConfigured() {
    return REQUIRED_SETTINGS.every((key) => process.env[key]);
  }

  /** Development with no SMTP settings at all: messages go to the terminal instead. */
  private static get printsToTerminal() {
    return process.env.NODE_ENV !== "production" && REQUIRED_SETTINGS.every((key) => !process.env[key]);
  }

  /**
   * Throws a 503 unless email can actually be sent: settings complete and the SMTP login accepted.
   * Call it before work that ends in an email, so a broken mailbox fails the request instead of
   * failing silently later. It does not depend on the recipient, so it reveals nothing about them.
   */
  static async ensureReady(): Promise<void> {
    if (this.printsToTerminal) return;

    const missing = REQUIRED_SETTINGS.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error(`Email unavailable: ${missing.join(", ")} not set (see .env.example).`);
      throw unavailable();
    }

    const transport = this.transport;
    if (cache.ocaMailerVerifiedAt && Date.now() - cache.ocaMailerVerifiedAt < VERIFIED_FOR_MS) return;
    try {
      await transport.verify();
      cache.ocaMailerVerifiedAt = Date.now();
    } catch (error) {
      console.error("Email unavailable: SMTP login failed:", error);
      throw unavailable();
    }
  }

  private static get transport(): Transporter {
    if (!cache.ocaMailer || cache.ocaMailerKey !== settingsKey()) {
      cache.ocaMailer?.close();
      cache.ocaMailerKey = settingsKey();
      cache.ocaMailerVerifiedAt = undefined;
      const port = Number(process.env.SMTP_PORT);
      cache.ocaMailer = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        // Port 465 is SSL from the start; 587 and 25 upgrade with STARTTLS.
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
        pool: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });
    }
    return cache.ocaMailer;
  }

  static async send(message: MailMessage): Promise<void> {
    if (!this.isConfigured) {
      if (!this.printsToTerminal) {
        throw new Error(`Email not sent to ${message.to}: ${REQUIRED_SETTINGS.join(", ")} must be set.`);
      }
      const files = message.attachments?.map((file) => file.filename).join(", ");
      console.info(`\n[mailer] SMTP not configured; email not sent.\nTo: ${message.to}${message.cc?.length ? `\nCc: ${message.cc.join(", ")}` : ""}${message.replyTo ? `\nReply-To: ${message.replyTo}` : ""}${files ? `\nAttachments: ${files}` : ""}\nSubject: ${message.subject}\n\n${message.text}\n`);
      return;
    }

    await this.transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      ...message,
      // The crest and icons the HTML references by cid:, carried inside the message.
      attachments: [...inlineImages(message.html), ...(message.attachments ?? [])],
    });
  }
}
