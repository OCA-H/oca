import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import {
  contributionDocuments,
  contributionFunds,
  contributions,
  type ContributionFund,
  type ContributionWithFund,
  type NewContribution,
  type NewContributionDocument,
} from "../schema/contributionSchema";

export class ContributionRepository extends BaseRepository {
  /** Every fund, in the order the form lists them. */
  async listFunds(): Promise<ContributionFund[]> {
    return this.db.select().from(contributionFunds).orderBy(asc(contributionFunds.sortOrder), asc(contributionFunds.id));
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
