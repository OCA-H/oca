import "server-only";
import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { CcAvenue, type CcAvenueCheckout } from "@/app/api/core/ccavenue";
import { FILE_KINDS, readUploadedFile, type UploadRules, type UploadedFile } from "@/app/api/core/fileUpload";
import { Mailer } from "@/app/api/core/mailer";
import { getContactDetails, getRegistrationCcEmails } from "@/app/api/(features)/(pview)/site/services/siteContentService";
import { createSignedToken, verifySignedToken, type SessionData } from "@/app/api/core/session";
import { storage } from "@/app/api/core/storage";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import { ContributionRepository } from "../repository/contributionRepository";
import type {
  ContributionDocumentKind,
  ContributionFund,
  ContributionPaymentStatus,
  ContributionWithFund,
  NewContributionDocument,
} from "../schema/contributionSchema";
import { contributionThankYouEmail } from "./contributionThankYouEmail";
import { FUND_PROGRESS_TAG } from "./fundProgress";

const PAYMENT_METHODS = ["upi", "card", "netbanking"];

/** PAN card and address proof for the 80G receipt. Two files fit inside the proxy's 11 MB body limit. */
const DOCUMENTS: { field: string; kind: ContributionDocumentKind; rules: UploadRules }[] = [
  { field: "pan_file", kind: "pan_card", rules: documentRules("PAN card") },
  { field: "address_file", kind: "address_proof", rules: documentRules("address proof") },
];

function documentRules(label: string): UploadRules {
  return { maxBytes: 4 * 1024 * 1024, kinds: [FILE_KINDS.jpeg, FILE_KINDS.png, FILE_KINDS.webp, FILE_KINDS.pdf], label };
}

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** A fund as the contribution form lists it. */
export interface ContributionFundOption {
  code: string;
  label: string;
  note: string | null;
  unitAmount: number | null;
  unitLabel: string | null;
  maxUnits: number | null;
  /** The amount a member may choose, on a fund without a unit price. */
  minAmount: number;
  maxAmount: number;
  suspended: boolean;
}

export interface ContributionCheckout extends CcAvenueCheckout {
  orderId: string;
}

/**
 * The payment result shown on the status page. There is no API that reads contributions back:
 * this travels from CCAvenue's response to the page in a signed token in the URL, holds nothing
 * about the donor beyond which member it belongs to, and the page shows it to that member only.
 */
export interface ContributionResult {
  orderId: string;
  userId: number;
  status: ContributionPaymentStatus;
  amount: number;
  fundLabel: string;
  units: number | null;
  unitLabel: string | null;
  wants80g: boolean;
  trackingId: string | null;
  paymentMode: string | null;
  message: string | null;
  /** ISO time it was paid, or when the attempt was recorded. */
  at: string;
}

export const CONTRIBUTION_RESULT_PURPOSE = "contribution-result";
/** How long the status page link keeps working; afterwards the member still has the email. */
export const CONTRIBUTION_RESULT_TTL_SECONDS = 7 * 24 * 60 * 60;

/** CCAvenue sends the literal "null" for fields it has no value for. */
const gatewayValue = (value: string | null) => (value && value !== "null" ? value : null);

const text = (value: FormDataEntryValue | null) => (typeof value === "string" ? value.trim() : "");

const hasFile = (form: FormData, field: string) => {
  const file = form.get(field);
  return file instanceof File && file.size > 0;
};

/** CCAvenue allows up to 30 alphanumeric characters. */
const newOrderId = () =>
  `OCAC${Date.now().toString(36)}${crypto.randomBytes(5).toString("hex")}`.toUpperCase();

const toPaymentStatus = (orderStatus: string | undefined): ContributionPaymentStatus => {
  if (orderStatus === "Success") return "paid";
  if (orderStatus === "Aborted") return "cancelled";
  return "failed";
};

const toFundOption = (fund: ContributionFund): ContributionFundOption => ({
  code: fund.code,
  label: fund.label,
  note: fund.note,
  unitAmount: fund.unitAmount,
  unitLabel: fund.unitLabel,
  maxUnits: fund.maxUnits,
  minAmount: fund.minAmount,
  maxAmount: fund.maxAmount,
  suspended: fund.status !== "active",
});

/** What the admin panel sets on a contribution head, whether adding it or editing it. */
export type FundFields = Pick<ContributionFund, "label" | "note" | "sortOrder" | "status" | "unitAmount" | "unitLabel" | "maxUnits" | "minAmount" | "maxAmount">;

/**
 * Checks a head's details from the admin panel. A per-unit head (Sponsor a teacher) has a unit
 * price, name and limit, and keeps the amount limits it had (`current`); any other head has
 * amount limits and no unit.
 */
function readFundFields(payload: Record<string, unknown>, perUnit: boolean, current?: ContributionFund): FundFields {
  const fields: FieldErrors = {};
  const words = (key: string, label: string, max: number, required = false): string | null => {
    const value = typeof payload[key] === "string" ? (payload[key] as string).trim() : "";
    if (required && !value) fields[key] = `${label} is required.`;
    else if (value.length > max) fields[key] = `${label} must be ${max} characters or fewer.`;
    return value || null;
  };
  const whole = (key: string, label: string, min: number): number => {
    const value = payload[key];
    const number = typeof value === "number" ? value : Number.NaN;
    if (!Number.isInteger(number) || number < min) fields[key] = `${label} must be a whole number, ${min} or more.`;
    return number;
  };

  const label = words("label", "Name", 100, true);
  const note = words("note", "Note", 100);
  const sortOrder = whole("sortOrder", "Order on the form", 0);
  const status = payload.status;
  if (status !== "active" && status !== "suspended") fields.status = "Choose whether the head is active or inactive.";
  const unitAmount = perUnit ? whole("unitAmount", "Price per unit", 1) : null;
  const unitLabel = perUnit ? words("unitLabel", "What one unit is", 30, true) : null;
  const maxUnits = perUnit ? whole("maxUnits", "Most units at once", 1) : null;
  // A per-unit head never uses amount limits; a new one gets the column defaults.
  const minAmount = perUnit ? (current?.minAmount ?? 100) : whole("minAmount", "Smallest amount", 1);
  const maxAmount = perUnit ? (current?.maxAmount ?? 10000000) : whole("maxAmount", "Largest amount", 1);
  if (!fields.minAmount && !fields.maxAmount && maxAmount < minAmount) {
    fields.maxAmount = "Largest amount must be at least the smallest amount.";
  }
  if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

  return { label: label!, note, sortOrder, status: status as string, unitAmount, unitLabel, maxUnits, minAmount, maxAmount };
}

export class ContributionService {
  constructor(
    private readonly repository: ContributionRepository,
    private readonly users: UserRepository
  ) {}

  /** The funds the form offers, suspended ones included so the form can show them as such. */
  async listFunds(): Promise<ContributionFundOption[]> {
    return (await this.repository.listFunds()).map(toFundOption);
  }

  /**
   * The admin panel's edit of a contribution head: its wording, order, whether it takes
   * contributions, the smallest and largest amount members may give, and for a per-unit fund
   * (Sponsor a teacher) the unit price, name and limit instead.
   */
  async updateFundFromAdmin(id: number, payload: Record<string, unknown>): Promise<ContributionFund> {
    const fund = await this.repository.findFundById(id);
    if (!fund) throw HttpError.notFound("That contribution head no longer exists.");

    // Whether a head is paid per unit is set when it is added, and stays.
    const changes = readFundFields(payload, fund.unitAmount !== null, fund);
    const updated = await this.repository.updateFund(id, changes);
    if (!updated) throw HttpError.notFound("That contribution head no longer exists.");
    return updated;
  }

  /**
   * A new contribution head from the admin panel: the same details as an edit, plus whether
   * members give any amount or pay per unit. Its code (what the form and payments refer to it by)
   * is made from its name, and never changes.
   */
  async createFundFromAdmin(payload: Record<string, unknown>): Promise<ContributionFund> {
    if (payload.kind !== "amount" && payload.kind !== "unit") {
      throw HttpError.badRequest("Some details need fixing.", { kind: "Choose how members give to this head." });
    }
    const data = readFundFields(payload, payload.kind === "unit");

    const existing = await this.repository.listFunds();
    const taken = new Set(existing.map((fund) => fund.code));
    const base = data.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "head";
    let code = base;
    for (let n = 2; taken.has(code); n++) code = `${base}-${n}`;

    return this.repository.createFund({ ...data, code });
  }

  /**
   * Deletes a contribution head that nobody has contributed to. One with contributions is kept:
   * they are financial records and point at it, so it can only be made inactive.
   */
  async deleteFund(id: number): Promise<void> {
    const fund = await this.repository.findFundById(id);
    if (!fund) throw HttpError.notFound("That contribution head no longer exists.");
    const used = (await this.repository.totalsByFund()).find((t) => t.fundId === id)?.contributions ?? 0;
    if (used > 0) {
      throw HttpError.conflict(
        `${fund.label} has ${used} contribution${used === 1 ? "" : "s"} recorded against it, so it cannot be deleted. Make it inactive instead.`
      );
    }
    await this.repository.deleteFund(id);
  }

  /**
   * Validates the contribution form (multipart, for the optional 80G documents), stores it as
   * pending against the signed-in member and returns the encrypted CCAvenue request.
   */
  async checkout(session: SessionData, form: FormData, baseUrl: string): Promise<ContributionCheckout> {
    const user = await this.users.findById(session.user.id);
    if (!user || user.status !== "active") throw HttpError.unauthorized("Please sign in again to contribute.");
    if (!user.email) throw HttpError.badRequest("Please add your email address in My Account first, so we can send your receipt.");
    const accountEmail = user.email;

    const fields: FieldErrors = {};
    const required = (key: string, label: string) => {
      const value = text(form.get(key));
      if (!value) fields[key] = `${label} is required.`;
      return value;
    };

    const fund = await this.repository.findFundByCode(text(form.get("fund")));
    if (!fund) fields.fund = "Choose what you would like to contribute to.";
    else if (fund.status !== "active") fields.fund = `${fund.label} is not accepting contributions right now.`;

    // Amounts are always worked out here: a per-unit fund from its unit price, never the client's.
    let amount = 0;
    let units: number | null = null;
    if (fund?.unitAmount) {
      units = Number(text(form.get("units")));
      const max = fund.maxUnits ?? 1;
      if (!Number.isInteger(units) || units < 1 || units > max) fields.units = `Choose between 1 and ${max}.`;
      else amount = units * fund.unitAmount;
    } else if (fund) {
      amount = Number(text(form.get("amount")));
      if (!Number.isInteger(amount) || amount < fund.minAmount) {
        fields.amount = `Enter a whole amount of at least ₹${fund.minAmount.toLocaleString("en-IN")}.`;
      } else if (amount > fund.maxAmount) {
        fields.amount = `For a contribution this large, please write to the Secretariat at ${(await getContactDetails()).email}.`;
      }
    }

    const name = required("name", "Name");
    // Always the signed-in member's account email, whatever the form sends: the receipt and
    // thank-you go to the member who gave, and the form cannot redirect them elsewhere.
    const email = accountEmail.toLowerCase();
    const mobile = required("mobile", "Mobile").replace(/[\s-]/g, "");
    const address = required("address", "Address");
    const city = required("city", "City");
    const state = required("state", "State");
    const pincode = required("pincode", "Pin code");
    const country = required("country", "Country");

    if (mobile && !/^\+?\d{6,15}$/.test(mobile)) fields.mobile = "Enter a valid mobile number.";
    if (pincode && country === "India" && !/^\d{6}$/.test(pincode)) fields.pincode = "Enter a 6-digit pin code.";

    const wants80g = text(form.get("g80")) === "yes";
    const pan = text(form.get("pan")).toUpperCase();
    if (wants80g && !pan) fields.pan = "PAN is required for an 80G receipt.";
    else if (pan && !PAN_PATTERN.test(pan)) fields.pan = "Enter a valid PAN, e.g. ABCDE1234F.";

    const pay = text(form.get("pay"));

    if (Object.keys(fields).length > 0 || !fund) throw HttpError.badRequest("Some details need fixing.", fields);

    // Documents are only kept when the member asked for 80G. They are all read (and checked)
    // before anything is stored, so a bad file fails the request without leaving an order behind.
    const uploads: { kind: ContributionDocumentKind; file: UploadedFile }[] = [];
    if (wants80g) {
      for (const doc of DOCUMENTS) {
        if (hasFile(form, doc.field)) uploads.push({ kind: doc.kind, file: await readUploadedFile(form, doc.field, doc.rules) });
      }
    }

    const orderId = newOrderId();
    const documents: Omit<NewContributionDocument, "contributionId">[] = [];
    for (const { kind, file } of uploads) {
      const storagePath = `contributions/${orderId}/${kind}.${file.extension}`;
      await storage.upload(storagePath, file.bytes, { contentType: file.contentType, upsert: false });
      documents.push({ kind, storagePath, contentType: file.contentType, sizeBytes: file.size, originalName: file.originalName.slice(0, 255) });
    }

    await this.repository.create(
      {
        orderId,
        userId: user.id,
        fundId: fund.id,
        units,
        amount,
        currency: "INR",
        donorName: name,
        batch: text(form.get("batch")) || user.batchYear || null,
        email,
        mobile,
        address,
        city,
        state,
        pincode,
        country,
        wants80g,
        pan: wants80g ? pan : null,
        addressDocNumber: wants80g ? text(form.get("address_doc")) || null : null,
        preferredPaymentMethod: PAYMENT_METHODS.includes(pay) ? pay : null,
      },
      documents
    );

    const responseUrl = `${baseUrl}/api/sv/contribution/payment/response`;
    const checkout = CcAvenue.buildCheckout({
      order_id: orderId,
      amount: amount.toFixed(2),
      redirect_url: responseUrl,
      cancel_url: responseUrl,
      billing_name: name,
      billing_address: address,
      billing_city: city,
      billing_state: state,
      billing_zip: pincode,
      billing_country: country,
      billing_tel: mobile,
      billing_email: email,
      merchant_param1: "Contribution",
      merchant_param2: fund.label,
      merchant_param3: user.memberId,
    });

    return { ...checkout, orderId };
  }

  /**
   * Applies the result CCAvenue posts back. Safe to call more than once for the same order:
   * a paid contribution is never changed again, and the thank-you email goes out once.
   */
  async handleGatewayResponse(encResp: string, baseUrl: string): Promise<ContributionWithFund> {
    const response = CcAvenue.parseResponse(encResp);
    const contribution = response.order_id ? await this.repository.findByOrderId(response.order_id) : null;
    if (!contribution) throw HttpError.notFound("We could not find this contribution.");
    if (contribution.status === "paid") {
      await this.sendThankYou(contribution, baseUrl);
      return contribution;
    }

    let status = toPaymentStatus(response.order_status);
    let message = response.failure_message || response.status_message || null;
    if (status === "paid" && Number(response.amount) !== contribution.amount) {
      console.error(`Contribution ${contribution.orderId}: paid ${response.amount}, expected ${contribution.amount}.`);
      status = "failed";
      message = "The amount paid did not match the contribution.";
    }

    await this.repository.update(contribution.id, {
      status,
      trackingId: response.tracking_id || null,
      bankRefNo: response.bank_ref_no || null,
      paymentMode: response.payment_mode || null,
      gatewayStatus: response.order_status || null,
      gatewayMessage: message?.slice(0, 255) ?? null,
      gatewayResponse: response,
      ...(status === "paid" && { paidAt: new Date() }),
    });
    const updated = await this.repository.findByOrderId(contribution.orderId);
    if (!updated) throw HttpError.notFound("We could not find this contribution.");

    if (status === "paid") {
      // The home page's progress bars count paid contributions; expire: 0 shows this one on the next visit.
      revalidateTag(FUND_PROGRESS_TAG, { expire: 0 });
      await this.sendThankYou(updated, baseUrl);
    }
    return updated;
  }

  /** The signed result the status page shows (see ContributionResult). */
  async resultToken(contribution: ContributionWithFund): Promise<string> {
    const result: ContributionResult = {
      orderId: contribution.orderId,
      userId: contribution.userId,
      status: contribution.status as ContributionPaymentStatus,
      amount: contribution.amount,
      fundLabel: contribution.fund.label,
      units: contribution.units,
      unitLabel: contribution.fund.unitLabel,
      wants80g: contribution.wants80g,
      trackingId: gatewayValue(contribution.trackingId),
      paymentMode: gatewayValue(contribution.paymentMode),
      message: gatewayValue(contribution.gatewayMessage),
      at: (contribution.paidAt ?? contribution.updatedAt).toISOString(),
    };
    return createSignedToken(CONTRIBUTION_RESULT_PURPOSE, result, CONTRIBUTION_RESULT_TTL_SECONDS);
  }

  /** Reads a result token back for the member it belongs to; null if altered, expired or someone else's. */
  static async readResult(token: string, userId: number): Promise<ContributionResult | null> {
    const result = await verifySignedToken<ContributionResult>(CONTRIBUTION_RESULT_PURPOSE, token);
    return result && result.userId === userId ? result : null;
  }

  /**
   * Emails the member their thank-you and payment acknowledgement, copying the addresses set under
   * Email settings in the admin panel. A failure is logged, not thrown:
   * the payment is already recorded, and the next response from CCAvenue for the order retries it.
   */
  private async sendThankYou(contribution: ContributionWithFund, baseUrl: string): Promise<void> {
    if (contribution.thankYouEmailSentAt) return;
    if (!(await this.repository.claimThankYouEmail(contribution.id))) return;
    try {
      const [ccEmails, contact] = await Promise.all([getRegistrationCcEmails(), getContactDetails()]);
      const cc = ccEmails.filter((email) => email !== contribution.email);
      await Mailer.send(contributionThankYouEmail(contribution, baseUrl, cc, contact));
    } catch (error) {
      console.error(`Contribution ${contribution.orderId}: thank-you email to ${contribution.email} failed:`, error);
      await this.repository.releaseThankYouEmail(contribution.id).catch(() => {});
    }
  }
}
