import "server-only";
import { and, count, desc, eq, gt, ne, sql, sum } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { eventPasses } from "../schema/eventPassSchema";
import {
  eventPassBookings,
  type EventPassBooking,
  type NewEventPassBooking,
} from "../schema/eventPassBookingSchema";

/** The admin panel shows at most this many bookings at once, newest first. */
const ADMIN_LIST_LIMIT = 2000;

export interface PassSales {
  eventPassId: number;
  paid: number;
  revenue: number;
}

export class EventPassBookingRepository extends BaseRepository {
  /** Newest first, optionally only one event's or one status's. */
  async findAll(filter?: { eventName?: string; status?: string }): Promise<EventPassBooking[]> {
    const conditions = [];
    if (filter?.eventName) conditions.push(eq(eventPassBookings.eventName, filter.eventName));
    if (filter?.status) conditions.push(eq(eventPassBookings.status, filter.status));
    return this.db
      .select()
      .from(eventPassBookings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(eventPassBookings.createdAt), desc(eventPassBookings.id))
      .limit(ADMIN_LIST_LIMIT);
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

  async findByOrderId(orderId: string): Promise<EventPassBooking | null> {
    const results = await this.db
      .select()
      .from(eventPassBookings)
      .where(eq(eventPassBookings.orderId, orderId))
      .limit(1);

    return results[0] ?? null;
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
          statusNote: sql`CASE WHEN ${eventPasses.statusNote} ~ '^[0-9]+ left$'
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
}
