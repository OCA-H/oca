import "server-only";
import crypto from "node:crypto";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { logChanges, paymentCheckService, type PaymentCheckService } from "../services/paymentCheckService";

/** Compares in constant time, so the secret cannot be guessed a character at a time. */
const sameSecret = (given: string, expected: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export class PaymentCheckController extends BaseController {
  constructor(private readonly service: PaymentCheckService) {
    super();
  }

  /**
   * GET /api/payments/check
   * Called on a schedule (vercel.json crons, or any scheduler) with "Authorization: Bearer CRON_SECRET".
   * Settles unsettled orders with CCAvenue and returns what changed.
   */
  async check(request: Request): Promise<Response> {
    return this.handle(async () => {
      const secret = process.env.CRON_SECRET;
      if (!secret) {
        console.error("CRON_SECRET must be set for the scheduled payment check (see .env.example).");
        throw new HttpError(503, "The payment check is not set up.");
      }
      if (!sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
        throw HttpError.unauthorized("Not allowed.");
      }
      const summary = await this.service.run(this.baseUrl(request));
      logChanges(summary);
      return this.ok({ data: summary });
    });
  }

  /** Starts a background check after this request, if one has not run lately (see PaymentCheckService.runSoon). */
  checkSoon(request: Request): void {
    try {
      this.service.runSoon(this.baseUrl(request));
    } catch (error) {
      console.error("Could not start a payment check:", error);
    }
  }
}

export const paymentCheckController = new PaymentCheckController(paymentCheckService);
