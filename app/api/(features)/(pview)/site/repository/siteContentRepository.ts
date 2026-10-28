import "server-only";
import { eq, inArray } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { siteContent, type SiteContentRow } from "../schema/siteContentSchema";

export class SiteContentRepository extends BaseRepository {
  async findByKey(key: string): Promise<SiteContentRow | null> {
    const results = await this.db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
    return results[0] ?? null;
  }

  async findByKeys(keys: string[]): Promise<SiteContentRow[]> {
    if (keys.length === 0) return [];
    return this.db.select().from(siteContent).where(inArray(siteContent.key, keys));
  }

  /** Creates the section's row or replaces its content. */
  async save(key: string, data: Record<string, unknown>, updatedBy: number): Promise<SiteContentRow> {
    const now = new Date();
    const results = await this.db
      .insert(siteContent)
      .values({ key, data, updatedBy, updatedAt: now })
      .onConflictDoUpdate({ target: siteContent.key, set: { data, updatedBy, updatedAt: now } })
      .returning();
    return results[0];
  }
}
