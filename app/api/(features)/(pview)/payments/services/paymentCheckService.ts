import "server-only";
import { after } from "next/server";
import { RECHECK_WINDOW_MS, RETRY_EMAIL_WINDOW_MS } from "@/app/api/core/paymentReconciliation";
import { eventPassBookingService } from "@/app/api/(features)/(pview)/event-pass/controller";
import { membershipService } from "@/app/api/(features)/(pview)/membership/controller";
import { contributionService } from "@/app/api/(features)/sv/contribution/controller";

/** Orders taken from each table per run; the oldest left over are picked up by the next run. */
const BATCH = 40;

/** Orders asked about at once, to stay well inside CCAvenue's rate limits. */
const CONCURRENCY = 4;

/** How often traffic to the payment pages may start a check, per server instance. */
const ON_TRAFFIC_EVERY_MS = 5 * 60 * 1000;

export interface PaymentCheckSummary {
  checked: number;
  changed: { orderId: string; from: string; to: string }[];
  errors: number;
}

interface Unsettled {
  orderId: string;
  status: string;
}

/**
 * Settles every order the browser's redirect left unsettled: pending ones CCAvenue has a result for,
 * recent failures CCAvenue later turned into payments, and paid ones whose email (or, for
 * membership, account) is missing. Each order goes through the same code as the redirect, so a
 * payment found here gets its pass, welcome or thank-you email just as if the member had come back.
 */
export class PaymentCheckService {
  private running: Promise<PaymentCheckSummary> | null = null;
  private lastStarted = 0;

  /** Runs a check now, or joins the one already running on this instance. */
  run(baseUrl: string): Promise<PaymentCheckSummary> {
    if (!this.running) {
      this.lastStarted = Date.now();
      this.running = this.sweep(baseUrl).finally(() => {
        this.running = null;
      });
    }
    return this.running;
  }

  /**
   * Starts a check after the current response is sent, at most every few minutes. The scheduled run
   * is the guarantee; this makes payments show up sooner between runs on a busy day.
   */
  runSoon(baseUrl: string): void {
    if (this.running || Date.now() - this.lastStarted < ON_TRAFFIC_EVERY_MS) return;
    this.lastStarted = Date.now();
    after(() =>
      this.run(baseUrl).then(
        (summary) => logChanges(summary),
        (error) => console.error("Payment check failed:", error)
      )
    );
  }

  private async sweep(baseUrl: string): Promise<PaymentCheckSummary> {
    const now = Date.now();
    const since = { unpaid: new Date(now - RECHECK_WINDOW_MS), paid: new Date(now - RETRY_EMAIL_WINDOW_MS) };
    const [bookings, applications, contributions] = await Promise.all([
      eventPassBookingService.findUnsettled(since, BATCH),
      membershipService.findUnsettled(since, BATCH),
      contributionService.findUnsettled(since, BATCH),
    ]);

    const summary: PaymentCheckSummary = { checked: 0, changed: [], errors: 0 };
    const check = <T extends Unsettled>(order: T, reconcile: (order: T) => Promise<Unsettled>) => async () => {
      summary.checked += 1;
      try {
        const settled = await reconcile(order);
        if (settled.status !== order.status) summary.changed.push({ orderId: order.orderId, from: order.status, to: settled.status });
      } catch (error) {
        summary.errors += 1;
        console.error(`Payment check for ${order.orderId} failed:`, error);
      }
    };

    await inBatches(
      [
        ...bookings.map((order) => check(order, (o) => eventPassBookingService.reconcile(o, baseUrl))),
        ...applications.map((order) => check(order, (o) => membershipService.reconcile(o, baseUrl))),
        ...contributions.map((order) => check(order, (o) => contributionService.reconcile(o, baseUrl))),
      ],
      CONCURRENCY
    );
    return summary;
  }
}

/** Runs the tasks `size` at a time. */
async function inBatches(tasks: (() => Promise<void>)[], size: number): Promise<void> {
  for (let i = 0; i < tasks.length; i += size) {
    await Promise.all(tasks.slice(i, i + size).map((task) => task()));
  }
}

export function logChanges(summary: PaymentCheckSummary): void {
  for (const { orderId, from, to } of summary.changed) console.log(`Payment check: ${orderId} ${from} → ${to}.`);
}

export const paymentCheckService = new PaymentCheckService();
