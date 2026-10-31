// Moves the old site's data (the PHP membership app and WordPress, from the phpMyAdmin export) into
// this app's tables. Without --apply it only writes CSV files for review; nothing touches a database.
//
//   npm run legacy:import                                   (dry run: writes .migration/output/)
//   npm run legacy:import -- --apply                        (imports into the development database)
//   NODE_ENV=production npm run legacy:import -- --apply --confirm-production
//
// Options:
//   --dump <path>            the export to read (default .migration/localhost.sql.gz)
//   --out <dir>              where the CSV files go (default .migration/output)
//   --skip-missing-email     on --apply, leave out members with no usable email instead of stopping
//   --rollback               on --apply, run the whole import and then undo it: checks it against the real schema
//
// Output:
//   clean/    the rows exactly as they will be imported (passwords are never written anywhere)
//   issues/   one file per kind of problem, for the secretariat to fix; every row names its source row
//   archive/  old data the app has no place for yet (business directory, internships, unpaid attempts...)
//   summary.md
//
// Safe to run again: every imported row carries its old ID (users.metadata.legacy, LEGACY-* order IDs),
// and rows already imported are left alone.

import crypto from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, promisify } from "node:util";
import nextEnv from "@next/env";
import pg from "pg";
import * as clean from "./clean.mjs";
import { readTables } from "./sql-dump.mjs";

const { values: args } = parseArgs({
  options: {
    dump: { type: "string", default: ".migration/localhost.sql.gz" },
    out: { type: "string", default: ".migration/output" },
    apply: { type: "boolean", default: false },
    "confirm-production": { type: "boolean", default: false },
    "skip-missing-email": { type: "boolean", default: false },
    rollback: { type: "boolean", default: false },
  },
});

const MEMBERS_DB = "oldcovm6_digioca";
const WORDPRESS_DB = "oldcovm6_website2022";
const OLD_SITE = "https://www.oldcolumban.net";
/** Passwords the old admin panel handed out, like "OCA@1985_1234". Anyone who knows the pattern can guess them. */
const DEFAULT_PASSWORD = /^[A-Z]{3}@\d{4}_\d{3,4}$/;
const THIS_YEAR = new Date().getFullYear();

// ─── Output files ───────────────────────────────────────────────────────────────────────────────

const files = { clean: {}, issues: {}, archive: {} };

/** Adds a row to an output file; files are written at the end. */
function record(folder, name, row) {
  (files[folder][name] ??= []).push(row);
}

/** Records a problem with one source row. `kept` says what the import did about it. */
function issue(name, source, problem, kept, details = {}) {
  record("issues", name, { source, problem, action: kept, ...details });
}

function toCsv(rows) {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const cell = (value) => {
    if (value === null || value === undefined) return "";
    const s = value instanceof Date ? value.toISOString() : typeof value === "object" ? JSON.stringify(value) : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((row) => columns.map((c) => cell(row[c])).join(","))].join("\n") + "\n";
}

/** Copies an old table into archive/, minus anything that looks like a password. */
function archiveTable(name, rows, transform = (row) => row) {
  for (const row of rows) {
    const copy = { ...transform(row) };
    for (const key of Object.keys(copy)) if (/pass(word)?$|^password/i.test(key) && !/^passid$/i.test(key)) delete copy[key];
    record("archive", name, copy);
  }
}

// ─── Read the dump ──────────────────────────────────────────────────────────────────────────────

console.log(`Reading ${args.dump} ...`);
const old = await readTables(args.dump, MEMBERS_DB, [
  "ocamembers_info", "apply_ocamembers_info", "profile_image", "donation", "donoruser", "donorpass", "donorpass_member",
  "dinner", "receipt_number", "business_info", "ocamember_business", "internship_info", "internship_more", "internship_apply",
  "ocamember_internship", "corporate_access", "coupons", "events_reg", "suggtn_box",
]);
const wp = await readTables(args.dump, WORDPRESS_DB, ["wp_users", "wp_cf7dbplugin_submits"]);

// ─── Members → users ────────────────────────────────────────────────────────────────────────────

const photoByEmail = new Map(old.profile_image.map((p) => [clean.email(p.email), clean.text(p.url)]).filter(([e, u]) => e && u));

/** Each old member as a users row, plus the plain-text password (kept in memory only, for hashing). */
const members = [];
for (const r of [...old.ocamembers_info].sort((a, b) => a.ID - b.ID)) {
  const source = `ocamembers_info#${r.ID}`;
  const name = {
    title: clean.text(r.Title),
    firstName: clean.text(r.FirstName),
    middleName: clean.text(r.FamilyName),
    lastName: clean.text(r.LastName),
  };
  if (!name.firstName && !name.lastName) {
    issue("members-not-imported", source, "No name at all", "not imported", { batch: r.Batch, ocaId: r.oca_id });
    continue;
  }

  const rawEmail = clean.text(r.OfficeEmail);
  const email = clean.email(rawEmail) ?? clean.email(r.UserId);
  if (rawEmail && !clean.email(rawEmail)) issue("members-invalid-email", source, "Email is not a valid address", email ? "used the User ID email instead" : "imported without email", { rawEmail });

  const batchYear = clean.batch(r.Batch);
  if (!batchYear) issue("members-invalid-batch", source, "Batch year is missing or impossible", "imported without batch", { rawBatch: r.Batch });

  const dateOfBirth = clean.date(r.BirthDate, { maxYear: THIS_YEAR - 10 });
  if (clean.text(r.BirthDate) && !dateOfBirth) issue("members-invalid-birth-date", source, "Birth date is not a real date", "imported without birth date", { rawBirthDate: r.BirthDate });

  const phone = clean.mobile([
    [r.OfficePhone3, r.countrycode3],
    [r.ResPhoneNum2, r.countrycode2],
    [r.ResPhoneNum1, r.countrycode1],
    [r.OfficePhone1, ""],
    [r.OfficePhone2, ""],
  ]);

  const password = String(r.Password ?? "");
  const mustReset = !password.trim() || DEFAULT_PASSWORD.test(password);
  const photo = email ? photoByEmail.get(email) : null;

  members.push({
    legacyId: r.ID,
    source,
    ocaId: clean.text(r.oca_id),
    email,
    mobile: phone?.mobile ?? null,
    fullName: [name.title, name.firstName, name.middleName, name.lastName].filter(Boolean).join(" ").slice(0, 150),
    batchYear,
    dateOfBirth,
    membershipType: clean.membershipType(r.OfficeMember),
    password,
    mustReset,
    lastActivity: clean.timestamp(r.Last_Update) ?? clean.timestamp(r.pay_date),
    nameKey: clean.nameKey(name.firstName, name.lastName),
    metadata: {
      name,
      countryCode: phone?.countryCode ?? "+91",
      address: {
        line1: clean.text(r.Address1), line2: clean.text(r.Address2), line3: clean.text(r.Address3),
        city: clean.text(r.City), state: clean.text(r.State), zip: clean.text(r.ResZip), country: clean.text(r.Country),
      },
      spouseName: clean.text(r.WifeName) || undefined,
      anniversary: clean.date(r.WeddingDate) ?? undefined,
      office: {
        organisation: clean.text(r.Organisation), designation: clean.text(r.Designation), industry: clean.text(r.industryname),
        line1: clean.text(r.OfficeAddress1), line2: clean.text(r.OfficeAddress2), line3: clean.text(r.OfficeAddress3),
        city: clean.text(r.OfficeCity), state: clean.text(r.OfficeState), zip: clean.text(r.OfficeZip), country: clean.text(r.OfficeCountry),
        phones: [r.OfficePhone1, r.OfficePhone2, r.OfficeFax].map(clean.text).filter(Boolean),
      },
      legacy: {
        source: "oldcolumban.net membership app",
        id: r.ID,
        ocaId: clean.text(r.oca_id) || undefined,
        username: clean.text(r.UserId) || undefined,
        appliedOn: clean.text(r.apply_date) || undefined,
        remark: clean.text(r.Remark) || undefined,
        photoUrl: photo ? `${OLD_SITE}/user/${photo}` : undefined,
        mustResetPassword: mustReset || undefined,
      },
    },
  });
}

/** Within each group of members sharing a value, picks who keeps it: real OCA ID first, then most recent activity, then oldest record. */
function resolveDuplicates(field, keyOf, onLoser) {
  const groups = new Map();
  for (const m of members) {
    const key = keyOf(m);
    if (key) groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    group.sort((a, b) => Number(Boolean(b.ocaId)) - Number(Boolean(a.ocaId)) || (b.lastActivity ?? 0) - (a.lastActivity ?? 0) || a.legacyId - b.legacyId);
    for (const loser of group.slice(1)) onLoser(loser, group[0]);
  }
}

// Member IDs: the old OCA ID ("1985/123"), or a new one when it is missing, too long or taken.
const duplicateOcaIds = new Set();
resolveDuplicates("memberId", (m) => m.ocaId, (loser, winner) => {
  issue("members-duplicate-member-id", loser.source, `OCA ID ${loser.ocaId} is also used by ${winner.source}`, `given OCA-LEGACY-${loser.legacyId}`, { ocaId: loser.ocaId, keptBy: winner.source, name: loser.fullName });
  duplicateOcaIds.add(loser);
});
for (const m of members) {
  if (m.ocaId && m.ocaId.length <= 50 && !duplicateOcaIds.has(m)) m.memberId = m.ocaId;
  else {
    m.memberId = `OCA-LEGACY-${m.legacyId}`;
    if (!duplicateOcaIds.has(m)) issue("members-missing-member-id", m.source, m.ocaId ? "OCA ID is longer than 50 characters" : "No OCA ID in the old system", `given ${m.memberId}`, { ocaId: m.ocaId, name: m.fullName, batch: m.batchYear });
  }
}

resolveDuplicates("email", (m) => m.email, (loser, winner) => {
  issue("members-duplicate-email", loser.source, `Email also used by ${winner.memberId} (${winner.fullName})`, "imported without email", { email: loser.email, memberId: loser.memberId, name: loser.fullName, keptBy: winner.memberId });
  loser.email = null;
});
resolveDuplicates("mobile", (m) => m.mobile, (loser, winner) => {
  issue("members-duplicate-mobile", loser.source, `Mobile also used by ${winner.memberId} (${winner.fullName})`, "imported without mobile", { mobile: loser.mobile, memberId: loser.memberId, name: loser.fullName, keptBy: winner.memberId });
  loser.mobile = null;
});

for (const m of members) {
  const contact = { memberId: m.memberId, name: m.fullName, batch: m.batchYear, mobile: m.mobile, username: m.metadata.legacy.username };
  if (!m.email) issue("members-missing-email", m.source, "No usable email: cannot receive password resets or receipts", "imported without email", contact);
  if (m.mustReset) {
    issue("members-password-reset-needed", m.source, "Old password was a guessable default (or empty), so it is not carried over",
      m.email ? "must use Forgot password" : "cannot sign in until an email is added", { ...contact, email: m.email });
  }
  if (m.metadata.legacy.photoUrl) record("archive", "profile-photos-to-copy", { memberId: m.memberId, url: m.metadata.legacy.photoUrl });
  record("clean", "users", {
    member_id: m.memberId, email: m.email, mobile: m.mobile, country_code: m.metadata.countryCode, full_name: m.fullName,
    batch_year: m.batchYear, date_of_birth: m.dateOfBirth, membership_type: m.membershipType, status: "active",
    password: m.mustReset ? "reset required" : "kept (hashed on import)", legacy_id: m.legacyId,
  });
}

// ─── Matching payers to members ─────────────────────────────────────────────────────────────────

const byLegacyId = new Map(members.map((m) => [m.legacyId, m]));
const byEmail = new Map(members.filter((m) => m.email).map((m) => [m.email, m]));
const byNameBatch = new Map();
for (const m of members) {
  const key = `${m.nameKey}|${m.batchYear}`;
  byNameBatch.set(key, byNameBatch.has(key) ? null : m); // null marks two members with the same name and batch
}

/** The member who made a payment: by old member ID, then email, then a unique name + batch. */
function findMember({ memberId, emails, firstName, lastName, batch }) {
  if (memberId > 0 && byLegacyId.has(memberId)) return { member: byLegacyId.get(memberId), how: "member ID" };
  for (const e of emails.map(clean.email).filter(Boolean)) if (byEmail.has(e)) return { member: byEmail.get(e), how: "email" };
  const named = byNameBatch.get(`${clean.nameKey(firstName, lastName)}|${clean.batch(batch)}`);
  if (named) return { member: named, how: "name and batch" };
  return { member: null, how: null };
}

const legacyGateway = (fields) => Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, clean.text(v)]).filter(([, v]) => v));

// ─── Membership fees → membership_applications ──────────────────────────────────────────────────

const membershipPayments = [];
function addMembershipPayment(orderId, member, { amount, paidAt, gateway, source }) {
  if (!amount) issue("payments-missing-amount", source, "Marked paid but no amount recorded", "imported with amount 0", { memberId: member.memberId, orderId });
  membershipPayments.push({ orderId, member, amount: amount ?? 0, paidAt, gateway, source });
}

for (const r of old.ocamembers_info) {
  const member = byLegacyId.get(r.ID);
  const receipt = clean.text(r.pay_receipt);
  if (!member || !(clean.isPaid(r.pay_status) || receipt)) continue;
  addMembershipPayment(`LEGACY-M-${r.ID}`, member, {
    amount: clean.rupees(r.pay_amount),
    paidAt: clean.timestamp(r.pay_date),
    gateway: legacyGateway({ receipt, orderId: r.pay_orderid, status: r.pay_status, message: r.pay_message }),
    source: `ocamembers_info#${r.ID}`,
  });
}

for (const r of old.apply_ocamembers_info) {
  const source = `apply_ocamembers_info#${r.ID}`;
  if (!clean.isPaid(r.payment_status)) {
    archiveTable("membership-applications-not-paid", [r], (row) => ({ ...row, payment: clean.paymentState(row.payment_status) }));
    continue;
  }
  const { member, how } = findMember({ memberId: 0, emails: [r.OfficeEmail, r.UserId], firstName: r.FirstName, lastName: r.LastName, batch: r.Batch });
  if (!member) {
    issue("payments-membership-without-member", source, "Paid for membership but no matching member account", "not imported: add the member, then re-run", {
      name: [r.Title, r.FirstName, r.FamilyName, r.LastName].map(clean.text).filter(Boolean).join(" "), batch: r.Batch,
      email: clean.text(r.OfficeEmail), phone: clean.text(r.OfficePhone3 || r.ResPhoneNum1), amount: clean.rupees(r.amount), orderId: clean.text(r.orderid), appliedOn: clean.text(r.apply_date),
    });
    continue;
  }
  if (how !== "email") issue("payments-matched-by-name", source, `Matched to ${member.memberId} by ${how}; please confirm`, "imported", { memberId: member.memberId, name: member.fullName });
  addMembershipPayment(`LEGACY-A-${r.ID}`, member, {
    amount: clean.rupees(r.amount),
    paidAt: clean.timestamp(r.enterdate) ?? clean.timestamp(r.apply_date),
    gateway: legacyGateway({ orderId: r.orderid, status: r.payment_status, authDesc: r.AuthDesc, message: r.message }),
    source,
  });
}
for (const p of membershipPayments) {
  record("clean", "membership-payments", { order_id: p.orderId, member_id: p.member.memberId, amount: p.amount, paid_at: p.paidAt, status: "paid", source: p.source, legacy: p.gateway });
}

// ─── Donations → contribution_funds + contributions ────────────────────────────────────────────

const funds = new Map(); // label → fund
function fundFor(type) {
  const label = clean.text(type).replace("Secretatiat", "Secretariat") || "Unspecified (old site)";
  if (!funds.has(label)) {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    funds.set(label, { code: `legacy-${slug}`.slice(0, 30).replace(/-$/, ""), label: label.slice(0, 100), status: "suspended", sortOrder: 900 + funds.size });
  }
  return funds.get(label);
}

const contributions = [];
for (const r of old.donation) {
  const source = `donation#${r.ID}`;
  if (!clean.isPaid(r.payment_status)) {
    archiveTable("donations-not-paid", [r], (row) => ({ ...row, payment: clean.paymentState(row.payment_status) }));
    continue;
  }
  const donorName = [r.Title, r.FirstName, r.FamilyName, r.LastName].map(clean.text).filter(Boolean).join(" ");
  const { member, how } = findMember({ memberId: r.memberid, emails: [r.email, r.OfficeEmail], firstName: r.FirstName, lastName: r.LastName, batch: r.Batch });
  const amount = clean.rupees(r.amount);
  if (!member) {
    issue("payments-donation-without-member", source, "Paid donation from someone with no member account", "not imported: contributions must belong to a member", {
      donorName, batch: r.Batch, email: clean.email(r.email), phone: clean.text(r.OfficePhone3 || r.ResPhoneNum1), amount, fund: clean.text(r.type), receipt: clean.text(r.receipt), date: clean.text(r.apply_date),
    });
    continue;
  }
  if (how === "name and batch") issue("payments-matched-by-name", source, `Matched to ${member.memberId} by ${how}; please confirm`, "imported", { memberId: member.memberId, name: member.fullName });
  if (!amount || amount < 10) issue("payments-suspected-test", source, `Paid amount is ₹${amount ?? 0}, probably a test payment`, "imported", { memberId: member.memberId, amount });
  const panNumber = clean.pan(r.pannumber);
  if (clean.text(r.pannumber) && !panNumber) issue("payments-invalid-pan", source, "PAN is not in the ABCDE1234F format", "imported without PAN", { memberId: member.memberId, rawPan: clean.text(r.pannumber) });
  for (const [kind, path] of [["pan_card", r.pancard], ["address_proof", r.add_file]]) {
    if (clean.text(path)) record("archive", "donation-documents-to-copy", { orderId: `LEGACY-D-${r.ID}`, memberId: member.memberId, kind, url: `${OLD_SITE}/user/${clean.text(path)}` });
  }
  const paidAt = clean.timestamp(r.apply_date);
  contributions.push({
    orderId: `LEGACY-D-${r.ID}`, member, fund: fundFor(r.type), amount: amount ?? 0, donorName: donorName.slice(0, 160),
    batch: clean.batch(r.Batch), email: clean.email(r.email) ?? clean.email(r.OfficeEmail) ?? member.email ?? "",
    mobile: clean.mobile([[r.OfficePhone3, ""], [r.ResPhoneNum1, ""], [r.ResPhoneNum2, ""]])?.mobile ?? member.mobile ?? "",
    address: [r.Address1, r.Address2, r.Address3].map(clean.text).filter(Boolean).join(", ").slice(0, 300),
    city: clean.text(r.City), state: clean.text(r.State), pincode: clean.text(r.ResZip).replace(/^0$/, ""), country: clean.text(r.Country),
    pan: panNumber, addressDocNumber: clean.text(r.add_no).slice(0, 60) || null, paidAt,
    gateway: legacyGateway({ orderId: r.orderid, status: r.payment_status, authDesc: r.AuthDesc, receipt: r.receipt, message: r.message }),
  });
}
for (const c of contributions) {
  record("clean", "contributions", { order_id: c.orderId, member_id: c.member.memberId, fund: c.fund.code, amount: c.amount, donor_name: c.donorName, email: c.email, mobile: c.mobile, pan: c.pan, paid_at: c.paidAt, receipt: c.gateway.receipt });
}
for (const f of funds.values()) record("clean", "contribution-funds", f);

// ─── Donor passes and old dinner registrations → event_passes + event_pass_bookings ────────────

const passDefinitions = new Map(old.donorpass.map((p) => [p.passid, p]));
const passes = new Map(); // `${eventName}|${passId}` → pass
const bookings = [];

function passFor(year, legacyPassId, amount) {
  const eventName = `annual-dinner-${year}`;
  const definition = year >= 2025 ? passDefinitions.get(legacyPassId) : null; // the old table only holds the latest year's passes
  const passId = legacyPassId === "dinner" ? "legacy-dinner" : `legacy-${legacyPassId}`;
  const key = `${eventName}|${passId}`;
  if (!passes.has(key)) {
    const title = legacyPassId === "dinner"
      ? "Annual Dinner registration"
      : definition ? `${clean.text(definition.title)} · ${clean.text(definition.passtype)}` : `Donor Pass #${legacyPassId}`;
    passes.set(key, {
      eventName, passId, tierGroup: "legacy", tierTitle: title.slice(0, 100), title: title.slice(0, 150),
      label: `${title} (Annual Dinner ${year})`.slice(0, 200), price: Math.round(definition?.price ?? amount ?? 0),
      includesSpouse: Boolean(definition?.spouse), status: "locked", statusNote: "Imported from the old site", displayOrder: 900,
    });
  }
  return passes.get(key);
}

for (const r of old.donoruser) {
  const source = `donoruser#${r.ID}`;
  if (!clean.isPaid(r.paymentstatus)) {
    archiveTable("donor-passes-not-paid", [r], (row) => ({ ...row, payment: clean.paymentState(row.paymentstatus) }));
    continue;
  }
  const [firstName, ...rest] = clean.text(r.name).split(" ");
  const { member, how } = findMember({ memberId: r.memberid, emails: [r.email], firstName, lastName: rest.at(-1), batch: r.batch });
  const paidAt = clean.timestamp(r.enterdate);
  const amount = clean.rupees(r.amount);
  if (!member || !paidAt) {
    issue("payments-donor-pass-without-member", source, member ? "No purchase date" : "Paid donor pass but no matching member account", "not imported", {
      name: clean.text(r.name), batch: r.batch, email: clean.email(r.email), mobile: clean.text(r.mobile), amount, pass: r.passid, passCode: clean.text(r.donorpass), receipt: clean.text(r.receipt), date: clean.text(r.enterdate),
    });
    continue;
  }
  if (how === "name and batch") issue("payments-matched-by-name", source, `Matched to ${member.memberId} by ${how}; please confirm`, "imported", { memberId: member.memberId, name: member.fullName });
  const pass = passFor(paidAt.getFullYear(), r.passid, amount);
  const upgrade = Number(r.upgrade) > 0;
  bookings.push({
    orderId: `LEGACY-P-${r.ID}`, pass, member, fullName: clean.text(r.name) || member.fullName, email: clean.email(r.email) ?? member.email ?? "",
    mobile: clean.text(r.mobile).replace(/[^\d+]/g, "").slice(0, 30) || member.mobile, spouseName: clean.text(r.wifename).slice(0, 150) || null,
    teachers: Number(r.teacher) || 0, childrenUnder12: Number(r.child_under) || 0, childrenAbove12: Number(r.child_above) || 0,
    lineItems: [{ label: upgrade ? `Upgrade to ${pass.title}` : pass.title, amount: amount ?? 0 }], amount: amount ?? 0, paidAt,
    gateway: legacyGateway({ orderId: r.orderid, status: r.paymentstatus, receipt: r.receipt, passCode: r.donorpass, upgradeOf: upgrade ? `donoruser#${r.oldid}` : "", message: r.message }),
  });
}

for (const r of old.dinner) {
  const source = `dinner#${r.ID}`;
  if (!clean.isPaid(r.payment_status)) {
    archiveTable("dinner-registrations-not-paid", [r], (row) => ({ ...row, payment: clean.paymentState(row.payment_status) }));
    continue;
  }
  const paidAt = clean.timestamp(r.apply_date);
  const { member } = findMember({ memberId: 0, emails: [r.email, r.OfficeEmail], firstName: r.FirstName, lastName: r.LastName, batch: r.Batch });
  const amount = clean.rupees(r.amount);
  if (!member || !paidAt) {
    issue("payments-dinner-without-member", source, member ? "No registration date" : "Paid dinner registration but no matching member account", "not imported", {
      name: [r.FirstName, r.LastName].map(clean.text).join(" "), batch: r.Batch, email: clean.email(r.email), amount, date: clean.text(r.apply_date),
    });
    continue;
  }
  const pass = passFor(paidAt.getFullYear(), "dinner", amount);
  bookings.push({
    orderId: `LEGACY-DN-${r.ID}`, pass, member, fullName: member.fullName, email: clean.email(r.email) ?? member.email ?? "", mobile: member.mobile,
    spouseName: clean.text(r.spouse || r.WifeName).slice(0, 150) || null, teachers: 0, childrenUnder12: 0, childrenAbove12: 0,
    lineItems: [{ label: pass.title, amount: amount ?? 0 }], amount: amount ?? 0, paidAt,
    gateway: legacyGateway({ orderId: r.orderid, status: r.payment_status, message: r.message }),
  });
}
for (const b of bookings) {
  record("clean", "event-pass-bookings", { order_id: b.orderId, event: b.pass.eventName, pass: b.pass.title, member_id: b.member.memberId, full_name: b.fullName, amount: b.amount, paid_at: b.paidAt, spouse: b.spouseName, teachers: b.teachers, legacy: b.gateway });
}
for (const p of passes.values()) record("clean", "event-passes", p);

// ─── Everything the app has no table for yet ────────────────────────────────────────────────────

archiveTable("business-directory", old.business_info);
archiveTable("business-directory-members", old.ocamember_business);
archiveTable("internships", old.internship_info);
archiveTable("internship-extra-details", old.internship_more);
archiveTable("internship-applications", old.internship_apply);
archiveTable("internship-members", old.ocamember_internship);
archiveTable("corporate-access", old.corporate_access);
archiveTable("member-discount-coupons", old.coupons);
archiveTable("sports-event-registrations", old.events_reg);
archiveTable("suggestion-box", old.suggtn_box);
archiveTable("donor-pass-definitions", old.donorpass);
archiveTable("donor-pass-member-prices", old.donorpass_member);
archiveTable("receipt-number-counters", old.receipt_number);

const memberEmails = new Map(members.filter((m) => m.email).map((m) => [m.email, m.memberId]));
archiveTable("wordpress-users", wp.wp_users, (u) => ({
  id: u.ID, login: u.user_login, email: u.user_email, registered: u.user_registered, name: u.display_name,
  matchingMember: memberEmails.get(clean.email(u.user_email)) ?? "",
}));

// Contact Form DB keeps one row per field; put each submission back together.
const submissions = new Map();
for (const s of wp.wp_cf7dbplugin_submits) {
  const key = `${s.form_name}|${s.submit_time}`;
  if (!submissions.has(key)) submissions.set(key, { form: clean.text(s.form_name), submitted: new Date(Number(s.submit_time) * 1000).toISOString() });
  if (!String(s.field_name).startsWith("_")) submissions.get(key)[clean.text(s.field_name)] = clean.text(s.field_value);
}
archiveTable("contact-form-submissions", [...submissions.values()]);

// ─── Write the files ────────────────────────────────────────────────────────────────────────────

rmSync(args.out, { recursive: true, force: true });
for (const [folder, named] of Object.entries(files)) {
  mkdirSync(join(args.out, folder), { recursive: true });
  for (const [name, rows] of Object.entries(named)) writeFileSync(join(args.out, folder, `${name}.csv`), toCsv(rows));
}

const count = (folder) => Object.entries(files[folder]).sort().map(([name, rows]) => `| ${name}.csv | ${rows.length} |`).join("\n");
const summary = `# Old site import: ${new Date().toISOString().slice(0, 10)}

Source: \`${args.dump}\` (membership app \`${MEMBERS_DB}\`, WordPress \`${WORDPRESS_DB}\`).

## Will be imported (clean/)

| File | Rows |
|---|---|
${count("clean")}

## Problems to review (issues/)

Every row names its source row (\`table#id\`), what is wrong, and what the import did about it.

| File | Rows |
|---|---|
${count("issues")}

## Kept for later (archive/)

Old data with no place in the app yet, and unpaid or abandoned payment attempts. Passwords are removed.

| File | Rows |
|---|---|
${count("archive")}
`;
writeFileSync(join(args.out, "summary.md"), summary);
console.log(summary);
console.log(`Files written to ${args.out}/`);

if (args.apply) await apply();

// ─── --apply: write into the database ───────────────────────────────────────────────────────────

async function apply() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && !args["confirm-production"]) fail("This would import into the LIVE database. Add --confirm-production if that is what you want.");
  const { loadedEnvFiles } = nextEnv.loadEnvConfig(process.cwd(), !isProduction, { info() {}, error: console.error });
  console.log(`\nImporting into the ${isProduction ? "PRODUCTION" : "development"} database (settings from ${loadedEnvFiles.map((f) => f.path).join(", ")})`);

  const client = new pg.Client({ connectionString: databaseUrl() });
  await client.connect();
  try {
    const { rows: [emailColumn] } = await client.query("SELECT is_nullable FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email'");
    let toImport = members;
    if (emailColumn.is_nullable !== "YES" && members.some((m) => !m.email)) {
      if (!args["skip-missing-email"]) {
        fail(`${members.filter((m) => !m.email).length} members have no usable email, but users.email is required.\n  Make the column optional first, or re-run with --skip-missing-email to leave them (and their payments) out.`);
      }
      toImport = members.filter((m) => m.email);
    }

    // Members already in the app (signed up on the new site) keep their account; old payments attach to it.
    const { rows: existing } = await client.query("SELECT id, member_id, email, metadata->'legacy'->>'id' AS legacy_id FROM users");
    const existingByLegacy = new Map(existing.filter((u) => u.legacy_id).map((u) => [Number(u.legacy_id), u.id]));
    const existingByMemberId = new Map(existing.map((u) => [u.member_id, u.id]));
    const existingByEmail = new Map(existing.map((u) => [u.email?.toLowerCase(), u.id]));
    const conflicts = [];
    const fresh = [];
    for (const m of toImport) {
      const clash = existingByLegacy.get(m.legacyId) ?? existingByEmail.get(m.email) ?? existingByMemberId.get(m.memberId);
      if (clash) {
        m.userId = clash;
        if (!existingByLegacy.has(m.legacyId)) conflicts.push({ source: m.source, memberId: m.memberId, email: m.email, linkedToUserId: clash });
      } else fresh.push(m);
    }
    if (conflicts.length) {
      writeFileSync(join(args.out, "issues", "apply-linked-to-existing-accounts.csv"), toCsv(conflicts));
      console.log(`  ${conflicts.length} old members already have an account here; their payments go to that account (issues/apply-linked-to-existing-accounts.csv).`);
    }

    console.log(`  Hashing ${fresh.length} passwords ...`);
    const scrypt = promisify(crypto.scrypt);
    const userRows = [];
    for (let i = 0; i < fresh.length; i += 16) {
      userRows.push(...(await Promise.all(fresh.slice(i, i + 16).map(async (m) => {
        // Same scheme as hashPassword in app/api/core/auth.ts. Default passwords get a random one nobody knows.
        const salt = crypto.randomBytes(16).toString("hex");
        const secret = m.mustReset ? crypto.randomBytes(32).toString("hex") : m.password;
        const hash = (await scrypt(secret, salt, 64)).toString("hex");
        return {
          member_id: m.memberId, email: m.email, mobile: m.mobile, full_name: m.fullName, password_hash: hash, password_salt: salt,
          role: "member", batch_year: m.batchYear, date_of_birth: m.dateOfBirth, membership_type: m.membershipType, status: "active", metadata: m.metadata,
        };
      }))));
    }

    await client.query("BEGIN");
    const inserted = await insertRows(client, "users", userRows, {
      member_id: "varchar", email: "varchar", mobile: "varchar", full_name: "varchar", password_hash: "text", password_salt: "varchar", role: "varchar",
      batch_year: "varchar", date_of_birth: "date", membership_type: "varchar", status: "varchar", metadata: "jsonb",
    }, "ON CONFLICT DO NOTHING");
    const { rows: imported } = await client.query("SELECT id, metadata->'legacy'->>'id' AS legacy_id FROM users WHERE metadata ? 'legacy'");
    for (const u of imported) if (byLegacyId.has(Number(u.legacy_id))) byLegacyId.get(Number(u.legacy_id)).userId ??= u.id;
    const userIdOf = (m) => m.userId ?? null;

    // Old donations join the live fund of the same name (so the home page's bar counts them);
    // only funds the app no longer has get a suspended legacy-* fund of their own.
    const labelKey = (label) => label.trim().toLowerCase();
    const { rows: liveFunds } = await client.query("SELECT id, label FROM contribution_funds WHERE code NOT LIKE 'legacy-%'");
    const liveByLabel = new Map(liveFunds.map((f) => [labelKey(f.label), f.id]));
    const fundRows = [...funds.values()]
      .filter((f) => !liveByLabel.has(labelKey(f.label)))
      .map((f) => ({ code: f.code, label: f.label, status: f.status, sort_order: f.sortOrder }));
    await insertRows(client, "contribution_funds", fundRows, { code: "varchar", label: "varchar", status: "varchar", sort_order: "int" }, "ON CONFLICT (code) DO NOTHING");
    const { rows: fundIds } = await client.query("SELECT id, code FROM contribution_funds");
    const fundId = new Map(fundIds.map((f) => [f.code, f.id]));
    for (const f of funds.values()) if (liveByLabel.has(labelKey(f.label))) fundId.set(f.code, liveByLabel.get(labelKey(f.label)));

    const passRows = [...passes.values()].map((p) => ({
      event_name: p.eventName, pass_id: p.passId, tier_group: p.tierGroup, tier_title: p.tierTitle, title: p.title, label: p.label, price: p.price,
      includes_spouse: p.includesSpouse, status: p.status, status_note: p.statusNote, display_order: p.displayOrder, metadata: { legacy: true },
    }));
    await insertRows(client, "event_passes", passRows, {
      event_name: "varchar", pass_id: "varchar", tier_group: "varchar", tier_title: "varchar", title: "varchar", label: "varchar", price: "int",
      includes_spouse: "boolean", status: "varchar", status_note: "varchar", display_order: "int", metadata: "jsonb",
    }, "ON CONFLICT (event_name, pass_id) DO NOTHING");
    const { rows: passIds } = await client.query("SELECT id, event_name, pass_id FROM event_passes");
    const passId = new Map(passIds.map((p) => [`${p.event_name}|${p.pass_id}`, p.id]));

    const skipped = [];
    const owned = (rows, kind) => rows.filter((row) => (userIdOf(row.member) ? true : (skipped.push({ kind, orderId: row.orderId, memberId: row.member.memberId }), false)));

    const membershipRows = owned(membershipPayments, "membership").map((p) => {
      const m = p.member;
      const a = m.metadata.address;
      const n = m.metadata.name;
      return {
        order_id: p.orderId, membership_type: m.membershipType, title: (n.title || "Mr.").slice(0, 20), batch_year: m.batchYear ?? "", first_name: (n.firstName || n.lastName).slice(0, 80),
        middle_name: n.middleName.slice(0, 80) || null, last_name: n.lastName.slice(0, 80) || null, date_of_birth: m.dateOfBirth, email: m.email ?? "",
        country_code: m.metadata.countryCode, mobile: m.mobile ?? "", password_hash: "legacy-import", password_salt: "legacy-import",
        address_line1: a.line1.slice(0, 200), address_line2: a.line2.slice(0, 200) || null, address_line3: a.line3.slice(0, 200) || null,
        city: a.city.slice(0, 100), state: a.state.slice(0, 100), zip: a.zip.slice(0, 20), country: a.country.slice(0, 100),
        amount: p.amount, status: "paid", gateway_status: "Legacy", gateway_message: "Imported from the old site", gateway_response: p.gateway,
        user_id: userIdOf(m), paid_at: p.paidAt, welcome_email_sent_at: p.paidAt ?? new Date(),
      };
    });
    await insertRows(client, "membership_applications", membershipRows, {
      order_id: "varchar", membership_type: "varchar", title: "varchar", batch_year: "varchar", first_name: "varchar", middle_name: "varchar", last_name: "varchar",
      date_of_birth: "date", email: "varchar", country_code: "varchar", mobile: "varchar", password_hash: "varchar", password_salt: "varchar",
      address_line1: "varchar", address_line2: "varchar", address_line3: "varchar", city: "varchar", state: "varchar", zip: "varchar", country: "varchar",
      amount: "int", status: "varchar", gateway_status: "varchar", gateway_message: "varchar", gateway_response: "jsonb", user_id: "int", paid_at: "timestamptz", welcome_email_sent_at: "timestamptz",
    }, "ON CONFLICT (order_id) DO NOTHING");

    const contributionRows = owned(contributions, "contribution").map((c) => ({
      order_id: c.orderId, user_id: userIdOf(c.member), fund_id: fundId.get(c.fund.code), amount: c.amount, donor_name: c.donorName, batch: c.batch,
      email: c.email.slice(0, 255), mobile: (c.mobile ?? "").slice(0, 20), address: c.address, city: c.city.slice(0, 100), state: c.state.slice(0, 100),
      pincode: c.pincode.slice(0, 20), country: c.country.slice(0, 100), wants_80g: Boolean(c.pan), pan: c.pan, address_doc_number: c.addressDocNumber,
      status: "paid", gateway_status: "Legacy", gateway_message: "Imported from the old site", gateway_response: c.gateway, paid_at: c.paidAt, thank_you_email_sent_at: c.paidAt ?? new Date(),
    }));
    await insertRows(client, "contributions", contributionRows, {
      order_id: "varchar", user_id: "int", fund_id: "int", amount: "int", donor_name: "varchar", batch: "varchar", email: "varchar", mobile: "varchar", address: "varchar",
      city: "varchar", state: "varchar", pincode: "varchar", country: "varchar", wants_80g: "boolean", pan: "varchar", address_doc_number: "varchar", status: "varchar",
      gateway_status: "varchar", gateway_message: "varchar", gateway_response: "jsonb", paid_at: "timestamptz", thank_you_email_sent_at: "timestamptz",
    }, "ON CONFLICT (order_id) DO NOTHING");

    const bookingRows = owned(bookings, "donor pass").map((b) => ({
      order_id: b.orderId, event_name: b.pass.eventName, event_pass_id: passId.get(`${b.pass.eventName}|${b.pass.passId}`), pass_id: b.pass.passId, pass_label: b.pass.label,
      user_id: userIdOf(b.member), member_id: b.member.memberId, full_name: b.fullName.slice(0, 150), email: b.email.slice(0, 255), mobile: b.mobile, spouse_name: b.spouseName,
      teachers: b.teachers, children_under12: b.childrenUnder12, children_above12: b.childrenAbove12, line_items: b.lineItems, amount: b.amount, status: "paid",
      gateway_status: "Legacy", gateway_message: "Imported from the old site", gateway_response: b.gateway, paid_at: b.paidAt,
    }));
    await insertRows(client, "event_pass_bookings", bookingRows, {
      order_id: "varchar", event_name: "varchar", event_pass_id: "int", pass_id: "varchar", pass_label: "varchar", user_id: "int", member_id: "varchar", full_name: "varchar",
      email: "varchar", mobile: "varchar", spouse_name: "varchar", teachers: "int", children_under12: "int", children_above12: "int", line_items: "jsonb", amount: "int",
      status: "varchar", gateway_status: "varchar", gateway_message: "varchar", gateway_response: "jsonb", paid_at: "timestamptz",
    }, "ON CONFLICT (order_id) DO NOTHING");

    await client.query(args.rollback ? "ROLLBACK" : "COMMIT");
    if (skipped.length) writeFileSync(join(args.out, "issues", "apply-skipped-payments.csv"), toCsv(skipped));
    console.log(`\n✓ ${args.rollback ? "Test run, rolled back (nothing kept):" : "Imported"} ${inserted} members, ${membershipRows.length} membership payments, ${contributionRows.length} contributions, ${bookingRows.length} pass bookings` +
      (skipped.length ? ` (${skipped.length} payments skipped because their member was left out: issues/apply-skipped-payments.csv)` : "") + ".\n");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

/** Inserts rows in chunks through jsonb_to_recordset (one round trip per 500 rows). Returns how many were inserted. */
async function insertRows(client, table, rows, columns, conflict) {
  const names = Object.keys(columns);
  const list = names.join(", ");
  const types = names.map((n) => `${n} ${columns[n]}`).join(", ");
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const { rowCount } = await client.query(
      `INSERT INTO ${table} (${list}) SELECT ${list} FROM jsonb_to_recordset($1::jsonb) AS x(${types}) ${conflict}`,
      [JSON.stringify(rows.slice(i, i + 500))]
    );
    inserted += rowCount;
  }
  return inserted;
}

/** Same URL as buildDatabaseUrl in app/api/core/databaseConfig.ts. */
function databaseUrl(env = process.env) {
  const missing = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"].filter((key) => !env[key]);
  if (missing.length > 0) fail(`${missing.join(", ")} not set. Add them to .env (see .env.example).`);
  const ssl = env.DB_SSL === "true" ? "?sslmode=require&uselibpqcompat=true" : "";
  return `postgres://${encodeURIComponent(env.DB_USER)}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${encodeURIComponent(env.DB_NAME)}${ssl}`;
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}
