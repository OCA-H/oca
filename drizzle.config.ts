// drizzle-kit settings for the npm db:* scripts. Migrations are SQL files in server/db/migrations,
// applied in order and recorded in the __drizzle_migrations table, as Flyway does with its history table.

import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { buildDatabaseUrl, missingDatabaseSettings } from "./app/api/core/databaseConfig";

// Same .env files `next dev` reads, so the DB_* settings only need setting once. loadEnvConfig
// reads .env.production (first, and it wins) unless told this is development, so the production
// database is only used when asked for: NODE_ENV=production npm run db:migrate
const isProduction = process.env.NODE_ENV === "production";
const { loadedEnvFiles } = loadEnvConfig(process.cwd(), !isProduction);
console.log(`Database settings from: ${loadedEnvFiles.map((file) => file.path).join(", ") || "the environment"}`);

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/api/db/schema.ts",
  out: "./app/api/db/migrations",
  // Left empty when settings are missing, so `db:generate` (which needs no database) still runs.
  dbCredentials: { url: missingDatabaseSettings().length > 0 ? "" : buildDatabaseUrl() },
  strict: true,
  verbose: true,
});
