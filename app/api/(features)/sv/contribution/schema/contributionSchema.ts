import { pgTable, serial, varchar, integer, boolean, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { users } from "../../../(pview)/auth/schema/userSchema";

/**
 * What members can contribute to (Teachers Benevolent Fund, Sponsor a teacher, ...). Seeded by
 * the migration that creates it; the form lists the funds from here and every contribution
 * points at one. A fund with `unit_amount` is paid per unit (e.g. ₹5,000 per teacher sponsored),
 * otherwise the member chooses the amount, between `min_amount` and `max_amount` (set in the
 * admin panel).
 */
export const contributionFunds = pgTable(
  "contribution_funds",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 30 }).notNull(),
    label: varchar("label", { length: 100 }).notNull(),
    note: varchar("note", { length: 100 }),
    unitAmount: integer("unit_amount"),
    unitLabel: varchar("unit_label", { length: 30 }),
    maxUnits: integer("max_units"),
    /** Smallest and largest amount a member may choose on a fund without a unit price, in rupees. */
    minAmount: integer("min_amount").notNull().default(100),
    maxAmount: integer("max_amount").notNull().default(10000000),
    /** "active" or "suspended": a suspended fund is shown but cannot be paid into. */
    status: varchar("status", { length: 20 }).notNull().default("active"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("contribution_funds_code_unique").on(table.code)]
);

/**
 * One row per contribution, made by a signed-in member. Created as "pending" before the member
 * is sent to CCAvenue, then set to "paid", "failed" or "cancelled" from the gateway's response.
 * Donor details are a copy taken at the time, as the receipt must show them as given even if the
 * member's profile changes later. Rows are never deleted with the member or the fund: they are
 * financial records.
 */
export const contributions = pgTable(
  "contributions",
  {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 30 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    fundId: integer("fund_id")
      .notNull()
      .references(() => contributionFunds.id, { onDelete: "restrict" }),
    /** Units bought on a per-unit fund (teachers sponsored); null for a free amount. */
    units: integer("units"),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    donorName: varchar("donor_name", { length: 160 }).notNull(),
    batch: varchar("batch", { length: 20 }),
    email: varchar("email", { length: 255 }).notNull(),
    mobile: varchar("mobile", { length: 20 }).notNull(),
    address: varchar("address", { length: 300 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    pincode: varchar("pincode", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    wants80g: boolean("wants_80g").notNull().default(false),
    pan: varchar("pan", { length: 10 }),
    addressDocNumber: varchar("address_doc_number", { length: 60 }),
    /** The method picked on our form; what was actually used is payment_mode, from CCAvenue. */
    preferredPaymentMethod: varchar("preferred_payment_method", { length: 20 }),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    trackingId: varchar("tracking_id", { length: 50 }),
    bankRefNo: varchar("bank_ref_no", { length: 100 }),
    paymentMode: varchar("payment_mode", { length: 50 }),
    gatewayStatus: varchar("gateway_status", { length: 30 }),
    gatewayMessage: varchar("gateway_message", { length: 255 }),
    gatewayResponse: jsonb("gateway_response").$type<Record<string, string>>(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    thankYouEmailSentAt: timestamp("thank_you_email_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("contributions_order_id_unique").on(table.orderId),
    index("contributions_user_id_idx").on(table.userId),
    index("contributions_fund_id_idx").on(table.fundId),
    index("contributions_status_idx").on(table.status),
  ]
);

/**
 * Documents uploaded for an 80G receipt, one of each kind per contribution. The files live in
 * storage (see core/storage.ts) under contributions/{orderId}/; this records where.
 */
export const contributionDocuments = pgTable(
  "contribution_documents",
  {
    id: serial("id").primaryKey(),
    contributionId: integer("contribution_id")
      .notNull()
      .references(() => contributions.id, { onDelete: "cascade" }),
    /** "pan_card" or "address_proof". */
    kind: varchar("kind", { length: 20 }).notNull(),
    storagePath: varchar("storage_path", { length: 255 }).notNull(),
    contentType: varchar("content_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    originalName: varchar("original_name", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("contribution_documents_contribution_kind_unique").on(table.contributionId, table.kind)]
);

export type ContributionFund = typeof contributionFunds.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;
export type NewContributionDocument = typeof contributionDocuments.$inferInsert;

export type ContributionPaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type ContributionDocumentKind = "pan_card" | "address_proof";

/** A contribution with the fund it went to, as the service and the email need it. */
export type ContributionWithFund = Contribution & { fund: ContributionFund };
