import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const eventPasses = pgTable(
  "event_passes",
  {
    id: serial("id").primaryKey(),
    eventName: varchar("event_name", { length: 100 }).notNull(),
    passId: varchar("pass_id", { length: 50 }).notNull(),
    tierGroup: varchar("tier_group", { length: 50 }).notNull(),
    tierTitle: varchar("tier_title", { length: 100 }).notNull(),
    title: varchar("title", { length: 150 }).notNull(),
    label: varchar("label", { length: 200 }).notNull(),
    description: text("description"),
    batchEligibility: varchar("batch_eligibility", { length: 100 }),
    price: integer("price").notNull().default(0),
    originalPrice: integer("original_price"),
    currency: varchar("currency", { length: 10 }).notNull().default("INR"),
    totalQuantity: integer("total_quantity"),
    availableQuantity: integer("available_quantity"),
    includesSpouse: boolean("includes_spouse").notNull().default(false),
    allowsChildren: boolean("allows_children").notNull().default(false),
    allowsTeacherSponsorship: boolean("allows_teacher_sponsorship").notNull().default(true),
    status: varchar("status", { length: 30 }).notNull().default("active"),
    statusNote: varchar("status_note", { length: 255 }),
    displayOrder: integer("display_order").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("event_passes_event_pass_id_idx").on(table.eventName, table.passId),
  ]
);

export const eventPass = eventPasses;

export type EventPass = typeof eventPasses.$inferSelect;
export type NewEventPass = typeof eventPasses.$inferInsert;
