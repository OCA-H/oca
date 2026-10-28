// Creates an OCA admin account, or makes an existing member an admin. Admins see the admin panel
// (/sv/admin) from their profile and can edit the website's content.
//
//   npm run admin:create -- --email secretariat@oldcolumban.net --name "OCA Secretariat"
//   npm run admin:create -- --email member@oldcolumban.net            (promote an existing member)
//   npm run admin:create -- --email member@oldcolumban.net --demote   (back to a plain member)
//
// Options: --email (required), --name, --member-id (defaults to the email), --mobile,
// --password (else ADMIN_PASSWORD, else you are asked; asked is best, it stays out of shell history).
// For an existing account the password only changes when one is given.
// Uses .env (development) by default; NODE_ENV=production npm run admin:create ... for the live site.

import crypto from "node:crypto";
import readline from "node:readline";
import { parseArgs } from "node:util";
import nextEnv from "@next/env";
import pg from "pg";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

// Development settings (.env) unless NODE_ENV=production, as with npm run db:migrate. Without the
// flag, loadEnvConfig would read .env.production first and quietly change the live database.
const isProduction = process.env.NODE_ENV === "production";
const { loadedEnvFiles } = nextEnv.loadEnvConfig(process.cwd(), !isProduction, { info() {}, error: console.error });
console.log(
  `Using ${isProduction ? "PRODUCTION" : "development"} settings from: ${loadedEnvFiles.map((f) => f.path).join(", ") || "the environment"}`
);

const { values: args } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    "member-id": { type: "string" },
    mobile: { type: "string" },
    password: { type: "string" },
    demote: { type: "boolean", default: false },
  },
});

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

/** Same scheme as hashPassword in app/api/core/auth.ts, so the app can verify it. */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return { hash: crypto.scryptSync(password, salt, 64).toString("hex"), salt };
}

/** Same URL as buildDatabaseUrl in app/api/core/databaseConfig.ts. */
function databaseUrl(env = process.env) {
  const missing = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"].filter((key) => !env[key]);
  if (missing.length > 0) fail(`${missing.join(", ")} not set. Add them to .env (see .env.example).`);
  const ssl = env.DB_SSL === "true" ? "?sslmode=require&uselibpqcompat=true" : "";
  return `postgres://${encodeURIComponent(env.DB_USER)}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${encodeURIComponent(env.DB_NAME)}${ssl}`;
}

/** Asks for a password without echoing it. */
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function readPassword({ required }) {
  const given = args.password ?? process.env.ADMIN_PASSWORD;
  if (given !== undefined) return given;
  if (!required || !process.stdin.isTTY) return null;
  const password = await askHidden("Password for the admin account: ");
  if ((await askHidden("Type it again: ")) !== password) fail("The two passwords do not match.");
  return password;
}

function checkPassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) fail(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if (password.length > MAX_PASSWORD_LENGTH) fail(`The password must be at most ${MAX_PASSWORD_LENGTH} characters.`);
}

const email = args.email?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Give the account's email with --email.");
const memberId = args["member-id"]?.trim() || email;

const client = new pg.Client({ connectionString: databaseUrl() });
await client.connect();

try {
  const { rows } = await client.query(
    "SELECT id, member_id, email, full_name, role, status FROM users WHERE email = $1 OR member_id = $2 LIMIT 1",
    [email, memberId]
  );
  const existing = rows[0];

  if (args.demote) {
    if (!existing) fail(`No account uses ${email}.`);
    await client.query("UPDATE users SET role = 'member', updated_at = now() WHERE id = $1", [existing.id]);
    console.log(`\n✓ ${existing.full_name} (${existing.email}) is now a member, without admin access.\n`);
  } else if (existing) {
    const password = await readPassword({ required: false });
    if (password !== null) checkPassword(password);
    const { hash, salt } = password !== null ? hashPassword(password) : {};
    await client.query(
      `UPDATE users SET role = 'admin', updated_at = now()
         ${password !== null ? ", password_hash = $2, password_salt = $3" : ""}
       WHERE id = $1`,
      password !== null ? [existing.id, hash, salt] : [existing.id]
    );
    console.log(`\n✓ ${existing.full_name} (${existing.email}) is now an admin${password !== null ? ", with the new password" : ""}.`);
    if (existing.status !== "active") console.log(`  Note: the account's status is "${existing.status}", so it cannot sign in until it is active.`);
    console.log("  If they are signed in, they need to sign out and in again to see the admin panel.\n");
  } else {
    const name = args.name?.trim();
    if (!name) fail("No account uses that email yet. Give a --name to create one.");
    const password = await readPassword({ required: true });
    if (password === null) fail("Give a password with --password or ADMIN_PASSWORD.");
    checkPassword(password);
    const { hash, salt } = hashPassword(password);
    await client.query(
      `INSERT INTO users (member_id, email, mobile, full_name, password_hash, password_salt, role, membership_type, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'admin', 'Administrator', 'active')`,
      [memberId, email, args.mobile?.trim() || null, name.slice(0, 150), hash, salt]
    );
    console.log(`\n✓ Created admin ${name}. Sign in at /member-signin with ${email} (or "${memberId}").\n`);
  }
} catch (error) {
  if (error?.code === "23505") fail("Another account already uses that member ID or mobile number.");
  throw error;
} finally {
  await client.end();
}
