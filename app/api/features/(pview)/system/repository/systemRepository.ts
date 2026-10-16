import "server-only";
import { sql } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";

export interface DatabaseStatus {
  connected: boolean;
  databaseName: string;
  latencyMs?: number;
  error?: string;
}

export class SystemRepository extends BaseRepository {
  async checkConnection(): Promise<DatabaseStatus> {
    const fallbackDbName = this.extractDatabaseName(process.env.DATABASE_URL);
    const start = performance.now();

    try {
      const result = await this.db.execute<{ db_name: string }>(
        sql`SELECT current_database() AS db_name`
      );
      const rows = result as unknown as Array<{ db_name?: string }>;
      const databaseName = rows[0]?.db_name || fallbackDbName;

      return {
        connected: true,
        databaseName,
        latencyMs: Math.round(performance.now() - start),
      };
    } catch (error) {
      return {
        connected: false,
        databaseName: fallbackDbName,
        error: error instanceof Error ? error.message : "Unable to reach database",
      };
    }
  }

  private extractDatabaseName(url?: string): string {
    if (!url) return "not_set";
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/^\//, "") || "unknown";
    } catch {
      return "unknown";
    }
  }
}
