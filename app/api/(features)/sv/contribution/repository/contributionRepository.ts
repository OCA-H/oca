import "server-only";
import { and, asc, count, countDistinct, desc, eq, gte, isNull, ne, or, sum } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import {
  contributionDocuments,
  contributionFunds,
  contributions,
  type ContributionFund,
  type ContributionWithFund,
  type FundProgress,
  type NewContribution,
  type NewContributionFund,
  type NewContributionDocument,
} from "../schema/contributionSchema";

export interface FundTotals {
  fundId: number;
  /** Contributions of any status: a fund with any cannot be deleted. */
  contributions: number;
  paid: number;
  raised: number;
}

/** The admin panel shows at most this many contributions at once, newest first. */
const ADMIN_LIST_LIMIT = 2000;

export class ContributionRepository extends BaseRepository {
  /** Newest first, with their funds, optionally only one payment status's. */
  async findAll(filter?: { status?: string }): Promise<ContributionWithFund[]> {
    const results = await this.db
      .select({ contribution: contributions, fund: contributionFunds })
      .from(contributions)
      .innerJoin(contributionFunds, eq(contributionFunds.id, contributions.fundId))
      .where(filter?.status ? eq(contributions.status, filter.status) : undefined)
      .orderBy(desc(contributions.createdAt), desc(contributions.id))
      .limit(ADMIN_LIST_LIMIT);

    return results.map((row) => ({ ...row.contribution, fund: row.fund }));
  }

  /** Every fund, in the order the form lists them. */
  async listFunds(): Promise<ContributionFund[]> {
    return this.db.select().from(contributionFunds).orderBy(asc(contributionFunds.sortOrder), asc(contributionFunds.id));
  }

  async findFundById(id: number): Promise<ContributionFund | null> {
    const results = await this.db.select().from(contributionFunds).where(eq(contributionFunds.id, id)).limit(1);
    return results[0] ?? null;
  }

  async updateFund(
    id: number,
    data: Partial<Pick<ContributionFund, "label" | "note" | "unitAmount" | "unitLabel" | "maxUnits" | "minAmount" | "maxAmount" | "status" | "sortOrder">>
  ): Promise<ContributionFund | null> {
    const results = await this.db
      .update(contributionFunds)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contributionFunds.id, id))
      .returning();
    return results[0] ?? null;
  }

  async createFund(data: NewContributionFund): Promise<ContributionFund> {
    const results = await this.db.insert(contributionFunds).values(data).returning();
    return results[0];
  }

  async deleteFund(id: number): Promise<boolean> {
    const results = await this.db.delete(contributionFunds).where(eq(contributionFunds.id, id)).returning({ id: contributionFunds.id });
    return results.length > 0;
  }

  /** Per fund: how many contributions it has, how many were paid, and the money raised. */
  async totalsByFund(): Promise<FundTotals[]> {
    const [all, paid] = await Promise.all([
      this.db.select({ fundId: contributions.fundId, n: count() }).from(contributions).groupBy(contributions.fundId),
      this.db
        .select({ fundId: contributions.fundId, n: count(), raised: sum(contributions.amount) })
        .from(contributions)
        .where(eq(contributions.status, "paid"))
        .groupBy(contributions.fundId),
    ]);
    return all.map((row) => {
      const p = paid.find((r) => r.fundId === row.fundId);
      // Postgres returns sums as text.
      return { fundId: row.fundId, contributions: row.n, paid: p?.n ?? 0, raised: Number(p?.raised ?? 0) };
    });
  }

  /** Paid money and distinct paying members per fund, for the home page's progress bars. Funds with none are left out. */
  async paidTotalsByFund(): Promise<FundProgress[]> {
    const rows = await this.db
      .select({
        code: contributionFunds.code,
        label: contributionFunds.label,
        raised: sum(contributions.amount),
        donors: countDistinct(contributions.userId),
      })
      .from(contributionFunds)
      .innerJoin(contributions, and(eq(contributions.fundId, contributionFunds.id), eq(contributions.status, "paid")))
      .groupBy(contributionFunds.id);
    // Postgres returns sums as text.
    return rows.map((row) => ({ ...row, raised: Number(row.raised ?? 0) }));
  }

  async findFundByCode(code: string): Promise<ContributionFund | null> {
    const results = await this.db.select().from(contributionFunds).where(eq(contributionFunds.code, code)).limit(1);
    return results[0] ?? null;
  }

  async findByOrderId(orderId: string): Promise<ContributionWithFund | null> {
    const results = await this.db
      .select({ contribution: contributions, fund: contributionFunds })
      .from(contributions)
      .innerJoin(contributionFunds, eq(contributionFunds.id, contributions.fundId))
      .where(eq(contributions.orderId, orderId))
      .limit(1);

    return results[0] ? { ...results[0].contribution, fund: results[0].fund } : null;
  }

  /** Stores the contribution and its 80G documents together: both are saved, or neither. */
  async create(
    data: NewContribution,
    documents: Omit<NewContributionDocument, "contributionId">[]
  ): Promise<number> {
    return this.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(contributions)
        .values({ ...data, email: data.email.toLowerCase().trim() })
        .returning({ id: contributions.id });
      if (documents.length > 0) {
        await tx.insert(contributionDocuments).values(documents.map((doc) => ({ ...doc, contributionId: created.id })));
      }
      return created.id;
    });
  }

  async update(id: number, data: Partial<NewContribution>): Promise<void> {
    await this.db
      .update(contributions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contributions.id, id));
  }

  /**
   * Records a payment result on a contribution not yet paid. Returns false when it is already paid,
   * so the redirect and the payment check settling the same order cannot both act on it.
   */
  async updateUnlessPaid(id: number, data: Partial<NewContribution>): Promise<boolean> {
    const results = await this.db
      .update(contributions)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(contributions.id, id), ne(contributions.status, "paid")))
      .returning({ id: contributions.id });

    return results.length > 0;
  }

  /**
   * Contributions the payment check looks at: every pending one, unpaid ones created since
   * `since.unpaid` (CCAvenue can still turn them paid), and ones paid since `since.paid` whose
   * thank-you email never went.
   */
  async findUnsettled(since: { unpaid: Date; paid: Date }, limit: number): Promise<ContributionWithFund[]> {
    const results = await this.db
      .select({ contribution: contributions, fund: contributionFunds })
      .from(contributions)
      .innerJoin(contributionFunds, eq(contributionFunds.id, contributions.fundId))
      .where(
        or(
          eq(contributions.status, "pending"),
          and(ne(contributions.status, "paid"), gte(contributions.createdAt, since.unpaid)),
          and(eq(contributions.status, "paid"), gte(contributions.paidAt, since.paid), isNull(contributions.thankYouEmailSentAt))
        )
      )
      .orderBy(desc(contributions.createdAt))
      .limit(limit);

    return results.map((row) => ({ ...row.contribution, fund: row.fund }));
  }

  /**
   * Marks the thank-you email as sent, only if it was not already. Returns false when another
   * request got there first, so CCAvenue posting the same result twice sends one email.
   */
  async claimThankYouEmail(id: number): Promise<boolean> {
    const results = await this.db
      .update(contributions)
      .set({ thankYouEmailSentAt: new Date() })
      .where(and(eq(contributions.id, id), isNull(contributions.thankYouEmailSentAt)))
      .returning({ id: contributions.id });

    return results.length > 0;
  }

  /** Undoes claimThankYouEmail when the email could not be sent, so a later response can retry it. */
  async releaseThankYouEmail(id: number): Promise<void> {
    await this.db.update(contributions).set({ thankYouEmailSentAt: null }).where(eq(contributions.id, id));
  }
}
