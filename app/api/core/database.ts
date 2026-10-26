import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/app/api/db/schema";
import { buildDatabaseUrl, missingDatabaseSettings } from "./databaseConfig";

export type Orm = NodePgDatabase<typeof schema>;

// `next dev` re-runs modules on every edit. Keeping the client on globalThis stops each reload
// from opening a new connection pool.
const cache = globalThis as typeof globalThis & { ocaOrm?: Orm };

export class Database {
  /** Connects on first use, so `next build` works without the DB_* settings. */
  static get orm(): Orm {
    if (!cache.ocaOrm) {
      const missing = missingDatabaseSettings();
      if (missing.length > 0) throw new Error(`${missing.join(", ")} not set. Add them to .env (see .env.example).`);
      cache.ocaOrm = drizzle({ client: new Pool({ connectionString: buildDatabaseUrl(), max: 10 }), schema });
    }
    return cache.ocaOrm;
  }
}
