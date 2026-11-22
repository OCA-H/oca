// What the OCA admin console (/sv/oca-admin) sends and receives. No tables of its own: it works on
// users, membership_applications and event_pass_bookings. Shared by the API and the page.

/** Name titles offered when creating or updating an account. */
export const MEMBER_TITLES = [
  "Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Br.", "Fr.", "Rev.", "Sir", "Col.", "Lt. Col.", "Maj.", "Capt.",
  "Brig.", "Gen.", "Lt. Gen.", "Maj. Gen.", "Air Cmde.", "Cdr.", "Adm.", "Justice", "Hon.", "Shri", "Smt.", "Late",
] as const;

/** The first and last batch the console offers. */
export const FIRST_BATCH = 1940;
export const lastBatch = () => new Date().getFullYear();

/** One account as the console lists it: enough to filter, sort, find duplicates and birthdays. */
export interface MemberRow {
  id: number;
  /** The OCA membership ID, e.g. "1989/017". */
  memberId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  /** First, middle and last name, without the title. */
  name: string;
  batch: string;
  email: string;
  countryCode: string;
  mobile: string;
  remark: string;
  /** "member", "admin" (sub admin) or "super_admin". */
  role: string;
  membershipType: string;
  status: string;
  /** "21 Apr 2025": when they applied or the account was made. */
  appliedOn: string;
  /** "1985-03-24" or null. */
  dateOfBirth: string | null;
  /** Wedding anniversary, "2000-11-21" or null. */
  anniversary: string | null;
}

/** One account in full, for the Members Detail page. */
export interface MemberDetail extends MemberRow {
  username: string | null;
  spouseName: string;
  address: { line1: string; line2: string; line3: string; city: string; state: string; zip: string; country: string };
  office: { organisation: string; designation: string; city: string; country: string };
  lastLoginAt: string | null;
  createdAt: string;
}

/** What the Create Account and Update Account forms send. Password only on create. */
export interface MemberInput {
  title: string;
  batch: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password?: string;
  countryCode: string;
  mobile: string;
  /** Blank on create: the system gives "<batch>/NNN". */
  memberId: string;
  remark: string;
}

/** The signed-in super admin or admin. */
export interface StaffUser {
  id: number;
  fullName: string;
  memberId: string;
  role: string;
}

/** A paid pass booking as the Donor Pass list shows it. */
export interface DonorPassRow {
  id: number;
  orderId: string;
  eventName: string;
  passLabel: string;
  name: string;
  batch: string;
  email: string;
  mobile: string;
  amount: number;
  /** Teachers sponsored with this pass. */
  teachers: number;
  spouseName: string;
  lineItems: { label: string; amount: number }[];
  paidAt: string | null;
}

/** The files Export Data can download. */
export const EXPORT_KINDS = ["members", "applications", "receipts", "events", "admins"] as const;
export type ExportKind = (typeof EXPORT_KINDS)[number];
export type ExportCounts = Record<ExportKind, number>;

/** A page of a list, with the counts its filters show. */
export interface PageOf<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  /** Batch → how many match (the other filters applied). */
  batches: Record<string, number>;
}

/** A Donor Pass page also counts each pass type, keyed "<event>|<pass label>". */
export interface PassPage extends PageOf<DonorPassRow> {
  types: Record<string, number>;
}

/** Accounts that look like the same person. */
export interface DuplicateGroup {
  label: string;
  key: string;
  rows: MemberRow[];
}

/** A birthday or anniversary in the coming week. */
export interface Occasion {
  /** "2026-11-21". */
  date: string;
  /** 0 is today. */
  inDays: number;
  kind: "Birthday" | "Anniversary";
  member: MemberRow;
}

/** The dashboard's numbers. */
export interface ConsoleSummary {
  members: number;
  subAdmins: number;
}
