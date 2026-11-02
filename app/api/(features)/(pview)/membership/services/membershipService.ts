import "server-only";
import crypto from "node:crypto";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { hashPassword } from "@/app/api/core/auth";
import { isUniqueViolation } from "@/app/api/core/baseRepository";
import { CcAvenue, type CcAvenueCheckout, type GatewayResult } from "@/app/api/core/ccavenue";
import { isRecheckable, manualPayment, settle } from "@/app/api/core/paymentReconciliation";
import { dateOfBirthError } from "@/app/api/core/dateOfBirth";
import { Mailer } from "@/app/api/core/mailer";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import type { User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";
import { getContactDetails, getMembershipFee, getRegistrationCcEmails } from "@/app/api/(features)/(pview)/site/services/siteContentService";
import { MembershipRepository } from "../repository/membershipRepository";
import type { MembershipApplication, MembershipPaymentStatus } from "../schema/membershipSchema";
import { membershipWelcomeEmail } from "./membershipWelcomeEmail";

// The Life Membership fee is set in the admin panel (Membership → Membership fee) and read with
// getMembershipFee(). It is always charged from there, never from the client.
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
    const dateOfBirth = required("dob", "Date of birth");
    const email = required("email", "Email").toLowerCase();
    const password = typeof payload.password === "string" ? payload.password : "";
    const countryCode = required("country_code", "Country code");
    const mobile = required("mobile", "Mobile");
    const addr1 = required("addr1", "Address line 1");
    const city = required("city", "City");
    const state = required("state", "State");
    const zip = required("zip", "Zip");
    const country = required("country", "Country");

    if (dateOfBirth) {
      const dobError = dateOfBirthError(dateOfBirth);
      if (dobError) fields.dob = dobError;
    }
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
    const fee = await getMembershipFee();
    const application = await this.repository.create({
      orderId: newOrderId(),
      membershipType: MEMBERSHIP_TYPE,
      title,
      batchYear: batch,
      firstName,
      middleName: null,
      lastName,
      dateOfBirth,
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
      amount: fee,
      currency: "INR",
    });

    const responseUrl = `${baseUrl}/api/membership/payment/response`;
    const checkout = CcAvenue.buildCheckout({
      order_id: application.orderId,
      amount: application.amount.toFixed(2),
      redirect_url: responseUrl,
      cancel_url: responseUrl,
      billing_name: [firstName, lastName].filter(Boolean).join(" "),
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

  /** Applies the result CCAvenue posts back to redirect_url. */
  async handleGatewayResponse(encResp: string, baseUrl: string): Promise<MembershipApplication> {
    return this.applyResult(CcAvenue.parseResult(encResp), baseUrl);
  }

  /**
   * Settles an application from CCAvenue's Order Status API, for a member whose browser never came
   * back from the gateway, and finishes a paid one whose account or welcome email is missing.
   * Returns the application as it now stands.
   */
  async reconcile(application: MembershipApplication, baseUrl: string): Promise<MembershipApplication> {
    if (application.status === "paid") return this.completePaid(application, baseUrl);
    const result = settle(application, await CcAvenue.fetchStatus(application.orderId));
    return result ? this.applyResult(result, baseUrl) : application;
  }

  /** Applications for the payment check (see MembershipRepository.findUnsettled). */
  findUnsettled(since: { unpaid: Date; paid: Date }, limit: number): Promise<MembershipApplication[]> {
    return this.repository.findUnsettled(since, limit);
  }

  /**
   * Marks an unpaid order paid on an admin's word, after they found the payment in the CCAvenue
   * dashboard: for when the Order Status API cannot be reached. Goes through the same steps as a
   * payment from CCAvenue, so the member gets the same email.
   */
  async confirmManually(orderId: string, reference: string, confirmedBy: { id: number; name: string }, baseUrl: string): Promise<MembershipApplication> {
    const application = await this.repository.findByOrderId(orderId.trim());
    if (!application) throw HttpError.notFound("We could not find this membership order.");
    if (application.status === "paid") throw HttpError.conflict("This membership is already paid.");
    return this.applyResult(manualPayment(application, reference, confirmedBy), baseUrl);
  }

  /**
   * Applies a payment result, from the redirect or the Order Status API. Safe to call more than once
   * for the same order, from both at the same moment: a paid application is never changed again,
   * and its account and welcome email are made once.
   */
  private async applyResult(result: GatewayResult, baseUrl: string): Promise<MembershipApplication> {
    const application = result.orderId ? await this.repository.findByOrderId(result.orderId) : null;
    if (!application) throw HttpError.notFound("We could not find this membership order.");
    if (application.status === "paid") return this.completePaid(application, baseUrl);

    let status = result.outcome;
    let message = result.message;
    if (status === "paid" && result.amount !== application.amount) {
      console.error(`Membership order ${application.orderId}: paid ${result.amount}, expected ${application.amount}.`);
      status = "failed";
      message = "The amount paid did not match the membership fee.";
    }

    const updated = await this.repository.updateUnlessPaid(application.id, {
      status,
      trackingId: result.trackingId,
      bankRefNo: result.bankRefNo,
      paymentMode: result.paymentMode,
      gatewayStatus: result.gatewayStatus?.slice(0, 30) ?? null,
      gatewayMessage: message?.slice(0, 255) ?? null,
      gatewayResponse: result.raw,
      ...(status === "paid" && { paidAt: new Date() }),
    });
    if (!updated) {
      // Another response marked it paid first and is finishing it.
      return (await this.repository.findByOrderId(application.orderId)) ?? application;
    }
    return status === "paid" ? this.completePaid(updated, baseUrl) : updated;
  }

  /**
   * Makes sure a paid application has its member account and welcome email. Each step is skipped
   * once done, so a step that failed (the email server was down, say) is retried on the next call.
   */
  private async completePaid(application: MembershipApplication, baseUrl: string): Promise<MembershipApplication> {
    if (application.userId && application.welcomeEmailSentAt) return application;
    try {
      let withMember = application;
      let member = application.userId ? await this.users.findById(application.userId) : null;
      if (!member) {
        member = await this.createMember(application);
        withMember = (await this.repository.update(application.id, { userId: member.id })) ?? application;
      }
      await this.sendWelcome(withMember, member, baseUrl);
      return withMember;
    } catch (error) {
      console.error(`Membership ${application.orderId}: paid, but setting up the member failed:`, error);
      return application;
    }
  }

  /**
   * The order as the status page shows it. An unpaid order is checked with CCAvenue first, so a
   * member whose payment went through without the redirect, or whose bank answered late, sees it paid.
   */
  async getOrderSummary(orderId: string, baseUrl: string): Promise<MembershipOrderSummary> {
    let application = await this.repository.findByOrderId(orderId.trim());
    if (!application) throw HttpError.notFound("We could not find this membership order.");
    if (isRecheckable(application)) {
      application = await this.reconcile(application, baseUrl).catch((error) => {
        console.error(`Membership order ${orderId}: CCAvenue status check failed:`, error);
        return application!;
      });
    }

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

  /**
   * Emails the new member their welcome and payment acknowledgement, copying the addresses set
   * under Email settings in the admin panel. A failure is logged, not thrown: the payment and
   * account are already recorded, and the payment check retries it.
   */
  private async sendWelcome(application: MembershipApplication, member: User, baseUrl: string): Promise<void> {
    if (application.welcomeEmailSentAt) return;
    if (!(await this.repository.claimWelcomeEmail(application.id))) return;
    try {
      const [ccEmails, contact] = await Promise.all([getRegistrationCcEmails(), getContactDetails()]);
      const cc = ccEmails.filter((email) => email !== application.email);
      await Mailer.send(membershipWelcomeEmail({ application, memberId: member.memberId, cc, baseUrl, contact }));
    } catch (error) {
      console.error(`Membership ${application.orderId}: welcome email to ${application.email} failed:`, error);
      await this.repository.releaseWelcomeEmail(application.id).catch(() => {});
    }
  }

  /** Creates the member's account from a paid application, or reuses one already made for the email. */
  private async createMember(application: MembershipApplication): Promise<User> {
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
        dateOfBirth: application.dateOfBirth,
        membershipType: application.membershipType,
        role: "member",
        status: NEW_MEMBER_STATUS,
        metadata: {
          membershipApplicationId: application.id,
          // The profile form reads these instead of guessing the parts from fullName.
          name: {
            title: application.title,
            firstName: application.firstName,
            middleName: application.middleName ?? "",
            lastName: application.lastName ?? "",
          },
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
      return user;
    } catch (error) {
      if (!isUniqueViolation(error, "users_email_unique")) throw error;
      const existing = await this.users.findByEmail(application.email);
      if (!existing) throw error;
      return existing;
    }
  }
}
