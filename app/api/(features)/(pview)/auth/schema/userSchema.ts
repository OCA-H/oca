import { pgTable, serial, varchar, text, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

/** What users.role holds. Admins also get the admin panel (/sv/admin) for editing site content. */
export const USER_ROLES = { member: "member", admin: "admin" } as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    memberId: varchar("member_id", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    mobile: varchar("mobile", { length: 30 }),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: varchar("password_salt", { length: 64 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    batchYear: varchar("batch_year", { length: 20 }),
    house: varchar("house", { length: 50 }),
    membershipType: varchar("membership_type", { length: 50 }).notNull().default("Life Member"),
    status: varchar("status", { length: 30 }).notNull().default("active"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_member_id_unique").on(table.memberId),
    uniqueIndex("users_email_unique").on(table.email),
    index("users_mobile_idx").on(table.mobile),
    index("users_batch_year_idx").on(table.batchYear),
  ]
);

export const user = users;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SafeUser = Omit<User, "passwordHash" | "passwordSalt">;
