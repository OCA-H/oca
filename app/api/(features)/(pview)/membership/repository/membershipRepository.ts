import "server-only";
import { and, desc, eq, gte, isNull, ne, or } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import {
  membershipApplications,
  type MembershipApplication,
  type NewMembershipApplication,
} from "../schema/membershipSchema";

/** The admin panel shows at most this many applications at once, newest first. */
const ADMIN_LIST_LIMIT = 2000;

export class MembershipRepository extends BaseRepository {
  /** Newest first, optionally only one payment status's. */
  async findAll(filter?: { status?: string }): Promise<MembershipApplication[]> {
    return this.db
      .select()
      .from(membershipApplications)
      .where(filter?.status ? eq(membershipApplications.status, filter.status) : undefined)
      .orderBy(desc(membershipApplications.createdAt), desc(membershipApplications.id))
      .limit(ADMIN_LIST_LIMIT);
  }

  async findByOrderId(orderId: string): Promise<MembershipApplication | null> {
    const results = await this.db
      .select()
      .from(membershipApplications)
      .where(eq(membershipApplications.orderId, orderId))
      .limit(1);

    return results[0] ?? null;
  }

  /** The member's paid membership, newest first if there is more than one. */
  async findPaidByUserId(userId: number): Promise<MembershipApplication | null> {
    const results = await this.db
      .select()
      .from(membershipApplications)
      .where(and(eq(membershipApplications.userId, userId), eq(membershipApplications.status, "paid")))
      .orderBy(desc(membershipApplications.paidAt))
      .limit(1);

    return results[0] ?? null;
  }

  async create(data: NewMembershipApplication): Promise<MembershipApplication> {
    const results = await this.db
      .insert(membershipApplications)
      .values({ ...data, email: data.email.toLowerCase().trim() })
      .returning();

    return results[0];
  }

  async update(id: number, data: Partial<NewMembershipApplication>): Promise<MembershipApplication | null> {
    const results = await this.db
      .update(membershipApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(membershipApplications.id, id))
      .returning();

    return results[0] ?? null;
  }

  /**
   * Records a payment result on an application not yet paid. Returns null when it is already paid,
   * so the redirect and the payment check settling the same order cannot both act on it.
   */
  async updateUnlessPaid(id: number, data: Partial<NewMembershipApplication>): Promise<MembershipApplication | null> {
    const results = await this.db
      .update(membershipApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(membershipApplications.id, id), ne(membershipApplications.status, "paid")))
      .returning();

    return results[0] ?? null;
  }

  /**
   * Applications the payment check looks at: every pending one, unpaid ones created since `since.unpaid`
   * (CCAvenue can still turn them paid), and ones paid since `since.paid`
   * still missing their account or welcome email.
   */
  async findUnsettled(since: { unpaid: Date; paid: Date }, limit: number): Promise<MembershipApplication[]> {
    return this.db
      .select()
      .from(membershipApplications)
      .where(
        or(
          eq(membershipApplications.status, "pending"),
          and(ne(membershipApplications.status, "paid"), gte(membershipApplications.createdAt, since.unpaid)),
          and(
            eq(membershipApplications.status, "paid"),
            gte(membershipApplications.paidAt, since.paid),
            or(isNull(membershipApplications.userId), isNull(membershipApplications.welcomeEmailSentAt))
          )
        )
      )
      .orderBy(desc(membershipApplications.createdAt))
      .limit(limit);
  }

  /**
   * Marks the welcome email as sent, only if it was not already. Returns false when another
   * request got there first, so CCAvenue posting the same result twice sends one email.
   */
  async claimWelcomeEmail(id: number): Promise<boolean> {
    const results = await this.db
      .update(membershipApplications)
      .set({ welcomeEmailSentAt: new Date() })
      .where(and(eq(membershipApplications.id, id), isNull(membershipApplications.welcomeEmailSentAt)))
      .returning({ id: membershipApplications.id });

    return results.length > 0;
  }

  /** Undoes claimWelcomeEmail when the email could not be sent, so a later response can retry it. */
  async releaseWelcomeEmail(id: number): Promise<void> {
    await this.db
      .update(membershipApplications)
      .set({ welcomeEmailSentAt: null })
      .where(eq(membershipApplications.id, id));
  }
}
