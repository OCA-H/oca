// Adds demo members whose birthday is today, so the home page's "Today's Birthdays" has someone to show.
// Development only. Running it again on another day moves their birthdays to that day.
//
//   npm run seed:birthdays              (add or refresh the demo members)
//   npm run seed:birthdays -- --remove  (delete them again)
//
// They use @example.com addresses, so "Send Wishes" opens an email that goes nowhere real,
// and a random password, so nobody can sign in as them.

import crypto from "node:crypto";
import { parseArgs } from "node:util";
import nextEnv from "@next/env";
import pg from "pg";

if (process.env.NODE_ENV === "production") {
  console.error("\n✗ Demo birthdays are for development only; this would add fake members to the live site.\n");
  process.exit(1);
}

const { loadedEnvFiles } = nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error: console.error });
console.log(`Using development settings from: ${loadedEnvFiles.map((f) => f.path).join(", ") || "the environment"}`);

const { values: args } = parseArgs({ options: { remove: { type: "boolean", default: false } } });

/** Every demo member's ID starts with this, so --remove only ever deletes them. */
const MEMBER_ID_PREFIX = "DEMO-BDAY-";

// Born in leap years, so a run on 29 February still gives a real date.
const DEMO_MEMBERS = [
  { firstName: "Rohan", lastName: "Kapoor", batchYear: "1988", born: 1968, house: "Bergin" },
  { firstName: "Sanjay", lastName: "Mehta", batchYear: "1995", born: 1976, house: "Middleton" },
  { firstName: "Arindam", lastName: "Bose", batchYear: "1979", born: 1960, house: "Mulligan" },
  { firstName: "Vivek", lastName: "Trivedi", batchYear: "2002", born: 1984, house: "Bergin" },
  { firstName: "Harsh", lastName: "Khanna", batchYear: "1991", born: 1972, house: "Middleton" },
];

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

/** Same URL as buildDatabaseUrl in app/api/core/databaseConfig.ts. */
function databaseUrl(env = process.env) {
  const missing = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"].filter((key) => !env[key]);
  if (missing.length > 0) fail(`${missing.join(", ")} not set. Add them to .env (see .env.example).`);
  const ssl = env.DB_SSL === "true" ? "?sslmode=require&uselibpqcompat=true" : "";
  return `postgres://${encodeURIComponent(env.DB_USER)}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${encodeURIComponent(env.DB_NAME)}${ssl}`;
}

/** Same scheme as hashPassword in app/api/core/auth.ts, for a password nobody knows. */
function unusablePassword() {
  const salt = crypto.randomBytes(16).toString("hex");
  return { hash: crypto.scryptSync(crypto.randomBytes(32).toString("hex"), salt, 64).toString("hex"), salt };
}

/** Today's month and day in India, as the home page counts birthdays: "10-29". */
const todayInIndia = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).slice(5);

const client = new pg.Client({ connectionString: databaseUrl() });
await client.connect();

try {
  if (args.remove) {
    const { rowCount } = await client.query("DELETE FROM users WHERE member_id LIKE $1", [`${MEMBER_ID_PREFIX}%`]);
    console.log(`\n✓ Removed ${rowCount} demo birthday member(s).\n`);
  } else {
    for (const [index, member] of DEMO_MEMBERS.entries()) {
      const { hash, salt } = unusablePassword();
      const name = { title: "Mr.", firstName: member.firstName, middleName: "", lastName: member.lastName };
      await client.query(
        `INSERT INTO users (member_id, email, full_name, password_hash, password_salt, role, batch_year, date_of_birth, house, status, metadata)
         VALUES ($1, $2, $3, $4, $5, 'member', $6, $7, $8, 'active', $9)
         ON CONFLICT (member_id) DO UPDATE SET date_of_birth = EXCLUDED.date_of_birth, status = 'active', updated_at = now()`,
        [
          `${MEMBER_ID_PREFIX}${index + 1}`,
          `demo.birthday${index + 1}@example.com`,
          `Mr. ${member.firstName} ${member.lastName}`,
          hash,
          salt,
          member.batchYear,
          `${member.born}-${todayInIndia}`,
          member.house,
          { name },
        ]
      );
    }
    console.log(`\n✓ ${DEMO_MEMBERS.length} demo members now have their birthday today (${todayInIndia}).`);
    console.log("  Hard-refresh the home page (Cmd+Shift+R) if it was already open: it caches today’s list for up to an hour.\n");
  }
} catch (error) {
  if (error?.code === "23505") fail("A demo email address is already used by another account.");
  throw error;
} finally {
  await client.end();
}
