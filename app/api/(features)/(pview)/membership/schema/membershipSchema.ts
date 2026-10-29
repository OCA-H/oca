import { pgTable, serial, varchar, integer, boolean, date, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

/**
 * One row per membership checkout. Created as "pending" before the member is sent to CCAvenue,
 * then set to "paid", "failed" or "cancelled" from the gateway's response. A paid row gets a user.
 */
export const membershipApplications = pgTable(
  "membership_applications",
  {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 30 }).notNull(),
    membershipType: varchar("membership_type", { length: 50 }).notNull().default("Life Member"),
    title: varchar("title", { length: 20 }).notNull(),
    batchYear: varchar("batch_year", { length: 20 }).notNull(),
    firstName: varchar("first_name", { length: 80 }).notNull(),
    middleName: varchar("middle_name", { length: 80 }),
    lastName: varchar("last_name", { length: 80 }).notNull(),
    dateOfBirth: date("date_of_birth", { mode: "string" }),
    email: varchar("email", { length: 255 }).notNull(),
    countryCode: varchar("country_code", { length: 8 }).notNull(),
    mobile: varchar("mobile", { length: 20 }).notNull(),
    passwordHash: varchar("password_hash", { length: 128 }).notNull(),
    passwordSalt: varchar("password_salt", { length: 64 }).notNull(),
    shareEmail: boolean("share_email").notNull().default(false),
    addressLine1: varchar("address_line1", { length: 200 }).notNull(),
    addressLine2: varchar("address_line2", { length: 200 }),
    addressLine3: varchar("address_line3", { length: 200 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    zip: varchar("zip", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    trackingId: varchar("tracking_id", { length: 50 }),
    bankRefNo: varchar("bank_ref_no", { length: 100 }),
    paymentMode: varchar("payment_mode", { length: 50 }),
    gatewayStatus: varchar("gateway_status", { length: 30 }),
    gatewayMessage: varchar("gateway_message", { length: 255 }),
    gatewayResponse: jsonb("gateway_response").$type<Record<string, string>>(),
    userId: integer("user_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("membership_applications_order_id_unique").on(table.orderId),
    index("membership_applications_email_idx").on(table.email),
    index("membership_applications_status_idx").on(table.status),
  ]
);

export type MembershipApplication = typeof membershipApplications.$inferSelect;
export type NewMembershipApplication = typeof membershipApplications.$inferInsert;

export type MembershipPaymentStatus = "pending" | "paid" | "failed" | "cancelled";
