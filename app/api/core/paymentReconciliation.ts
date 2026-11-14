import "server-only";
import type { GatewayResult } from "./ccavenue";
import { HttpError } from "./httpError";

// Checking unsettled orders with CCAvenue's Order Status API. The browser's trip back to
// redirect_url is the fast path, but it never arrives when the member closes the tab, pays in a
// UPI app and does not come back, or loses signal; these rules settle those orders from the server.

/** Unpaid orders this recent are checked again: CCAvenue can turn a failed or Awaited payment into a success. */
export const RECHECK_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

/** A paid order's missing email (or member account) is retried for this long after payment. */
export const RETRY_EMAIL_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/** An order still Initiated, or unknown to CCAvenue, this long after checkout was abandoned. */
const ABANDONED_AFTER_MS = 2 * 60 * 60 * 1000;

const NOT_COMPLETED = "The payment was not completed.";

/** The fields every payable record shares. */
export interface PayableOrder {
  orderId: string;
  status: string;
  createdAt: Date;
}

/**
 * An unpaid order an admin closed by hand. The payment check leaves it alone, so it stays rejected;
 * only a payment CCAvenue reports for it (the member did pay) changes it again, to paid.
 */
export const REJECTED = "rejected";

/** True for an unpaid order still worth asking CCAvenue about. */
export const isRecheckable = (order: PayableOrder, now = Date.now()) =>
  order.status === "pending" ||
  (order.status !== "paid" && order.status !== REJECTED && now - order.createdAt.getTime() < RECHECK_WINDOW_MS);

/** Whether a payment result may change an order: a rejected order is reopened only by a payment. */
export const acceptsResult = (order: PayableOrder, result: GatewayResult) => order.status !== REJECTED || result.outcome === "paid";

/**
 * What the Order Status API's answer means for an order, or null to leave it as it is. A payment the
 * bank has not answered (Awaited) stays pending however long it takes; one that never got past the
 * payment page is closed as cancelled once abandoned, and still reopens if CCAvenue later says paid.
 */
export function settle(order: PayableOrder, result: GatewayResult | null, now = Date.now()): GatewayResult | null {
  const abandoned = now - order.createdAt.getTime() > ABANDONED_AFTER_MS;
  const decided =
    result === null
      ? abandoned
        ? notCompleted(order.orderId, null)
        : null
      : result.outcome === "pending"
        ? abandoned && result.gatewayStatus !== "Awaited"
          ? notCompleted(order.orderId, result)
          : null
        : result;
  return decided && decided.outcome !== order.status ? decided : null;
}

function notCompleted(orderId: string, result: GatewayResult | null): GatewayResult {
  return {
    orderId,
    outcome: "cancelled",
    amount: result?.amount ?? 0,
    trackingId: result?.trackingId ?? null,
    bankRefNo: null,
    paymentMode: result?.paymentMode ?? null,
    gatewayStatus: result?.gatewayStatus ?? "Not found",
    message: NOT_COMPLETED,
    raw: result?.raw ?? {},
  };
}

/** CCAvenue reference numbers are digits; letters are allowed for a bank or UPI reference. */
const REFERENCE_PATTERN = /^[A-Za-z0-9-]{4,50}$/;

/**
 * The reference an admin gives when confirming a payment by hand: the CCAvenue reference number
 * (or bank reference) of the payment they found in the CCAvenue dashboard.
 */
export function readManualReference(body: Record<string, unknown>): string {
  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  if (!REFERENCE_PATTERN.test(reference)) {
    throw HttpError.badRequest("Enter the CCAvenue reference number of this payment.", {
      reference: "Enter the CCAvenue reference number (4 to 50 letters or digits) shown for this order in the CCAvenue dashboard.",
    });
  }
  return reference;
}

/**
 * A payment an admin confirmed after finding it in the CCAvenue dashboard, as a GatewayResult, so
 * it is applied by the same code as the gateway's own: the order is marked paid and its email sent.
 */
export function manualPayment(order: { orderId: string; amount: number }, reference: string, confirmedBy: { id: number; name: string }): GatewayResult {
  return {
    orderId: order.orderId,
    outcome: "paid",
    amount: order.amount,
    trackingId: reference,
    bankRefNo: null,
    paymentMode: null,
    gatewayStatus: "Confirmed by admin",
    message: `Confirmed by ${confirmedBy.name} in the admin panel.`,
    raw: {
      confirmed_by: confirmedBy.name,
      confirmed_by_id: String(confirmedBy.id),
      reference_no: reference,
      confirmed_at: new Date().toISOString(),
    },
  };
}

const MAX_REJECT_REASON = 200;

/** The optional reason an admin gives for rejecting an order, trimmed; at most 200 characters. */
export function readRejectReason(body: Record<string, unknown>): string {
  const reason = typeof body.reason === "string" ? body.reason.trim().replace(/\s+/g, " ") : "";
  if (reason.length > MAX_REJECT_REASON) {
    throw HttpError.badRequest("Please shorten the reason.", { reason: `Keep the reason under ${MAX_REJECT_REASON} characters.` });
  }
  return reason;
}

/** What a rejected order's list entry says: who rejected it, and why. Stored as its gateway message. */
export const rejectionNote = (reason: string, by: { name: string }) =>
  (`Rejected by ${by.name}` + (reason ? `: ${reason}` : ".")).slice(0, 255);

/**
 * The error an admin sees when an email they asked to resend did not go: the mail server's own
 * words (e.g. Gmail refusing the password), so the cause can be fixed.
 */
export function emailFailed(to: string, error: unknown): HttpError {
  const detail = error instanceof Error ? error.message.split("\n")[0].slice(0, 200) : "";
  return HttpError.badGateway(`The email to ${to} could not be sent.${detail ? ` The mail server said: ${detail}` : ""}`);
}
