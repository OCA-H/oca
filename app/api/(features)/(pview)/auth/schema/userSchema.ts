import { pgTable, serial, varchar, text, date, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

/** What users.role holds. Admins also get the admin panel (/sv/admin) for editing site content. */
export const USER_ROLES = { member: "member", admin: "admin" } as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    memberId: varchar("member_id", { length: 50 }).notNull(),
    // Optional: members imported from the old site may have none; they sign in with member ID or mobile.
    email: varchar("email", { length: 255 }),
    // The User ID members signed in with on the old site, lowercased; another way to sign in. Optional.
    username: varchar("username", { length: 100 }),
    mobile: varchar("mobile", { length: 30 }),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: varchar("password_salt", { length: 64 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    batchYear: varchar("batch_year", { length: 20 }),
    dateOfBirth: date("date_of_birth", { mode: "string" }),
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
    uniqueIndex("users_username_unique").on(table.username),
    index("users_mobile_idx").on(table.mobile),
    index("users_batch_year_idx").on(table.batchYear),
  ]
);

export const user = users;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SafeUser = Omit<User, "passwordHash" | "passwordSalt">;
