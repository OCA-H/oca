import "server-only";
import { HttpError } from "./httpError";

// Admin record lists come back a page at a time: ?page=2&pageSize=15&status=pending&q=raj.
// Search and status are applied by the database, so a list never sends more than one page.

export const DEFAULT_PAGE_SIZE = 15;
const MAX_PAGE_SIZE = 50;
const MAX_QUERY = 100;

/** The payment states every payable record can be in. */
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PageRequest {
  page: number;
  pageSize: number;
  offset: number;
  /** A payment status, or undefined for every status. */
  status?: PaymentStatus;
  /** What was searched for, trimmed; undefined when nothing was. */
  query?: string;
}

/** A page of a list, with how many match in all, so the panel can show page links. */
export interface Page<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** How many records are in each payment state, and what the paid ones came to, for a list's summary. */
export interface PaymentSummary {
  all: number;
  counts: Record<PaymentStatus, number>;
  paidAmount: number;
}

/** Reads ?page, ?pageSize, ?status and ?q, rejecting a status that is not one of ours. */
export function readPageRequest(request: Request): PageRequest {
  const params = new URL(request.url).searchParams;
  const whole = (name: string, fallback: number) => {
    const value = Number(params.get(name));
    return Number.isInteger(value) && value > 0 ? value : fallback;
  };
  const page = whole("page", 1);
  const pageSize = Math.min(whole("pageSize", DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);

  const status = params.get("status") || undefined;
  if (status && !(PAYMENT_STATUSES as readonly string[]).includes(status)) throw HttpError.badRequest("Unknown payment status.");
  const query = params.get("q")?.trim().slice(0, MAX_QUERY) || undefined;

  return { page, pageSize, offset: (page - 1) * pageSize, status: status as PaymentStatus | undefined, query };
}

/** An ILIKE pattern matching the text anywhere, with the user's % and _ taken literally. */
export const containsPattern = (text: string) => `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

/** Rows of (status, count, amount) from a GROUP BY status, as a PaymentSummary. */
export function toPaymentSummary(rows: { status: string; count: number; amount: unknown }[]): PaymentSummary {
  const counts: Record<PaymentStatus, number> = { pending: 0, paid: 0, failed: 0, cancelled: 0 };
  let all = 0;
  let paidAmount = 0;
  for (const row of rows) {
    const count = Number(row.count);
    all += count;
    if (row.status in counts) counts[row.status as PaymentStatus] += count;
    // Postgres returns sums as text.
    if (row.status === "paid") paidAmount = Number(row.amount ?? 0);
  }
  return { all, counts, paidAmount };
}
