// Builds the Postgres connection URL from separate DB_* settings, so host, port, credentials and
// database name are maintained one by one in .env rather than as a hand-written URL.
// Shared by the app (database.ts) and drizzle-kit (drizzle.config.ts), so it must not import
// "server-only", which throws outside Next.js.

type Env = Record<string, string | undefined>;

const REQUIRED_SETTINGS = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"] as const;

/** The required DB_* settings that are unset or empty. */
export function missingDatabaseSettings(env: Env = process.env): string[] {
  return REQUIRED_SETTINGS.filter((key) => !env[key]);
}

/** postgres://user:password@host:port/name, with credentials encoded and SSL turned on when DB_SSL=true. */
export function buildDatabaseUrl(env: Env = process.env): string {
  const user = encodeURIComponent(env.DB_USER ?? "");
  const password = encodeURIComponent(env.DB_PASSWORD ?? "");
  const name = encodeURIComponent(env.DB_NAME ?? "");
  // libpq's "require": encrypted, without checking the certificate against a CA. Hosted Postgres
  // such as Supabase signs with its own CA, which node-postgres's stricter "require" rejects.
  const ssl = env.DB_SSL === "true" ? "?sslmode=require&uselibpqcompat=true" : "";
  return `postgres://${user}:${password}@${env.DB_HOST}:${env.DB_PORT}/${name}${ssl}`;
}
