import "server-only";
import { and, asc, count, desc, eq, inArray, isNull, like, ne, or, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { containsPattern } from "@/app/api/core/pagination";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { users, STAFF_ROLES, type User, type NewUser } from "@/app/api/(features)/(pview)/auth/schema/userSchema";
import { membershipApplications, type MembershipApplication } from "@/app/api/(features)/(pview)/membership/schema/membershipSchema";
import { eventPassBookings, type EventPassBooking } from "@/app/api/(features)/(pview)/event-pass/schema/eventPassBookingSchema";
import { contributions } from "@/app/api/(features)/sv/contribution/schema/contributionSchema";

/** A paid pass booking with the batch of the member who booked it. */
export type PaidBooking = EventPassBooking & { batchYear: string | null };

/** A paid membership application with the member ID of the account it made, if any. */
export type PaidApplication = MembershipApplication & { accountMemberId: string | null };

/** What a paged member list asks for. Search, filters and sorting run in the database. */
export interface MemberQuery {
  offset: number;
  limit: number;
  batch?: string;
  q?: string;
  /** Only accounts missing this. */
  missing?: "email" | "mobile" | "id";
  /** Only super admins and sub admins. */
  staffOnly?: boolean;
  sort?: "name" | "batch" | "memberId" | "email" | "mobile";
  dir: "asc" | "desc";
}

export interface PassQuery {
  offset: number;
  limit: number;
  batch?: string;
  /** "<event>|<pass label>". */
  type?: string;
  q?: string;
  teachersOnly?: boolean;
  sort?: "id" | "name" | "batch" | "email" | "mobile" | "amount" | "pass" | "orderId";
  dir: "asc" | "desc";
}

const blank = (column: SQL | AnyPgColumn) => or(isNull(column), sql`trim(${column}) = ''`);
/** The name without its title, for sorting: the saved first name, else the full name. */
const nameSort = sql`lower(coalesce(nullif(${users.metadata} #>> '{name,firstName}', ''), ${users.fullName}))`;

/** Reads and writes for the OCA admin console: member accounts and the records hanging off them. */
export class MemberAdminRepository extends BaseRepository {
  /** Every account, newest first, the way the console lists them. */
  async findAllUsers(): Promise<User[]> {
    return this.db.select().from(users).orderBy(desc(users.createdAt), desc(users.id));
  }

  private memberWhere(query: Omit<MemberQuery, "offset" | "limit" | "dir" | "sort">, withBatch = true) {
    const pattern = query.q ? containsPattern(query.q) : null;
    return and(
      withBatch && query.batch ? eq(users.batchYear, query.batch) : undefined,
      pattern
        ? sql`concat_ws(' ', ${users.fullName}, ${users.email}, ${users.mobile}, ${users.memberId}, ${users.batchYear}, ${users.username}) ilike ${pattern}`
        : undefined,
      query.missing === "email" ? blank(users.email) : undefined,
      query.missing === "mobile" ? blank(users.mobile) : undefined,
      query.missing === "id" ? blank(users.memberId) : undefined,
      query.staffOnly ? inArray(users.role, [...STAFF_ROLES]) : undefined
    );
  }

  /** One page of accounts, and how many match in all. */
  async findMembersPage(query: MemberQuery): Promise<{ rows: User[]; total: number }> {
    const where = this.memberWhere(query);
    const by = { name: nameSort, batch: users.batchYear, memberId: users.memberId, email: sql`lower(${users.email})`, mobile: users.mobile }[query.sort ?? "name"];
    const order = query.sort ? (query.dir === "desc" ? sql`${by} desc nulls last` : sql`${by} asc nulls last`) : desc(users.createdAt);
    const [rows, [{ n }]] = await Promise.all([
      this.db.select().from(users).where(where).orderBy(order, desc(users.id)).limit(query.limit).offset(query.offset),
      this.db.select({ n: count() }).from(users).where(where),
    ]);
    return { rows, total: Number(n) };
  }

  /** How many accounts each batch has, for the Batch filter (search and other filters applied, batch not). */
  async memberBatchCounts(query: Omit<MemberQuery, "offset" | "limit" | "dir" | "sort">): Promise<Record<string, number>> {
    const rows = await this.db
      .select({ batch: users.batchYear, n: count() })
      .from(users)
      .where(this.memberWhere(query, false))
      .groupBy(users.batchYear);
    return Object.fromEntries(rows.filter((r) => r.batch).map((r) => [r.batch!, Number(r.n)]));
  }

  async summary() {
    const [[all], [staff]] = await Promise.all([
      this.db.select({ n: count() }).from(users),
      this.db.select({ n: count() }).from(users).where(eq(users.role, "admin")),
    ]);
    return { members: Number(all.n), subAdmins: Number(staff.n) };
  }

  /** Accounts that look like the same person: same email, same mobile digits, or same name and batch. */
  async findDuplicateGroups(maxGroups = 300): Promise<{ label: string; key: string; rows: User[] }[]> {
    const keys: [string, SQL][] = [
      ["Same email", sql`lower(trim(${users.email}))`],
      ["Same mobile", sql`regexp_replace(coalesce(${users.mobile}, ''), '\\D', '', 'g')`],
      ["Same name and batch", sql`lower(regexp_replace(trim(${users.fullName}), '\\s+', ' ', 'g')) || ' · ' || coalesce(${users.batchYear}, '')`],
    ];
    const out: { label: string; key: string; rows: User[] }[] = [];
    for (const [label, expr] of keys) {
      const dupes = this.db
        .select({ k: sql<string>`${expr}`.as("k") })
        .from(users)
        .where(sql`coalesce(${expr}, '') not in ('', ' · ')`)
        .groupBy(expr)
        .having(sql`count(*) > 1`)
        .orderBy(expr)
        .limit(maxGroups)
        .as("dupes");
      const rows = await this.db
        .select({ user: users, k: dupes.k })
        .from(users)
        .innerJoin(dupes, sql`${expr} = ${dupes.k}`)
        .orderBy(dupes.k, asc(users.id));
      const groups = new Map<string, User[]>();
      for (const r of rows) groups.set(r.k, [...(groups.get(r.k) ?? []), r.user]);
      for (const [key, list] of groups) out.push({ label, key, rows: list });
    }
    return out;
  }

  /** Active accounts with a birthday or wedding anniversary on any of these "MM-DD" days. */
  async findOccasions(days: string[]): Promise<User[]> {
    if (!days.length) return [];
    const list = sql.join(days.map((d) => sql`${d}`), sql`, `);
    return this.db
      .select()
      .from(users)
      .where(
        and(
          eq(users.status, "active"),
          or(sql`to_char(${users.dateOfBirth}, 'MM-DD') in (${list})`, sql`substring(${users.metadata} ->> 'anniversary' from 6 for 5) in (${list})`)
        )
      );
  }

  async findUserById(id: number): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findStaff(): Promise<User[]> {
    return this.db.select().from(users).where(inArray(users.role, [...STAFF_ROLES])).orderBy(asc(users.fullName));
  }

  /** Another account (not `exceptId`) already using this email, member ID or mobile. */
  async findClash(field: "email" | "memberId" | "mobile", value: string, exceptId?: number): Promise<User | null> {
    const column = field === "email" ? users.email : field === "memberId" ? users.memberId : users.mobile;
    const rows = await this.db
      .select()
      .from(users)
      .where(and(eq(column, value), exceptId ? ne(users.id, exceptId) : undefined))
      .limit(1);
    return rows[0] ?? null;
  }

  /** Member IDs that start with "<batch>/", so the next "<batch>/NNN" can be worked out. */
  async memberIdsForBatch(batch: string): Promise<string[]> {
    const rows = await this.db.select({ memberId: users.memberId }).from(users).where(like(users.memberId, `${batch}/%`));
    return rows.map((row) => row.memberId);
  }

  async createUser(data: NewUser): Promise<User> {
    const rows = await this.db.insert(users).values(data).returning();
    return rows[0];
  }

  async updateUser(id: number, data: Partial<NewUser>): Promise<User | null> {
    const rows = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async deleteUser(id: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  /** Contributions keep their member (the database refuses to delete an account that has any). */
  async contributionCount(userId: number): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(contributions).where(eq(contributions.userId, userId));
    return Number(row?.n ?? 0);
  }

  private passWhere(query: Omit<PassQuery, "offset" | "limit" | "dir" | "sort">, withBatch = true, withType = true) {
    const pattern = query.q ? containsPattern(query.q) : null;
    return and(
      eq(eventPassBookings.status, "paid"),
      withBatch && query.batch ? eq(users.batchYear, query.batch) : undefined,
      withType && query.type ? sql`${eventPassBookings.eventName} || '|' || ${eventPassBookings.passLabel} = ${query.type}` : undefined,
      query.teachersOnly ? sql`${eventPassBookings.teachers} > 0` : undefined,
      pattern
        ? sql`concat_ws(' ', ${eventPassBookings.fullName}, ${eventPassBookings.email}, ${eventPassBookings.mobile}, ${eventPassBookings.orderId}, ${eventPassBookings.passLabel}, ${eventPassBookings.eventName}, ${eventPassBookings.id}::text) ilike ${pattern}`
        : undefined
    );
  }

  /** One page of paid pass bookings (or every match, when limit is null, for an export). */
  async findPassesPage(query: Omit<PassQuery, "limit"> & { limit: number | null }): Promise<{ rows: PaidBooking[]; total: number }> {
    const where = this.passWhere(query);
    const by = {
      id: eventPassBookings.id, name: sql`lower(${eventPassBookings.fullName})`, batch: users.batchYear, email: sql`lower(${eventPassBookings.email})`,
      mobile: eventPassBookings.mobile, amount: eventPassBookings.amount, pass: sql`lower(${eventPassBookings.passLabel})`, orderId: eventPassBookings.orderId,
    }[query.sort ?? "id"];
    const order = query.sort ? (query.dir === "desc" ? sql`${by} desc nulls last` : sql`${by} asc nulls last`) : desc(eventPassBookings.paidAt);
    const base = this.db
      .select({ booking: eventPassBookings, batchYear: users.batchYear })
      .from(eventPassBookings)
      .leftJoin(users, eq(users.id, eventPassBookings.userId))
      .where(where)
      .orderBy(order, desc(eventPassBookings.id));
    const [rows, [{ n }]] = await Promise.all([
      query.limit === null ? base : base.limit(query.limit).offset(query.offset),
      this.db.select({ n: count() }).from(eventPassBookings).leftJoin(users, eq(users.id, eventPassBookings.userId)).where(where),
    ]);
    return { rows: rows.map((r) => ({ ...r.booking, batchYear: r.batchYear })), total: Number(n) };
  }

  /** Counts for the Donor Pass filters: by batch (type applied) and by pass (batch applied). */
  async passFilterCounts(query: Omit<PassQuery, "offset" | "limit" | "dir" | "sort">) {
    const typeExpr = sql<string>`${eventPassBookings.eventName} || '|' || ${eventPassBookings.passLabel}`;
    const [batches, types] = await Promise.all([
      this.db.select({ k: users.batchYear, n: count() }).from(eventPassBookings).leftJoin(users, eq(users.id, eventPassBookings.userId)).where(this.passWhere(query, false, true)).groupBy(users.batchYear),
      this.db.select({ k: typeExpr, n: count() }).from(eventPassBookings).leftJoin(users, eq(users.id, eventPassBookings.userId)).where(this.passWhere(query, true, false)).groupBy(typeExpr),
    ]);
    return {
      batches: Object.fromEntries(batches.filter((r) => r.k).map((r) => [r.k!, Number(r.n)])),
      types: Object.fromEntries(types.map((r) => [r.k, Number(r.n)])),
    };
  }

  /** Paid pass bookings (the donor passes), newest first. */
  async findPaidBookings(): Promise<PaidBooking[]> {
    const rows = await this.db
      .select({ booking: eventPassBookings, batchYear: users.batchYear })
      .from(eventPassBookings)
      .leftJoin(users, eq(users.id, eventPassBookings.userId))
      .where(eq(eventPassBookings.status, "paid"))
      .orderBy(desc(eventPassBookings.paidAt), desc(eventPassBookings.id));
    return rows.map((row) => ({ ...row.booking, batchYear: row.batchYear }));
  }

  async findAllApplications(): Promise<MembershipApplication[]> {
    return this.db.select().from(membershipApplications).orderBy(desc(membershipApplications.createdAt));
  }

  /** Paid membership applications (the membership receipts), newest first. */
  async findPaidApplications(): Promise<PaidApplication[]> {
    const rows = await this.db
      .select({ application: membershipApplications, accountMemberId: users.memberId })
      .from(membershipApplications)
      .leftJoin(users, eq(users.id, membershipApplications.userId))
      .where(eq(membershipApplications.status, "paid"))
      .orderBy(desc(membershipApplications.paidAt), desc(membershipApplications.id));
    return rows.map((row) => ({ ...row.application, accountMemberId: row.accountMemberId }));
  }

  /** How many rows each export file would have. */
  async exportCounts() {
    const one = async (query: Promise<{ n: number }[]>) => Number((await query)[0]?.n ?? 0);
    const [members, applications, receipts, events, admins] = await Promise.all([
      one(this.db.select({ n: count() }).from(users)),
      one(this.db.select({ n: count() }).from(membershipApplications)),
      one(this.db.select({ n: count() }).from(membershipApplications).where(eq(membershipApplications.status, "paid"))),
      one(this.db.select({ n: count() }).from(eventPassBookings).where(eq(eventPassBookings.status, "paid"))),
      one(this.db.select({ n: count() }).from(users).where(inArray(users.role, [...STAFF_ROLES]))),
    ]);
    return { members, applications, receipts, events, admins };
  }
}

export const memberAdminRepository = new MemberAdminRepository();
