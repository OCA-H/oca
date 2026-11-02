import "server-only";
import crypto from "node:crypto";
import { HttpError } from "./httpError";

// CCAvenue non-seamless checkout: we encrypt the order with the working key, the browser POSTs it
// to CCAvenue, and CCAvenue POSTs an encrypted result back to our redirect_url / cancel_url.
// Encryption is AES-128-CBC with key = md5(working key) and a fixed 0x00..0x0f IV, hex encoded,
// as in CCAvenue's integration kits.

const GATEWAY_URLS = {
  test: "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  production: "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
} as const;

// Order Status API (orderStatusTracker): asks CCAvenue for an order's result server to server, for
// payments whose browser never came back to redirect_url. Enable API access for the access code
// under Settings → API Keys in the CCAvenue dashboard.
const STATUS_API_URLS = {
  test: "https://apitest.ccavenue.com/apis/servlet/DoWebTrans",
  production: "https://api.ccavenue.com/apis/servlet/DoWebTrans",
} as const;

const IV = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

export interface CcAvenueCheckout {
  gatewayUrl: string;
  accessCode: string;
  encRequest: string;
}

/** What a payment came to: the same four states the bookings, applications and contributions store. */
export type GatewayOutcome = "paid" | "failed" | "cancelled" | "pending";

/** A payment result, from the browser's redirect or the Order Status API, in one shape. */
export interface GatewayResult {
  orderId: string;
  outcome: GatewayOutcome;
  amount: number;
  trackingId: string | null;
  bankRefNo: string | null;
  paymentMode: string | null;
  gatewayStatus: string | null;
  message: string | null;
  raw: Record<string, string>;
}

/** order_status on the redirect: Success, Failure, Aborted, Invalid, or Awaited while the bank has not answered. */
const redirectOutcome = (orderStatus: string | undefined): GatewayOutcome => {
  if (orderStatus === "Success") return "paid";
  if (orderStatus === "Aborted") return "cancelled";
  if (orderStatus === "Awaited" || orderStatus === "Initiated") return "pending";
  return "failed";
};

/**
 * order_status from the Order Status API. Shipped is CCAvenue's word for a captured payment.
 * Refunds and chargebacks only ever reach an order we never marked paid, so they count as failed.
 */
const statusApiOutcome = (orderStatus: string): GatewayOutcome => {
  if (orderStatus === "Successful" || orderStatus === "Shipped" || orderStatus === "Success") return "paid";
  if (orderStatus === "Initiated" || orderStatus === "Awaited") return "pending";
  if (orderStatus === "Aborted" || orderStatus === "Cancelled" || orderStatus === "Auto-Cancelled") return "cancelled";
  return "failed";
};

/** order_option_type as the redirect's payment_mode spells it, so both read the same on receipts. */
const PAYMENT_OPTIONS: Record<string, string> = {
  OPTCRDC: "Credit Card",
  OPTDBCRD: "Debit Card",
  OPTNBK: "Net Banking",
  OPTUPI: "Unified Payments",
  OPTWLT: "Wallet",
  OPTCASHC: "Cash Card",
  OPTEMI: "EMI",
  OPTIVRS: "IVRS",
};

/** The Order Status API's error when it has no transaction for the order number. */
const NO_RECORD = /no (record|order|data)|not found|invalid order/i;

export class CcAvenue {
  private static get config() {
    const merchantId = process.env.CCAVENUE_MERCHANT_ID;
    const accessCode = process.env.CCAVENUE_ACCESS_CODE;
    const workingKey = process.env.CCAVENUE_WORKING_KEY;
    if (!merchantId || !accessCode || !workingKey) {
      console.error("CCAVENUE_MERCHANT_ID, CCAVENUE_ACCESS_CODE and CCAVENUE_WORKING_KEY must be set (see .env.example).");
      throw new HttpError(503, "Online payment is not available right now. Please try again later.");
    }
    const env = process.env.CCAVENUE_ENV === "production" ? "production" : "test";
    return { merchantId, accessCode, workingKey, gatewayUrl: GATEWAY_URLS[env], statusApiUrl: STATUS_API_URLS[env] };
  }

  private static key(workingKey: string) {
    return crypto.createHash("md5").update(workingKey).digest();
  }

  static encrypt(plainText: string, workingKey: string): string {
    const cipher = crypto.createCipheriv("aes-128-cbc", this.key(workingKey), IV);
    return cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
  }

  static decrypt(encText: string, workingKey: string): string {
    const decipher = crypto.createDecipheriv("aes-128-cbc", this.key(workingKey), IV);
    return decipher.update(encText, "hex", "utf8") + decipher.final("utf8");
  }

  /** Encrypts an order (order_id, amount, redirect_url, billing_* ...) for the browser to POST to CCAvenue. */
  static buildCheckout(params: Record<string, string>): CcAvenueCheckout {
    const { merchantId, accessCode, workingKey, gatewayUrl } = this.config;
    const plain = new URLSearchParams({ merchant_id: merchantId, currency: "INR", language: "EN", ...params }).toString();
    return { gatewayUrl, accessCode, encRequest: this.encrypt(plain, workingKey) };
  }

  /** Decrypts the encResp CCAvenue posts back into its key/value fields (order_id, order_status, ...). */
  static parseResponse(encResp: string): Record<string, string> {
    const { workingKey } = this.config;
    let plain: string;
    try {
      plain = this.decrypt(encResp, workingKey);
    } catch {
      throw HttpError.badRequest("Could not read the payment gateway response.");
    }
    return Object.fromEntries(new URLSearchParams(plain));
  }

  /** The redirect's encResp as a GatewayResult. */
  static parseResult(encResp: string): GatewayResult {
    const response = this.parseResponse(encResp);
    return {
      orderId: response.order_id ?? "",
      outcome: redirectOutcome(response.order_status),
      amount: Number(response.amount),
      trackingId: response.tracking_id || null,
      bankRefNo: response.bank_ref_no || null,
      paymentMode: response.payment_mode || null,
      gatewayStatus: response.order_status || null,
      message: response.failure_message || response.status_message || null,
      raw: response,
    };
  }

  /**
   * Asks CCAvenue for an order's latest result. Null when CCAvenue has no transaction for it (the
   * member never reached the payment page); throws when CCAvenue cannot be asked, so a failed
   * lookup is never taken to mean an unpaid order.
   */
  static async fetchStatus(orderId: string): Promise<GatewayResult | null> {
    const { accessCode, workingKey, statusApiUrl } = this.config;
    const body = new URLSearchParams({
      enc_request: this.encrypt(JSON.stringify({ order_no: orderId }), workingKey),
      access_code: accessCode,
      command: "orderStatusTracker",
      request_type: "JSON",
      response_type: "JSON",
      version: "1.2",
    });
    const response = await fetch(statusApiUrl, { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`CCAvenue Order Status API answered HTTP ${response.status}.`);

    // "status=0&enc_response=<hex>" on success; status=1 carries a plain-text error instead.
    const reply = new URLSearchParams((await response.text()).trim());
    const encResponse = (reply.get("enc_response") ?? "").trim();
    if (reply.get("status") !== "0") {
      if (NO_RECORD.test(encResponse)) return null;
      throw new Error(`CCAvenue Order Status API refused the request for ${orderId}: ${encResponse || "no reason given"}`);
    }

    const parsed = JSON.parse(this.decrypt(encResponse, workingKey)) as Record<string, unknown>;
    const order = (parsed.Order_Status_Result ?? parsed) as Record<string, unknown>;
    const raw = Object.fromEntries(Object.entries(order).map(([key, value]) => [key, value == null ? "" : String(value)]));
    if (raw.status && raw.status !== "0") {
      const error = raw.error_desc || raw.error_code || "no reason given";
      if (NO_RECORD.test(error)) return null;
      throw new Error(`CCAvenue Order Status API could not read ${orderId}: ${error}`);
    }
    if (!raw.order_status) return null;

    const outcome = statusApiOutcome(raw.order_status);
    return {
      orderId,
      outcome,
      amount: Number(raw.order_amt),
      trackingId: raw.reference_no || null,
      bankRefNo: raw.order_bank_ref_no || null,
      paymentMode: PAYMENT_OPTIONS[raw.order_option_type] ?? (raw.order_option_type || null),
      gatewayStatus: raw.order_status,
      message:
        outcome === "failed" && raw.order_status !== "Unsuccessful"
          ? `CCAvenue reports this payment as ${raw.order_status}.`
          : raw.order_bank_response || null,
      raw,
    };
  }
}
