import "server-only";
import { and, count, desc, eq, gt, gte, ilike, isNull, like, ne, or, sql, sum, type SQL } from "drizzle-orm";
import { containsPattern, toPaymentSummary, type PageRequest, type PaymentSummary } from "@/app/api/core/pagination";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { eventPasses } from "../schema/eventPassSchema";
import {
  eventPassBookings,
  type EventPassBooking,
  type NewEventPassBooking,
} from "../schema/eventPassBookingSchema";

export interface PassSales {
  eventPassId: number;
  paid: number;
  revenue: number;
}

/** Bookings for one event (with its past years: "annual-dinner" matches "annual-dinner-2024"), or every event. */
const forEvent = (event?: string): SQL | undefined =>
  event ? or(eq(eventPassBookings.eventName, event), like(eventPassBookings.eventName, `${event}-%`)) : undefined;

/** A booking whose name, member ID, email, mobile or order number contains the query. */
const searching = (query?: string): SQL | undefined => {
  if (!query) return undefined;
  const pattern = containsPattern(query);
  return or(
    ilike(eventPassBookings.fullName, pattern),
    ilike(eventPassBookings.memberId, pattern),
    ilike(eventPassBookings.email, pattern),
    ilike(eventPassBookings.mobile, pattern),
    ilike(eventPassBookings.orderId, pattern)
  );
};

export class EventPassBookingRepository extends BaseRepository {
  /** One page of an event's bookings, newest first, filtered by status and search; with how many match. */
  async findPage(event: string | undefined, request: PageRequest): Promise<{ rows: EventPassBooking[]; total: number }> {
    const where = and(
      forEvent(event),
      request.status ? eq(eventPassBookings.status, request.status) : undefined,
      searching(request.query)
    );
    const [rows, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(eventPassBookings)
        .where(where)
        .orderBy(desc(eventPassBookings.createdAt), desc(eventPassBookings.id))
        .limit(request.pageSize)
        .offset(request.offset),
      this.db.select({ total: count() }).from(eventPassBookings).where(where),
    ]);
    return { rows, total };
  }

  /** An event's bookings counted by payment status, with the money paid and how many were paid after sell-out. */
  async summary(event: string | undefined): Promise<PaymentSummary & { oversold: number }> {
    const rows = await this.db
      .select({
        status: eventPassBookings.status,
        count: count(),
        amount: sum(eventPassBookings.amount),
        oversold: sql<number>`count(*) filter (where ${eventPassBookings.oversold})`.mapWith(Number),
      })
      .from(eventPassBookings)
      .where(forEvent(event))
      .groupBy(eventPassBookings.status);
    return { ...toPaymentSummary(rows), oversold: rows.find((row) => row.status === "paid")?.oversold ?? 0 };
  }

  /** Paid bookings and money taken, per pass. */
  async paidSalesByPass(): Promise<PassSales[]> {
    const rows = await this.db
      .select({ eventPassId: eventPassBookings.eventPassId, paid: count(), revenue: sum(eventPassBookings.amount) })
      .from(eventPassBookings)
      .where(eq(eventPassBookings.status, "paid"))
      .groupBy(eventPassBookings.eventPassId);
    // Postgres returns sums as text.
    return rows.map((row) => ({ eventPassId: row.eventPassId, paid: row.paid, revenue: Number(row.revenue ?? 0) }));
  }

  /** Count of paid bookings for a single pass. */
  async countPaidByPassId(eventPassId: number): Promise<number> {
    const results = await this.db
      .select({ paid: count() })
      .from(eventPassBookings)
      .where(and(eq(eventPassBookings.eventPassId, eventPassId), eq(eventPassBookings.status, "paid")));
    return results[0]?.paid ?? 0;
  }

  async findByOrderId(orderId: string): Promise<EventPassBooking | null> {
    const results = await this.db
      .select()
      .from(eventPassBookings)
      .where(eq(eventPassBookings.orderId, orderId))
      .limit(1);

    return results[0] ?? null;
  }

  /**
   * Bookings the payment check looks at: every pending one, unpaid ones created since `since.unpaid`
   * (CCAvenue can still turn them paid), and ones paid since `since.paid` whose pass was never emailed.
   */
  async findUnsettled(since: { unpaid: Date; paid: Date }, limit: number): Promise<EventPassBooking[]> {
    return this.db
      .select()
      .from(eventPassBookings)
      .where(
        or(
          eq(eventPassBookings.status, "pending"),
          and(ne(eventPassBookings.status, "paid"), gte(eventPassBookings.createdAt, since.unpaid)),
          and(eq(eventPassBookings.status, "paid"), gte(eventPassBookings.paidAt, since.paid), isNull(eventPassBookings.passEmailSentAt))
        )
      )
      .orderBy(desc(eventPassBookings.createdAt))
      .limit(limit);
  }

  async create(data: NewEventPassBooking): Promise<EventPassBooking> {
    const results = await this.db.insert(eventPassBookings).values(data).returning();
    return results[0];
  }

  /** Records a failed or cancelled attempt. Never touches a booking that is already paid. */
  async markUnpaid(id: number, data: Partial<NewEventPassBooking>): Promise<EventPassBooking | null> {
    const results = await this.db
      .update(eventPassBookings)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(eventPassBookings.id, id), ne(eventPassBookings.status, "paid")))
      .returning();

    return results[0] ?? null;
  }

  /**
   * Marks the booking paid and takes one pass out of stock, in one transaction. Only the first call
   * for a booking does anything, so a repeated gateway response cannot sell the same pass twice.
   * Returns null when the booking was already paid.
   */
  async markPaid(id: number, data: Partial<NewEventPassBooking>): Promise<EventPassBooking | null> {
    return this.db.transaction(async (tx) => {
      const [booking] = await tx
        .update(eventPassBookings)
        .set({ ...data, status: "paid", paidAt: new Date(), updatedAt: new Date() })
        .where(and(eq(eventPassBookings.id, id), ne(eventPassBookings.status, "paid")))
        .returning();
      if (!booking) return null;

      const [pass] = await tx
        .select({ availableQuantity: eventPasses.availableQuantity })
        .from(eventPasses)
        .where(eq(eventPasses.id, booking.eventPassId));
      // A null quantity means the pass is not limited.
      if (!pass || pass.availableQuantity === null) return booking;

      // statusNote is shown on the pass card; keep a "N left" note in step with the stock.
      const taken = await tx
        .update(eventPasses)
        .set({
          availableQuantity: sql`${eventPasses.availableQuantity} - 1`,
          statusNote: sql`CASE
            WHEN (${eventPasses.availableQuantity} - 1) <= 0 THEN 'Sold out'
            WHEN ${eventPasses.statusNote} ~ '^[0-9]+ left$' OR ${eventPasses.statusNote} IS NULL
            THEN (${eventPasses.availableQuantity} - 1) || ' left'
            ELSE ${eventPasses.statusNote} END`,
          updatedAt: new Date(),
        })
        .where(and(eq(eventPasses.id, booking.eventPassId), gt(eventPasses.availableQuantity, 0)))
        .returning({ id: eventPasses.id });
      if (taken.length > 0) return booking;

      // Paid for after the last pass went: keep the payment, flag it for the Secretariat.
      const [flagged] = await tx
        .update(eventPassBookings)
        .set({ oversold: true })
        .where(eq(eventPassBookings.id, booking.id))
        .returning();
      return flagged;
    });
  }

  /**
   * Marks the pass email as sent, only if it was not already. Returns false when another request got
   * there first, so the redirect and the payment check settling the same order send one email.
   */
  async claimPassEmail(id: number): Promise<boolean> {
    const results = await this.db
      .update(eventPassBookings)
      .set({ passEmailSentAt: new Date() })
      .where(and(eq(eventPassBookings.id, id), isNull(eventPassBookings.passEmailSentAt)))
      .returning({ id: eventPassBookings.id });

    return results.length > 0;
  }

  /** Undoes claimPassEmail when the email could not be sent, so the payment check retries it. */
  async releasePassEmail(id: number): Promise<void> {
    await this.db.update(eventPassBookings).set({ passEmailSentAt: null }).where(eq(eventPassBookings.id, id));
  }
}
