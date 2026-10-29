import "server-only";
import { and, asc, eq, or, sql } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { users, type User, type NewUser } from "../schema/userSchema";
import { hashPassword } from "@/app/api/core/auth";

export const DEFAULT_DEMO_USERS: Array<Omit<NewUser, "passwordHash" | "passwordSalt"> & { passwordPlain: string }> = [
  {
    memberId: "OCA-1994-001",
    email: "member@oldcolumban.net",
    mobile: "9810012345",
    fullName: "Vikramjit Singh",
    batchYear: "1994",
    house: "Middleton",
    membershipType: "Life Member",
    role: "member",
    status: "active",
    metadata: {
      designation: "Managing Director",
      city: "New Delhi",
    },
    passwordPlain: "Columban@1994",
  },
  {
    memberId: "columban",
    email: "columban@oldcolumban.net",
    mobile: "9811122334",
    fullName: "Arjun Sen",
    batchYear: "2005",
    house: "Bergin",
    membershipType: "Life Member",
    role: "member",
    status: "active",
    metadata: {
      designation: "Senior Architect",
      city: "Bengaluru",
    },
    passwordPlain: "Columban@2005",
  },
  {
    memberId: "admin",
    email: "admin@oldcolumban.net",
    mobile: "9899988776",
    fullName: "Secretariat Administrator",
    batchYear: "1988",
    house: "Mulligan",
    membershipType: "Honorary Member",
    role: "admin",
    status: "active",
    metadata: {
      designation: "Executive Committee",
      city: "New Delhi",
    },
    passwordPlain: "OcaAdmin@2026",
  },
];

export class UserRepository extends BaseRepository {
  async findById(id: number): Promise<User | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    return results[0] ?? null;
  }

  async findByMemberId(memberId: string): Promise<User | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.memberId, memberId.trim()))
      .limit(1);

    return results[0] ?? null;
  }

  async findByMobile(mobile: string): Promise<User | null> {
    const cleanMobile = mobile.trim();
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.mobile, cleanMobile))
      .limit(1);

    return results[0] ?? null;
  }

  /**
   * Finds user by member ID, email, or mobile number.
   * Matches the member sign-in requirement: "User ID / Email ID / Mobile".
   */
  async findByIdentifier(identifier: string): Promise<User | null> {
    const clean = identifier.trim();
    const cleanLower = clean.toLowerCase();

    const results = await this.db
      .select()
      .from(users)
      .where(
        or(
          eq(users.memberId, clean),
          eq(users.memberId, cleanLower),
          eq(users.email, cleanLower),
          eq(users.mobile, clean)
        )
      )
      .limit(1);

    return results[0] ?? null;
  }

  /** Active members born on any of these days of the year (month 1–12), oldest batch first. */
  async findActiveBornOn(days: Array<{ month: number; day: number }>): Promise<User[]> {
    if (days.length === 0) return [];
    return this.db
      .select()
      .from(users)
      .where(
        and(
          eq(users.status, "active"),
          or(
            ...days.map(
              ({ month, day }) =>
                sql`extract(month from ${users.dateOfBirth}) = ${month}::int and extract(day from ${users.dateOfBirth}) = ${day}::int`
            )
          )
        )
      )
      .orderBy(asc(users.batchYear), asc(users.fullName));
  }

  async create(data: NewUser): Promise<User> {
    const results = await this.db
      .insert(users)
      .values({
        ...data,
        email: data.email.toLowerCase().trim(),
        memberId: data.memberId.trim(),
      })
      .returning();

    return results[0];
  }

  async update(id: number, data: Partial<NewUser>): Promise<User | null> {
    const results = await this.db
      .update(users)
      .set({
        ...data,
        ...(data.email && { email: data.email.toLowerCase().trim() }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return results[0] ?? null;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async count(): Promise<number> {
    const all = await this.db.select().from(users);
    return all.length;
  }

  async seedDefaultUsers(): Promise<User[]> {
    const existing = await this.db.select().from(users).limit(1);
    if (existing.length > 0) {
      return this.db.select().from(users);
    }

    const createdUsers: User[] = [];
    for (const u of DEFAULT_DEMO_USERS) {
      const { passwordPlain, ...userData } = u;
      const { hash, salt } = hashPassword(passwordPlain);

      const created = await this.create({
        ...userData,
        passwordHash: hash,
        passwordSalt: salt,
      });
      createdUsers.push(created);
    }

    return createdUsers;
  }
}
