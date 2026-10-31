import "server-only";
import crypto from "node:crypto";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { CcAvenue, type CcAvenueCheckout } from "@/app/api/core/ccavenue";
import { Mailer } from "@/app/api/core/mailer";
import type { SessionData } from "@/app/api/core/session";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import { getContactDetails, getRegistrationCcEmails } from "@/app/api/(features)/(pview)/site/services/siteContentService";
import { EventPassRepository } from "../repository/eventPassRepository";
import { EventPassBookingRepository } from "../repository/eventPassBookingRepository";
import type { EventPass } from "../schema/eventPassSchema";
import type {
  BookingLineItem,
  EventPassBooking,
  EventPassPaymentStatus,
} from "../schema/eventPassBookingSchema";
import { passCardDesign, renderPassCard } from "./eventPassCard";
import { eventPassConfirmationEmail } from "./eventPassConfirmationEmail";

/** Add-on prices used when a pass's metadata does not set its own. */
const DEFAULT_TEACHER_PRICE = 5000;
const DEFAULT_CHILD_UNDER12_PRICE = 2500;
const DEFAULT_CHILD_ABOVE12_PRICE = 3000;

/** The most the booking form offers; anything above is rejected. */
const MAX_TEACHERS = 10;
const MAX_CHILDREN = 6;
const MAX_SPOUSE_NAME = 150;

export interface EventPassCheckout extends CcAvenueCheckout {
  orderId: string;
}

export interface EventPassOrderSummary {
  orderId: string;
  status: EventPassPaymentStatus;
  eventName: string;
  passLabel: string;
  lineItems: BookingLineItem[];
  amount: number;
  currency: string;
  fullName: string;
  firstName: string;
  memberId: string;
  email: string;
  spouseName: string | null;
  trackingId: string | null;
  bankRefNo: string | null;
  paymentMode: string | null;
  message: string | null;
  paidAt: Date | null;
  updatedAt: Date;
}

/** "pr•••@gmail.com": enough for the member to recognise, without exposing it by order number. */
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}•••@${domain}`;
};

/** CCAvenue sends the literal "null" for fields it has no value for. */
const gatewayValue = (value: string | null) => (value && value !== "null" ? value : null);

/** CCAvenue allows up to 30 alphanumeric characters. */
const newOrderId = () =>
  `OCAP${Date.now().toString(36)}${crypto.randomBytes(5).toString("hex")}`.toUpperCase();

const toPaymentStatus = (orderStatus: string | undefined): EventPassPaymentStatus => {
  if (orderStatus === "Success") return "paid";
  if (orderStatus === "Aborted") return "cancelled";
  return "failed";
};

const metaPrice = (pass: EventPass, key: string, fallback: number) => {
  const value = pass.metadata?.[key];
  return typeof value === "number" && value >= 0 ? value : fallback;
};

/** Whole number from 0 to max, or null when the value is anything else. */
const count = (value: unknown, max: number): number | null => {
  if (value === undefined || value === null || value === "") return 0;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= max ? n : null;
};

/** "Dr. Asha Rao" → "Asha": the full name is stored with the member's title. */
const firstName = (fullName: string) =>
  fullName.replace(/^(mr|mrs|ms|miss|dr|prof|col|capt|maj|gen|lt|brig|rev|hon)\.?\s+/i, "").split(" ")[0];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Batch years a pass is limited to, read from its eligibility text ("Batch 2015–25 only"), or null
 * when it is open to every batch.
 */
const batchRange = (eligibility: string | null): [number, number] | null => {
  const match = eligibility?.match(/(\d{4})\s*[–-]\s*(\d{2,4})/);
  if (!match) return null;
  const from = Number(match[1]);
  const to = match[2].length === 2 ? Math.floor(from / 100) * 100 + Number(match[2]) : Number(match[2]);
  return [from, to];
};

export class EventPassBookingService {
  constructor(
    private readonly passes: EventPassRepository,
    private readonly bookings: EventPassBookingRepository,
    private readonly users: UserRepository
  ) {}

  /**
   * Prices the member's choice from event_passes (never from the client), stores it as a pending
   * booking and returns the encrypted CCAvenue request the browser posts to the gateway.
   */
  async checkout(session: SessionData, payload: Record<string, unknown>, baseUrl: string): Promise<EventPassCheckout> {
    const eventName = typeof payload.eventName === "string" && payload.eventName.trim() ? payload.eventName.trim() : "annual-dinner";
    const passId = typeof payload.passId === "string" ? payload.passId.trim() : "";
    if (!passId) throw HttpError.badRequest("Please choose a pass.", { passId: "Please choose a pass." });

    const pass = await this.passes.findByPassId(eventName, passId);
    if (!pass) throw HttpError.notFound("This pass is no longer available.");
    if (pass.status !== "active") throw HttpError.conflict(`${pass.label} is not open for booking yet.`);
    if (pass.availableQuantity !== null && pass.availableQuantity <= 0) {
      throw HttpError.conflict(`${pass.label} is sold out.`);
    }

    const user = await this.users.findById(session.user.id);
    if (!user || user.status !== "active") throw HttpError.unauthorized("Please sign in again to buy a pass.");
    if (!user.email) throw HttpError.badRequest("Please add your email address in My Account first, so we can send you the pass.");
    const email = user.email;

    const range = batchRange(pass.batchEligibility);
    if (range) {
      const batch = Number.parseInt(user.batchYear ?? "", 10);
      if (!(batch >= range[0] && batch <= range[1])) {
        throw HttpError.forbidden(
          `${pass.tierTitle} passes are for batches ${range[0]}–${range[1]}. ` +
            (Number.isNaN(batch) ? "Your profile has no batch year on record." : `Your batch on record is ${user.batchYear}.`)
        );
      }
    }

    const fields: FieldErrors = {};
    const teachers = pass.allowsTeacherSponsorship ? count(payload.teachers, MAX_TEACHERS) : 0;
    const under12 = pass.allowsChildren ? count(payload.under12, MAX_CHILDREN) : 0;
    const above12 = pass.allowsChildren ? count(payload.above12, MAX_CHILDREN) : 0;
    if (teachers === null) fields.teachers = `Choose between 0 and ${MAX_TEACHERS} teachers.`;
    if (under12 === null) fields.under12 = `Choose between 0 and ${MAX_CHILDREN} children.`;
    if (above12 === null) fields.above12 = `Choose between 0 and ${MAX_CHILDREN} children.`;
    const spouseName = pass.includesSpouse && typeof payload.spouseName === "string" ? payload.spouseName.trim() : "";
    if (spouseName.length > MAX_SPOUSE_NAME) fields.spouseName = "Spouse name is too long.";
    if (Object.keys(fields).length > 0 || teachers === null || under12 === null || above12 === null) {
      throw HttpError.badRequest("Some details need fixing.", fields);
    }

    const lineItems: BookingLineItem[] = [{ label: pass.label, amount: pass.price }];
    if (teachers > 0) {
      lineItems.push({
        label: `Sponsor ${plural(teachers, "teacher", "teachers")}`,
        amount: teachers * metaPrice(pass, "teacherSponsorPrice", DEFAULT_TEACHER_PRICE),
      });
    }
    if (under12 > 0) {
      lineItems.push({
        label: `${plural(under12, "child", "children")} under 12`,
        amount: under12 * metaPrice(pass, "childUnder12Price", DEFAULT_CHILD_UNDER12_PRICE),
      });
    }
    if (above12 > 0) {
      lineItems.push({
        label: `${plural(above12, "child", "children")} above 12`,
        amount: above12 * metaPrice(pass, "childAbove12Price", DEFAULT_CHILD_ABOVE12_PRICE),
      });
    }
    const amount = lineItems.reduce((sum, item) => sum + item.amount, 0);
    if (amount <= 0) throw HttpError.conflict(`${pass.label} has no price set yet.`);

    const booking = await this.bookings.create({
      orderId: newOrderId(),
      eventName,
      eventPassId: pass.id,
      passId: pass.passId,
      passLabel: pass.label,
      userId: user.id,
      memberId: user.memberId,
      fullName: user.fullName,
      email,
      mobile: user.mobile,
      spouseName: spouseName || null,
      teachers,
      childrenUnder12: under12,
      childrenAbove12: above12,
      lineItems,
      amount,
      currency: pass.currency,
    });

    const address = (user.metadata?.address ?? {}) as Record<string, string | null | undefined>;
    const responseUrl = `${baseUrl}/api/event-pass/payment/response`;
    const checkout = CcAvenue.buildCheckout({
      order_id: booking.orderId,
      amount: booking.amount.toFixed(2),
      redirect_url: responseUrl,
      cancel_url: responseUrl,
      billing_name: user.fullName,
      billing_email: email,
      billing_tel: user.mobile ?? "",
      billing_address: [address.line1, address.line2, address.line3].filter(Boolean).join(", "),
      billing_city: address.city ?? "",
      billing_state: address.state ?? "",
      billing_zip: address.zip ?? "",
      billing_country: address.country ?? "",
      merchant_param1: "Event pass",
      merchant_param2: `${eventName}:${pass.passId}`,
      merchant_param3: user.memberId,
    });

    return { ...checkout, orderId: booking.orderId };
  }

  /**
   * Applies the result CCAvenue posts back. Safe to call more than once for the same order:
   * a paid booking is never changed again, and stock is only taken, and the pass emailed, on the
   * first paid response.
   */
  async handleGatewayResponse(encResp: string, baseUrl: string): Promise<EventPassBooking> {
    const response = CcAvenue.parseResponse(encResp);
    const booking = response.order_id ? await this.bookings.findByOrderId(response.order_id) : null;
    if (!booking) throw HttpError.notFound("We could not find this pass order.");
    if (booking.status === "paid") return booking;

    let status = toPaymentStatus(response.order_status);
    let message = response.failure_message || response.status_message || null;
    if (status === "paid" && Number(response.amount) !== booking.amount) {
      console.error(`Pass order ${booking.orderId}: paid ${response.amount}, expected ${booking.amount}.`);
      status = "failed";
      message = "The amount paid did not match the pass total.";
    }

    const gateway = {
      trackingId: response.tracking_id || null,
      bankRefNo: response.bank_ref_no || null,
      paymentMode: response.payment_mode || null,
      gatewayStatus: response.order_status || null,
      gatewayMessage: message?.slice(0, 255) ?? null,
      gatewayResponse: response,
    };

    const updated =
      status === "paid"
        ? await this.bookings.markPaid(booking.id, gateway)
        : await this.bookings.markUnpaid(booking.id, { ...gateway, status });
    if (updated?.oversold) {
      console.error(`Pass order ${booking.orderId} was paid after ${booking.passLabel} sold out; follow up with the member.`);
    }
    if (status === "paid" && updated) await this.sendPass(updated, baseUrl);
    // null means another response marked it paid first.
    return updated ?? (await this.bookings.findByOrderId(booking.orderId)) ?? booking;
  }

  /**
   * Emails the member their pass, with their name, member ID and batch written on it, copying the
   * addresses set under Email settings in the admin panel. A failure is logged, not thrown: the
   * payment is already recorded, and the Secretariat can send the pass by hand.
   */
  private async sendPass(booking: EventPassBooking, baseUrl: string): Promise<void> {
    try {
      const [pass, user] = await Promise.all([
        this.passes.findById(booking.eventPassId),
        this.users.findById(booking.userId),
      ]);
      const includesSpouse = pass?.includesSpouse ?? Boolean(booking.spouseName);
      const batch = user?.batchYear;
      const card = await renderPassCard(passCardDesign({ passId: booking.passId, includesSpouse }), {
        memberName: booking.fullName,
        spouseName: booking.spouseName,
        memberId: booking.memberId,
        batch,
      });
      const [ccEmails, contact] = await Promise.all([getRegistrationCcEmails(), getContactDetails()]);
      const cc = ccEmails.filter((email) => email !== booking.email);
      await Mailer.send(eventPassConfirmationEmail({ booking, card, includesSpouse, batch, cc, baseUrl, contact }));
    } catch (error) {
      console.error(`Pass order ${booking.orderId}: pass email to ${booking.email} failed:`, error);
    }
  }

  async getOrderSummary(orderId: string): Promise<EventPassOrderSummary> {
    const booking = await this.bookings.findByOrderId(orderId.trim());
    if (!booking) throw HttpError.notFound("We could not find this pass order.");

    return {
      orderId: booking.orderId,
      status: booking.status as EventPassPaymentStatus,
      eventName: booking.eventName,
      passLabel: booking.passLabel,
      lineItems: booking.lineItems,
      amount: booking.amount,
      currency: booking.currency,
      fullName: booking.fullName,
      firstName: firstName(booking.fullName),
      memberId: booking.memberId,
      email: maskEmail(booking.email),
      spouseName: booking.spouseName,
      trackingId: gatewayValue(booking.trackingId),
      bankRefNo: gatewayValue(booking.bankRefNo),
      paymentMode: gatewayValue(booking.paymentMode),
      message: gatewayValue(booking.gatewayMessage),
      paidAt: booking.paidAt,
      updatedAt: booking.updatedAt,
    };
  }
}
