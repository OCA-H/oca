import "server-only";
import crypto from "node:crypto";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { hashPassword } from "@/app/api/core/auth";
import { isUniqueViolation } from "@/app/api/core/baseRepository";
import { CcAvenue, type CcAvenueCheckout } from "@/app/api/core/ccavenue";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import { MembershipRepository } from "../repository/membershipRepository";
import type { MembershipApplication, MembershipPaymentStatus } from "../schema/membershipSchema";

/** Life membership fee in rupees. Always charged from here, never from the client. */
export const MEMBERSHIP_FEE = 2000;
export const MEMBERSHIP_TYPE = "Life Member";

/**
 * Status given to the account created after payment. "active" lets the member sign in straight
 * away; set it to "pending" to hold sign-in until the Secretariat approves each application.
 */
const NEW_MEMBER_STATUS = "active";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export interface MembershipCheckout extends CcAvenueCheckout {
  orderId: string;
}

export interface MembershipOrderSummary {
  orderId: string;
  status: MembershipPaymentStatus;
  amount: number;
  currency: string;
  membershipType: string;
  firstName: string;
  fullName: string;
  email: string;
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

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** CCAvenue allows up to 30 alphanumeric characters. */
const newOrderId = () =>
  `OCAM${Date.now().toString(36)}${crypto.randomBytes(5).toString("hex")}`.toUpperCase();

const toPaymentStatus = (orderStatus: string | undefined): MembershipPaymentStatus => {
  if (orderStatus === "Success") return "paid";
  if (orderStatus === "Aborted") return "cancelled";
  return "failed";
};

export class MembershipService {
  constructor(
    private readonly repository: MembershipRepository,
    private readonly users: UserRepository
  ) {}

  /**
   * Validates the application, stores it as pending and returns the encrypted CCAvenue request
   * the browser posts to the gateway.
   */
  async checkout(payload: Record<string, unknown>, baseUrl: string): Promise<MembershipCheckout> {
    const fields: FieldErrors = {};
    const required = (key: string, label: string) => {
      const value = text(payload[key]);
      if (!value) fields[key] = `${label} is required.`;
      return value;
    };

    const title = required("title", "Title");
    const batch = required("batch", "Batch");
    const firstName = required("first_name", "First name");
    const lastName = required("last_name", "Last name");
    const email = required("email", "Email").toLowerCase();
    const password = typeof payload.password === "string" ? payload.password : "";
    const countryCode = required("country_code", "Country code");
    const mobile = required("mobile", "Mobile");
    const addr1 = required("addr1", "Address line 1");
    const city = required("city", "City");
    const state = required("state", "State");
    const zip = required("zip", "Zip");
    const country = required("country", "Country");

    if (email && !EMAIL_PATTERN.test(email)) fields.email = "Enter a valid email address.";
    if (password.length < MIN_PASSWORD_LENGTH) {
      fields.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (mobile && !/^\d{6,15}$/.test(mobile.replace(/[\s-]/g, ""))) fields.mobile = "Enter a valid mobile number.";
    if (payload.agree_rules !== true) fields.agree_rules = "Please agree to the Rules & By-Laws.";

    if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

    if (await this.users.findByEmail(email)) {
      throw HttpError.conflict("This email is already registered with OCA. Please sign in instead.");
    }

    const { hash, salt } = hashPassword(password);
    const application = await this.repository.create({
      orderId: newOrderId(),
      membershipType: MEMBERSHIP_TYPE,
      title,
      batchYear: batch,
      firstName,
      middleName: text(payload.middle_name) || null,
      lastName,
      email,
      countryCode,
      mobile: mobile.replace(/[\s-]/g, ""),
      passwordHash: hash,
      passwordSalt: salt,
      shareEmail: payload.share_email === true,
      addressLine1: addr1,
      addressLine2: text(payload.addr2) || null,
      addressLine3: text(payload.addr3) || null,
      city,
      state,
      zip,
      country,
      amount: MEMBERSHIP_FEE,
      currency: "INR",
    });

    const responseUrl = `${baseUrl}/api/membership/payment/response`;
    const checkout = CcAvenue.buildCheckout({
      order_id: application.orderId,
      amount: application.amount.toFixed(2),
      redirect_url: responseUrl,
      cancel_url: responseUrl,
      billing_name: [firstName, application.middleName, lastName].filter(Boolean).join(" "),
      billing_address: [addr1, application.addressLine2, application.addressLine3].filter(Boolean).join(", "),
      billing_city: city,
      billing_state: state,
      billing_zip: zip,
      billing_country: country,
      billing_tel: application.mobile,
      billing_email: email,
      merchant_param1: MEMBERSHIP_TYPE,
    });

    return { ...checkout, orderId: application.orderId };
  }

  /**
   * Applies the result CCAvenue posts back. Safe to call more than once for the same order:
   * a paid application is never changed again.
   */
  async handleGatewayResponse(encResp: string): Promise<MembershipApplication> {
    const response = CcAvenue.parseResponse(encResp);
    const application = response.order_id ? await this.repository.findByOrderId(response.order_id) : null;
    if (!application) throw HttpError.notFound("We could not find this membership order.");
    if (application.status === "paid") return application;

    let status = toPaymentStatus(response.order_status);
    let message = response.failure_message || response.status_message || null;
    if (status === "paid" && Number(response.amount) !== application.amount) {
      console.error(`Membership order ${application.orderId}: paid ${response.amount}, expected ${application.amount}.`);
      status = "failed";
      message = "The amount paid did not match the membership fee.";
    }

    const updated = await this.repository.update(application.id, {
      status,
      trackingId: response.tracking_id || null,
      bankRefNo: response.bank_ref_no || null,
      paymentMode: response.payment_mode || null,
      gatewayStatus: response.order_status || null,
      gatewayMessage: message?.slice(0, 255) ?? null,
      gatewayResponse: response,
      ...(status === "paid" && { paidAt: new Date() }),
    });
    if (!updated) throw HttpError.notFound("We could not find this membership order.");

    if (status !== "paid") return updated;
    const userId = await this.createMember(updated);
    return (await this.repository.update(updated.id, { userId })) ?? updated;
  }

  async getOrderSummary(orderId: string): Promise<MembershipOrderSummary> {
    const application = await this.repository.findByOrderId(orderId.trim());
    if (!application) throw HttpError.notFound("We could not find this membership order.");

    return {
      orderId: application.orderId,
      status: application.status as MembershipPaymentStatus,
      amount: application.amount,
      currency: application.currency,
      membershipType: application.membershipType,
      firstName: application.firstName,
      fullName: [application.title, application.firstName, application.middleName, application.lastName]
        .filter(Boolean)
        .join(" "),
      email: maskEmail(application.email),
      trackingId: gatewayValue(application.trackingId),
      bankRefNo: gatewayValue(application.bankRefNo),
      paymentMode: gatewayValue(application.paymentMode),
      message: gatewayValue(application.gatewayMessage),
      paidAt: application.paidAt,
      updatedAt: application.updatedAt,
    };
  }

  /** Creates the member's account from a paid application, or reuses one already made for the email. */
  private async createMember(application: MembershipApplication): Promise<number> {
    try {
      const user = await this.users.create({
        memberId: `OCA-${application.batchYear}-${String(application.id).padStart(4, "0")}`,
        email: application.email,
        mobile: application.mobile,
        fullName: [application.title, application.firstName, application.middleName, application.lastName]
          .filter(Boolean)
          .join(" "),
        passwordHash: application.passwordHash,
        passwordSalt: application.passwordSalt,
        batchYear: application.batchYear,
        membershipType: application.membershipType,
        role: "member",
        status: NEW_MEMBER_STATUS,
        metadata: {
          membershipApplicationId: application.id,
          countryCode: application.countryCode,
          shareEmail: application.shareEmail,
          address: {
            line1: application.addressLine1,
            line2: application.addressLine2,
            line3: application.addressLine3,
            city: application.city,
            state: application.state,
            zip: application.zip,
            country: application.country,
          },
        },
      });
      return user.id;
    } catch (error) {
      if (!isUniqueViolation(error, "users_email_unique")) throw error;
      const existing = await this.users.findByEmail(application.email);
      if (!existing) throw error;
      return existing.id;
    }
  }
}
