import { pgTable, varchar, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../auth/schema/userSchema";

/**
 * Editable website content, one row per section (key "home.events", "home.hangout", ...).
 * `data` is the section's content in the shape its spec describes (see sectionSpecs.ts).
 * A section with no row shows its built-in defaults, so the site works before anything is saved.
 */
export const siteContent = pgTable("site_content", {
  key: varchar("key", { length: 100 }).primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SiteContentRow = typeof siteContent.$inferSelect;
export type NewSiteContentRow = typeof siteContent.$inferInsert;
