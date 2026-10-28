import "server-only";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { passwordResetTokens, type PasswordResetToken } from "../schema/passwordResetSchema";
import { users } from "../schema/userSchema";

export class PasswordResetRepository extends BaseRepository {
  /** Replaces any open links for the user with this one. */
  async createForUser(userId: number, tokenHash: string, expiresAt: Date): Promise<PasswordResetToken> {
    return this.db.transaction(async (tx) => {
      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.usedAt)));
      const results = await tx.insert(passwordResetTokens).values({ userId, tokenHash, expiresAt }).returning();
      return results[0];
    });
  }

  async findLatestForUser(userId: number): Promise<PasswordResetToken | null> {
    const results = await this.db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId))
      .orderBy(desc(passwordResetTokens.createdAt))
      .limit(1);

    return results[0] ?? null;
  }

  /** An unspent, unexpired link with this hash, if there is one. */
  async findUsable(tokenHash: string): Promise<PasswordResetToken | null> {
    const results = await this.db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    return results[0] ?? null;
  }

  /**
   * Spends the link and sets the new password together. Returns false if another request spent
   * the link first, in which case nothing changes.
   */
  async consume(token: PasswordResetToken, passwordHash: string, passwordSalt: string): Promise<boolean> {
    return this.db.transaction(async (tx) => {
      const spent = await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(and(eq(passwordResetTokens.id, token.id), isNull(passwordResetTokens.usedAt)))
        .returning({ id: passwordResetTokens.id });
      if (spent.length === 0) return false;

      await tx
        .update(users)
        .set({ passwordHash, passwordSalt, updatedAt: new Date() })
        .where(eq(users.id, token.userId));
      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(and(eq(passwordResetTokens.userId, token.userId), isNull(passwordResetTokens.usedAt)));
      return true;
    });
  }
}
