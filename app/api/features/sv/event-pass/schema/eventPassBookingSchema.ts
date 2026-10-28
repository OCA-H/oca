import { pgTable, serial, varchar, integer, boolean, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

export interface BookingLineItem {
  label: string;
  amount: number;
}

/**
 * One row per pass checkout. Created as "pending" before the member is sent to CCAvenue, then set
 * to "paid", "failed" or "cancelled" from the gateway's response. Prices are copied from
 * event_passes at checkout, so later price changes never alter a booking.
 */
export const eventPassBookings = pgTable(
  "event_pass_bookings",
  {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 30 }).notNull(),
    eventName: varchar("event_name", { length: 100 }).notNull(),
    eventPassId: integer("event_pass_id").notNull(),
    passId: varchar("pass_id", { length: 50 }).notNull(),
    passLabel: varchar("pass_label", { length: 200 }).notNull(),
    userId: integer("user_id").notNull(),
    memberId: varchar("member_id", { length: 50 }).notNull(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    mobile: varchar("mobile", { length: 30 }),
    spouseName: varchar("spouse_name", { length: 150 }),
    teachers: integer("teachers").notNull().default(0),
    childrenUnder12: integer("children_under12").notNull().default(0),
    childrenAbove12: integer("children_above12").notNull().default(0),
    lineItems: jsonb("line_items").$type<BookingLineItem[]>().notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    trackingId: varchar("tracking_id", { length: 50 }),
    bankRefNo: varchar("bank_ref_no", { length: 100 }),
    paymentMode: varchar("payment_mode", { length: 50 }),
    gatewayStatus: varchar("gateway_status", { length: 30 }),
    gatewayMessage: varchar("gateway_message", { length: 255 }),
    gatewayResponse: jsonb("gateway_response").$type<Record<string, string>>(),
    /** True when the booking was paid after the last pass had already gone; the Secretariat must follow up. */
    oversold: boolean("oversold").notNull().default(false),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("event_pass_bookings_order_id_unique").on(table.orderId),
    index("event_pass_bookings_user_id_idx").on(table.userId),
    index("event_pass_bookings_status_idx").on(table.status),
    index("event_pass_bookings_event_pass_idx").on(table.eventName, table.passId),
  ]
);

export type EventPassBooking = typeof eventPassBookings.$inferSelect;
export type NewEventPassBooking = typeof eventPassBookings.$inferInsert;

export type EventPassPaymentStatus = "pending" | "paid" | "failed" | "cancelled";
