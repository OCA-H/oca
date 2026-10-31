import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/app/api/db/schema";
import { buildDatabaseUrl, missingDatabaseSettings } from "./databaseConfig";

export type Orm = NodePgDatabase<typeof schema>;

// Each production instance gets its own pool, and Supabase's pooler caps the total across all of
// them, so keep each one small and hand idle connections back quickly.
const isProduction = process.env.NODE_ENV === "production";
const poolOptions = isProduction ? { max: 3, idleTimeoutMillis: 10_000 } : { max: 10 };

// `next dev` re-runs modules on every edit. Keeping the client on globalThis stops each reload
// from opening a new connection pool.
const cache = globalThis as typeof globalThis & { ocaOrm?: Orm };

export class Database {
  /** Connects on first use, so `next build` works without the DB_* settings. */
  static get orm(): Orm {
    if (!cache.ocaOrm) {
      const missing = missingDatabaseSettings();
      if (missing.length > 0) throw new Error(`${missing.join(", ")} not set. Add them to .env (see .env.example).`);
      cache.ocaOrm = drizzle({ client: new Pool({ connectionString: buildDatabaseUrl(), ...poolOptions }), schema });
    }
    return cache.ocaOrm;
  }
}
