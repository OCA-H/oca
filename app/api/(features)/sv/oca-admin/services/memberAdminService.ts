import "server-only";
import { hashPassword } from "@/app/api/core/auth";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { isUniqueViolation } from "@/app/api/core/baseRepository";
import { USER_ROLES, type User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";
import type { MembershipApplication } from "@/app/api/(features)/(pview)/membership/schema/membershipSchema";
import { memberAdminRepository, type MemberAdminRepository, type MemberQuery, type PaidBooking, type PassQuery } from "../repository";
import {
  FIRST_BATCH,
  MEMBER_TITLES,
  lastBatch,
  type DonorPassRow,
  type DuplicateGroup,
  type Occasion,
  type ExportKind,
  type MemberDetail,
  type MemberInput,
  type MemberRow,
} from "../schema";

type Metadata = Record<string, unknown>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[0-9][0-9\s-]{5,18}$/;
const COUNTRY_CODE_PATTERN = /^\+?[0-9]{1,4}$/;
const MEMBER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,49}$/;
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 128;
const KNOWN_TITLES: readonly string[] = MEMBER_TITLES;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");
const meta = (value: unknown): Metadata => (value && typeof value === "object" && !Array.isArray(value) ? (value as Metadata) : {});
const isoDay = (value: unknown): string | null => {
  const day = text(value).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
};
const shortDate = (date: Date) => `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

/** Name parts saved in metadata.name (by the profile, checkout or this console), else split from fullName. */
function nameParts(user: User) {
  const saved = meta(user.metadata?.name);
  if (text(saved.firstName) || text(saved.lastName)) {
    return { title: text(saved.title), firstName: text(saved.firstName), middleName: text(saved.middleName), lastName: text(saved.lastName) };
  }
  const words = user.fullName.trim().split(/\s+/);
  const title = KNOWN_TITLES.includes(words[0]) ? words.shift()! : "";
  const firstName = words.shift() ?? "";
  const lastName = words.pop() ?? "";
  return { title, firstName, middleName: words.join(" "), lastName };
}

export function toMemberRow(user: User): MemberRow {
  const parts = nameParts(user);
  const legacy = meta(user.metadata?.legacy);
  return {
    id: user.id,
    memberId: user.memberId,
    ...parts,
    name: [parts.firstName, parts.middleName, parts.lastName].filter(Boolean).join(" ") || user.fullName,
    batch: user.batchYear ?? "",
    email: user.email ?? "",
    countryCode: text(user.metadata?.countryCode),
    mobile: user.mobile ?? "",
    remark: text(user.metadata?.remark) || text(legacy.remark),
    role: user.role,
    membershipType: user.membershipType,
    status: user.status,
    appliedOn: text(legacy.appliedOn) || shortDate(user.createdAt),
    dateOfBirth: user.dateOfBirth,
    anniversary: isoDay(user.metadata?.anniversary),
  };
}

function toMemberDetail(user: User): MemberDetail {
  const address = meta(user.metadata?.address);
  const office = meta(user.metadata?.office);
  return {
    ...toMemberRow(user),
    username: user.username,
    spouseName: text(user.metadata?.spouseName),
    address: {
      line1: text(address.line1), line2: text(address.line2), line3: text(address.line3),
      city: text(address.city), state: text(address.state), zip: text(address.zip), country: text(address.country),
    },
    office: { organisation: text(office.organisation), designation: text(office.designation), city: text(office.city), country: text(office.country) },
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

function toDonorPass(booking: PaidBooking): DonorPassRow {
  return {
    id: booking.id,
    orderId: booking.orderId,
    eventName: booking.eventName,
    passLabel: booking.passLabel,
    name: booking.fullName,
    batch: booking.batchYear ?? "",
    email: booking.email,
    mobile: booking.mobile ?? "",
    amount: booking.amount,
    teachers: booking.teachers,
    spouseName: booking.spouseName ?? "",
    lineItems: booking.lineItems ?? [],
    paidAt: booking.paidAt?.toISOString() ?? null,
  };
}

/** Reads and checks the Create / Update Account form. */
function readInput(body: Record<string, unknown>, isNew: boolean): MemberInput {
  const input: MemberInput = {
    title: text(body.title),
    batch: text(body.batch),
    firstName: text(body.firstName).slice(0, 80),
    middleName: text(body.middleName).slice(0, 80),
    lastName: text(body.lastName).slice(0, 80),
    email: text(body.email).toLowerCase(),
    countryCode: text(body.countryCode).replace(/\s/g, ""),
    mobile: text(body.mobile).replace(/[\s()-]/g, ""),
    memberId: text(body.memberId),
    remark: text(body.remark).slice(0, 1000),
    ...(isNew && { password: typeof body.password === "string" ? body.password : "" }),
  };

  const fields: FieldErrors = {};
  if (!input.title) fields.title = "Choose a title.";
  else if (input.title.length > 20) fields.title = "The title is too long.";
  const batch = Number(input.batch);
  if (!input.batch) fields.batch = "Choose a batch.";
  else if (!Number.isInteger(batch) || batch < FIRST_BATCH || batch > lastBatch()) fields.batch = `Choose a batch between ${FIRST_BATCH} and ${lastBatch()}.`;
  if (!input.firstName) fields.firstName = "Enter the first name.";
  if (input.email && !EMAIL_PATTERN.test(input.email)) fields.email = "Enter a valid email address.";
  if (input.countryCode && !COUNTRY_CODE_PATTERN.test(input.countryCode)) fields.countryCode = "Enter a country code like +91.";
  if (input.mobile && !MOBILE_PATTERN.test(input.mobile)) fields.mobile = "Enter a valid mobile number.";
  if (input.memberId && !MEMBER_ID_PATTERN.test(input.memberId)) fields.memberId = "Use letters, numbers and / - _ . only (up to 50).";
  if (isNew) {
    if (!input.email) fields.email = "Enter the email address.";
    if (!input.mobile) fields.mobile = "Enter the mobile number.";
    const password = input.password ?? "";
    if (password.length < MIN_PASSWORD) fields.password = `The password must be at least ${MIN_PASSWORD} characters.`;
    else if (password.length > MAX_PASSWORD) fields.password = `The password must be at most ${MAX_PASSWORD} characters.`;
  }
  if (Object.keys(fields).length > 0) throw HttpError.badRequest("Some details need fixing.", fields);

  if (input.countryCode && !input.countryCode.startsWith("+")) input.countryCode = `+${input.countryCode}`;
  return input;
}

const fullNameOf = (input: MemberInput) =>
  [input.title, input.firstName, input.middleName, input.lastName].filter(Boolean).join(" ").slice(0, 150);

/* ---------------------------------- CSV ---------------------------------- */

/** One CSV cell. Cells a spreadsheet would run as a formula (=, +, -, @) are made plain text. */
function csvCell(value: unknown): string {
  let cell = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`;
  return /[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}
const toCsv = (header: string[], rows: unknown[][]) =>
  "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

const iso = (date: Date | null | undefined) => (date ? date.toISOString().replace("T", " ").slice(0, 19) : "");

function memberCsvRow(user: User): unknown[] {
  const row = toMemberDetail(user);
  const office = meta(user.metadata?.office);
  return [
    row.id, row.title, row.firstName, row.middleName, row.lastName, row.batch, row.memberId, row.membershipType, row.username ?? "",
    row.dateOfBirth ?? "", row.spouseName, row.anniversary ?? "",
    row.address.line1, row.address.line2, row.address.line3, row.address.city, row.address.zip, row.address.state, row.address.country,
    text(office.designation), text(office.organisation), text(office.line1), text(office.line2), text(office.line3),
    text(office.city), text(office.zip), text(office.state), text(office.country),
    row.countryCode, row.mobile, row.email, row.appliedOn, row.remark, row.role, row.status, iso(user.lastLoginAt), iso(user.updatedAt),
  ];
}
const MEMBER_HEADER = [
  "ID", "Title", "FirstName", "FamilyName", "LastName", "Batch", "oca_id", "OfficeMember", "UserId",
  "BirthDate", "WifeName", "WeddingDate",
  "Address1", "Address2", "Address3", "City", "ResZip", "State", "Country",
  "Designation", "Organisation", "OfficeAddress1", "OfficeAddress2", "OfficeAddress3",
  "OfficeCity", "OfficeZip", "OfficeState", "OfficeCountry",
  "CountryCode", "Mobile", "Email", "apply_date", "Remark", "Role", "Status", "Last_Login", "Last_Update",
];

function applicationCsvRow(a: MembershipApplication): unknown[] {
  return [
    a.id, a.orderId, a.title, a.firstName, a.middleName ?? "", a.lastName ?? "", a.batchYear, a.dateOfBirth ?? "",
    a.addressLine1, a.addressLine2 ?? "", a.addressLine3 ?? "", a.city, a.state, a.country, a.zip,
    a.email, a.countryCode, a.mobile, a.membershipType, iso(a.createdAt),
    a.status, a.amount, a.currency, a.trackingId ?? "", a.bankRefNo ?? "", a.paymentMode ?? "", a.gatewayMessage ?? "", iso(a.paidAt),
  ];
}
const APPLICATION_HEADER = [
  "ID", "OrderId", "Title", "FirstName", "FamilyName", "LastName", "Batch", "BirthDate",
  "Address1", "Address2", "Address3", "City", "State", "Country", "ResZip",
  "OfficeEmail", "CountryCode", "Mobile", "OfficeMember", "apply_date",
  "payment_status", "amount", "currency", "tracking_id", "bank_ref_no", "payment_mode", "message", "paid_at",
];

/** File name stem for each export, and how its rows are made. */
const EXPORTS: Record<ExportKind, { file: string; build: (repo: MemberAdminRepository) => Promise<string> }> = {
  members: {
    file: "Member_Details",
    build: async (repo) => toCsv(MEMBER_HEADER, (await repo.findAllUsers()).map(memberCsvRow)),
  },
  applications: {
    file: "Apply_Members",
    build: async (repo) => toCsv(APPLICATION_HEADER, (await repo.findAllApplications()).map(applicationCsvRow)),
  },
  receipts: {
    file: "Member_Receipts",
    build: async (repo) =>
      toCsv(
        ["Name", "Batch", "Email", "Mobile", "OCA Membership ID", "Amount", "Receipt No.", "Date"],
        (await repo.findPaidApplications()).map((a) => [
          [a.title, a.firstName, a.middleName, a.lastName].filter(Boolean).join(" "),
          a.batchYear, a.email, `${a.countryCode} ${a.mobile}`.trim(), a.accountMemberId ?? "", a.amount, a.orderId, iso(a.paidAt).slice(0, 10),
        ])
      ),
  },
  events: {
    file: "Events",
    build: async (repo) =>
      toCsv(
        ["id", "batch", "member_id", "name", "email", "mobile", "event", "pass", "teachers", "amount", "order_id", "sub_date"],
        (await repo.findPaidBookings()).map((b) => [
          b.id, b.batchYear ?? "", b.memberId, b.fullName, b.email, b.mobile ?? "", b.eventName, b.passLabel, b.teachers, b.amount, b.orderId, iso(b.paidAt ?? b.createdAt).slice(0, 10),
        ])
      ),
  },
  admins: {
    file: "Sub_Admins",
    build: async (repo) => toCsv(MEMBER_HEADER, (await repo.findStaff()).map(memberCsvRow)),
  },
};

/* ------------------------------ list queries ------------------------------ */

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function readPaging(params: URLSearchParams) {
  const whole = (name: string, fallback: number) => {
    const n = Number(params.get(name));
    return Number.isInteger(n) && n > 0 ? n : fallback;
  };
  const page = whole("page", 1);
  const pageSize = Math.min(whole("pageSize", DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const batch = params.get("batch")?.trim();
  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    batch: batch && /^\d{4}$/.test(batch) ? batch : undefined,
    q: params.get("q")?.trim().slice(0, 100) || undefined,
    dir: params.get("dir") === "desc" ? ("desc" as const) : ("asc" as const),
  };
}

const pick = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  allowed.includes(value as T) ? (value as T) : undefined;

export function readMemberQuery(request: Request): MemberQuery & { page: number; pageSize: number } {
  const params = new URL(request.url).searchParams;
  return {
    ...readPaging(params),
    missing: pick(params.get("missing"), ["email", "mobile", "id"] as const),
    sort: pick(params.get("sort"), ["name", "batch", "memberId", "email", "mobile"] as const),
  };
}

export function readPassQuery(request: Request): PassQuery & { page: number; pageSize: number } {
  const params = new URL(request.url).searchParams;
  return {
    ...readPaging(params),
    type: params.get("type")?.slice(0, 300) || undefined,
    teachersOnly: params.get("teachers") === "1",
    sort: pick(params.get("sort"), ["id", "name", "batch", "email", "mobile", "amount", "pass", "orderId"] as const),
  };
}

/** Today and the next six days in India, as "YYYY-MM-DD". */
function nextSevenDays(): string[] {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const [y, m, d] = today.split("-").map(Number);
  return Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10));
}

/* -------------------------------- service -------------------------------- */

export class MemberAdminService {
  constructor(private readonly repo: MemberAdminRepository) {}

  /** One page of accounts, with the batch counts for the filter. */
  async membersPage(query: ReturnType<typeof readMemberQuery>) {
    const [{ rows, total }, batches] = await Promise.all([this.repo.findMembersPage(query), this.repo.memberBatchCounts(query)]);
    return { data: rows.map(toMemberRow), page: query.page, pageSize: query.pageSize, total, batches };
  }

  summary() {
    return this.repo.summary();
  }

  async duplicates(): Promise<DuplicateGroup[]> {
    return (await this.repo.findDuplicateGroups()).map((g) => ({ label: g.label, key: g.key, rows: g.rows.map(toMemberRow) }));
  }

  /** Birthdays and anniversaries today and in the next six days, soonest first. */
  async occasions(): Promise<Occasion[]> {
    const days = nextSevenDays();
    const monthDays = days.map((d) => d.slice(5));
    const out: Occasion[] = [];
    for (const user of await this.repo.findOccasions(monthDays)) {
      const row = toMemberRow(user);
      for (const [kind, date] of [["Birthday", row.dateOfBirth], ["Anniversary", row.anniversary]] as const) {
        const i = date ? monthDays.indexOf(date.slice(5, 10)) : -1;
        if (i >= 0) out.push({ date: days[i], inDays: i, kind, member: row });
      }
    }
    return out.sort((a, b) => a.inDays - b.inDays || a.kind.localeCompare(b.kind) || a.member.name.localeCompare(b.member.name));
  }

  async getMember(id: number): Promise<MemberDetail> {
    return toMemberDetail(await this.mustFind(id));
  }

  async createMember(body: Record<string, unknown>, staff: User): Promise<MemberRow> {
    const input = readInput(body, true);
    const memberId = input.memberId || (await this.nextMemberId(input.batch));
    await this.assertFree(input, memberId);

    const { hash, salt } = hashPassword(input.password!);
    try {
      const user = await this.repo.createUser({
        memberId,
        email: input.email || null,
        mobile: input.mobile || null,
        fullName: fullNameOf(input),
        passwordHash: hash,
        passwordSalt: salt,
        role: USER_ROLES.member,
        batchYear: input.batch,
        membershipType: "Life Member",
        status: "active",
        metadata: {
          name: { title: input.title, firstName: input.firstName, middleName: input.middleName, lastName: input.lastName },
          countryCode: input.countryCode || "+91",
          ...(input.remark && { remark: input.remark }),
          createdBy: { id: staff.id, name: staff.fullName, at: new Date().toISOString() },
        },
      });
      return toMemberRow(user);
    } catch (error) {
      throw this.clashError(error) ?? error;
    }
  }

  async updateMember(id: number, body: Record<string, unknown>, staff: User): Promise<MemberRow> {
    const user = await this.mustFind(id);
    this.assertMayManage(staff, user);
    const input = readInput(body, false);
    const memberId = input.memberId || user.memberId;
    await this.assertFree(input, memberId, id);

    const metadata: Metadata = {
      ...(user.metadata ?? {}),
      name: { title: input.title, firstName: input.firstName, middleName: input.middleName, lastName: input.lastName },
      countryCode: input.countryCode || text(user.metadata?.countryCode) || "+91",
      remark: input.remark,
      updatedBy: { id: staff.id, name: staff.fullName, at: new Date().toISOString() },
    };
    try {
      const updated = await this.repo.updateUser(id, {
        memberId,
        email: input.email || null,
        mobile: input.mobile || null,
        fullName: fullNameOf(input),
        batchYear: input.batch,
        metadata,
      });
      if (!updated) throw HttpError.notFound("That account no longer exists.");
      return toMemberRow(updated);
    } catch (error) {
      throw this.clashError(error) ?? error;
    }
  }

  async deleteMember(id: number, staff: User): Promise<MemberRow> {
    const user = await this.mustFind(id);
    if (user.id === staff.id) throw HttpError.badRequest("You cannot delete your own account.");
    this.assertMayManage(staff, user);
    if (user.role === USER_ROLES.superAdmin) throw HttpError.forbidden("A super admin account cannot be deleted from here.");
    const contributions = await this.repo.contributionCount(id);
    if (contributions > 0) {
      throw HttpError.conflict(
        `${user.fullName} has ${contributions} contribution${contributions === 1 ? "" : "s"} on record, so the account cannot be deleted. Update it instead.`
      );
    }
    await this.repo.deleteUser(id);
    return toMemberRow(user);
  }

  /**
   * Makes a member a sub admin (role "admin"), or a sub admin a member again. Both super admins
   * and admins can add sub admins; only a super admin can take the role away. Super admins are
   * never changed here (scripts/create-admin.mjs does that).
   */
  async setRole(id: number, body: Record<string, unknown>, staff: User): Promise<MemberRow> {
    const role = text(body.role);
    if (role !== USER_ROLES.admin && role !== USER_ROLES.member) throw HttpError.badRequest("Choose admin or member.");
    const user = await this.mustFind(id);
    if (user.id === staff.id) throw HttpError.badRequest("You cannot change your own role.");
    if (user.role === USER_ROLES.superAdmin) throw HttpError.forbidden("A super admin’s role cannot be changed from here.");
    if (role === USER_ROLES.member && staff.role !== USER_ROLES.superAdmin) throw HttpError.forbidden("Only a super admin can remove a sub admin.");
    if (role === USER_ROLES.admin && user.status !== "active") throw HttpError.badRequest("Only active accounts can be made sub admins.");
    if (user.role === role) return toMemberRow(user);
    const updated = await this.repo.updateUser(id, { role });
    if (!updated) throw HttpError.notFound("That account no longer exists.");
    return toMemberRow(updated);
  }

  /** One page of paid passes, with the counts for the Batch and Donor Pass filters. */
  async passesPage(query: ReturnType<typeof readPassQuery>) {
    const [{ rows, total }, counts] = await Promise.all([this.repo.findPassesPage(query), this.repo.passFilterCounts(query)]);
    return { data: rows.map(toDonorPass), page: query.page, pageSize: query.pageSize, total, ...counts };
  }

  /** Every pass matching the filters, as CSV: "Export Donor Pass" and "Export Sponsor a teacher". */
  async passesCsv(query: ReturnType<typeof readPassQuery>): Promise<{ name: string; csv: string; count: number }> {
    const { rows } = await this.repo.findPassesPage({ ...query, offset: 0, limit: null });
    const csv = toCsv(
      ["SN", "Name", "Batch", "Email", "Mobile", "Amount", "Pass Name", "Event", "Teachers", "Pass No", "Paid on"],
      rows.map((b) => [b.id, b.fullName, b.batchYear ?? "", b.email, b.mobile ?? "", b.amount, b.passLabel, b.eventName, b.teachers, b.orderId, iso(b.paidAt).slice(0, 10)])
    );
    return { name: query.teachersOnly ? "sponsor-a-teacher.csv" : "donor-pass.csv", csv, count: rows.length };
  }

  exportCounts() {
    return this.repo.exportCounts();
  }

  /** The CSV for one export, and its download name, e.g. "OCA_Member_Details_2026-11-20.csv". */
  async exportCsv(kind: string): Promise<{ name: string; csv: string }> {
    const spec = EXPORTS[kind as ExportKind];
    if (!spec) throw HttpError.notFound("Unknown export.");
    const csv = await spec.build(this.repo);
    return { name: `OCA_${spec.file}_${new Date().toISOString().slice(0, 10)}.csv`, csv };
  }

  /* ------------------------------ helpers ------------------------------ */

  private async mustFind(id: number): Promise<User> {
    if (!Number.isInteger(id) || id <= 0) throw HttpError.badRequest("Unknown account.");
    const user = await this.repo.findUserById(id);
    if (!user) throw HttpError.notFound("That account no longer exists.");
    return user;
  }

  /** Admins (sub admins) cannot change a super admin's account; super admins can change anyone's. */
  private assertMayManage(staff: User, target: User) {
    if (target.role === USER_ROLES.superAdmin && staff.role !== USER_ROLES.superAdmin && target.id !== staff.id) {
      throw HttpError.forbidden("Only a super admin can change a super admin’s account.");
    }
  }

  /** The next free "<batch>/NNN" member ID, as the old portal numbered them. */
  private async nextMemberId(batch: string): Promise<string> {
    const taken = await this.repo.memberIdsForBatch(batch);
    const highest = taken.reduce((max, id) => Math.max(max, Number.parseInt(id.split("/")[1] ?? "", 10) || 0), 0);
    return `${batch}/${String(highest + 1).padStart(3, "0")}`;
  }

  /** Email, member ID and mobile each sign a member in, so no two accounts may share one. */
  private async assertFree(input: MemberInput, memberId: string, exceptId?: number) {
    const fields: FieldErrors = {};
    const [email, id, mobile] = await Promise.all([
      input.email ? this.repo.findClash("email", input.email, exceptId) : null,
      this.repo.findClash("memberId", memberId, exceptId),
      input.mobile ? this.repo.findClash("mobile", input.mobile, exceptId) : null,
    ]);
    if (email) fields.email = `${email.fullName} (${email.memberId}) already uses this email.`;
    if (id) fields.memberId = `${id.fullName} already has the membership ID ${memberId}.`;
    if (mobile) fields.mobile = `${mobile.fullName} (${mobile.memberId}) already uses this mobile number.`;
    if (Object.keys(fields).length > 0) throw new HttpError(409, "Another account already uses some of these details.", fields);
  }

  /** A unique-index failure from a race between two saves, as a friendly 409. */
  private clashError(error: unknown): HttpError | null {
    if (isUniqueViolation(error, "users_email_unique")) return HttpError.conflict("Another account already uses this email.");
    if (isUniqueViolation(error, "users_member_id_unique")) return HttpError.conflict("Another account already has this membership ID.");
    return null;
  }
}

export const memberAdminService = new MemberAdminService(memberAdminRepository);
