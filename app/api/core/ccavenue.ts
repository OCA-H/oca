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

const IV = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

export interface CcAvenueCheckout {
  gatewayUrl: string;
  accessCode: string;
  encRequest: string;
}

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
    return { merchantId, accessCode, workingKey, gatewayUrl: GATEWAY_URLS[env] };
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
}
