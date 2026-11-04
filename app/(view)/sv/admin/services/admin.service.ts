import { ApiError, apiRequest } from "@/app/(view)/common/services/api.service";
import { ROUTES } from "@/app/(view)/common/helper/routes";
import { signOutMember } from "@/app/(view)/common/helper/useAuth";
import type { SectionData, SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

export type { SectionData, SectionItem, SectionSpec, FieldSpec, FileKindName, ListSpec, ShowWhen, SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

/** What a section upload is; the server holds each to its own limits (images 10 MB, videos 20 MB, PDFs 25 MB, MP3s 20 MB). */
export type MediaKind = "image" | "video" | "document" | "audio";

/** How each kind of upload is named in messages. */
const MEDIA_LABELS: Record<MediaKind, string> = { image: "image", video: "video", document: "PDF", audio: "recording" };

/**
 * Calls an admin API. A 401 means the session is over: sign out and come back here after signing
 * in again. A 403 (not an admin) is left to the page, which says so; the member stays signed in.
 */
async function adminRequest<T>(url: string, options?: Parameters<typeof apiRequest>[1]): Promise<T> {
  try {
    return await apiRequest<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && typeof window !== "undefined") {
      await signOutMember();
      const back = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(back)}`);
    }
    throw error;
  }
}

export interface AdminUser {
  id: number;
  memberId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface SectionSummary {
  key: SiteSectionKey;
  /** ISO time of the last save; null while the section shows its original content. */
  updatedAt: string | null;
  isDefault: boolean;
}

export interface SectionContent extends SectionSummary {
  data: SectionData;
}

/** An event's pass (Annual Dinner, Golf Tournament), with how many were paid for and the money they took. */
export interface AdminEventPass {
  id: number;
  eventName: string;
  passId: string;
  tierTitle: string;
  title: string;
  label: string;
  description: string | null;
  batchEligibility: string | null;
  price: number;
  currency: string;
  /** Null: not limited. */
  totalQuantity: number | null;
  availableQuantity: number | null;
  status: "active" | "locked" | string;
  statusNote: string | null;
  displayOrder: number;
  updatedAt: string;
  paid: number;
  revenue: number;
}

/** What the admin can change on a pass. */
export interface EventPassChanges {
  label: string;
  description: string;
  batchEligibility: string;
  price: number;
  /** Null with availableQuantity: the pass is not limited. */
  totalQuantity: number | null;
  /** Maintained automatically by the database based on totalQuantity and paid bookings. */
  availableQuantity?: number | null;
  status: string;
  statusNote: string;
  displayOrder: number;
}

export type BookingStatus = "pending" | "paid" | "failed" | "cancelled";

export interface AdminBooking {
  id: number;
  orderId: string;
  eventName: string;
  passId: string;
  passLabel: string;
  memberId: string;
  fullName: string;
  email: string;
  mobile: string | null;
  spouseName: string | null;
  teachers: number;
  childrenUnder12: number;
  childrenAbove12: number;
  amount: number;
  currency: string;
  status: BookingStatus;
  oversold: boolean;
  paymentMode: string | null;
  trackingId: string | null;
  gatewayMessage: string | null;
  paidAt: string | null;
  /** Whether the pass has been emailed. */
  emailSent: boolean;
  createdAt: string;
}

export type PaymentStatus = BookingStatus;

/** A membership application and its payment. */
export interface AdminMembership {
  id: number;
  orderId: string;
  membershipType: string;
  fullName: string;
  batchYear: string;
  email: string;
  mobile: string;
  city: string;
  country: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMode: string | null;
  trackingId: string | null;
  gatewayMessage: string | null;
  /** Whether the member's account exists; made when the payment is confirmed. */
  hasAccount: boolean;
  paidAt: string | null;
  /** Whether the welcome email has gone. */
  emailSent: boolean;
  createdAt: string;
}

/** A contribution and its payment. */
export interface AdminContribution {
  id: number;
  orderId: string;
  fundLabel: string;
  units: number | null;
  unitLabel: string | null;
  donorName: string;
  batch: string | null;
  email: string;
  mobile: string;
  wants80g: boolean;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMode: string | null;
  trackingId: string | null;
  gatewayMessage: string | null;
  paidAt: string | null;
  /** Whether the thank-you email has gone. */
  emailSent: boolean;
  createdAt: string;
}

/** How many records are in each payment state, and what the paid ones came to. */
export interface PaymentSummary {
  all: number;
  counts: Record<PaymentStatus, number>;
  paidAmount: number;
}

/** One page of a records list, with how many match in all and the list's totals. */
export interface PagedList<T, S extends PaymentSummary = PaymentSummary> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  summary: S;
}

/** Which page of a list to fetch, and what to narrow it to. */
export interface ListQuery {
  page: number;
  status: string;
  q: string;
}

const listParams = ({ page, status, q }: ListQuery, extra: Record<string, string> = {}) =>
  new URLSearchParams({ ...extra, page: String(page), ...(status && { status }), ...(q.trim() && { q: q.trim() }) }).toString();

/** What a manual confirmation returns: the record as it now stands, and what happened to its email. */
export interface Confirmed<T> {
  data: T;
  message: string;
}

/** A contribution head (fund), with what has been given to it. */
export interface AdminFund {
  id: number;
  code: string;
  label: string;
  note: string | null;
  /** Set for a per-unit head (Sponsor a teacher); null when members choose the amount. */
  unitAmount: number | null;
  unitLabel: string | null;
  maxUnits: number | null;
  /** The amount members may choose, on a head without a unit price. */
  minAmount: number;
  maxAmount: number;
  status: "active" | "suspended" | string;
  sortOrder: number;
  updatedAt: string;
  /** Contributions of any status; a head with any cannot be deleted. */
  contributions: number;
  paid: number;
  raised: number;
}

export interface FundChanges {
  label: string;
  note: string;
  status: string;
  sortOrder: number;
  unitAmount: number | null;
  unitLabel: string | null;
  maxUnits: number | null;
  minAmount: number | null;
  maxAmount: number | null;
}

/** A head to add: its details, and whether members give any amount or pay per unit (fixed once added). */
export type NewFund = FundChanges & { kind: "amount" | "unit" };

export const adminService = {
  getMe: async (): Promise<AdminUser> => (await adminRequest<{ data: AdminUser }>("/api/sv/admin/me")).data,

  listSections: async (): Promise<SectionSummary[]> =>
    (await adminRequest<{ data: SectionSummary[] }>("/api/sv/admin/content")).data,

  getSection: async (key: SiteSectionKey): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`)).data,

  saveSection: async (key: SiteSectionKey, data: SectionData): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`, { method: "PUT", body: data })).data,

  /** One event's passes, e.g. "golf-tournament". */
  listPasses: async (event: string): Promise<AdminEventPass[]> =>
    (await adminRequest<{ data: AdminEventPass[] }>(`/api/sv/admin/event-passes?event=${encodeURIComponent(event)}`)).data,

  updatePass: async (id: number, changes: EventPassChanges): Promise<AdminEventPass> =>
    (await adminRequest<{ data: AdminEventPass }>(`/api/sv/admin/event-passes/${id}`, { method: "PATCH", body: changes })).data,

  /** One page of an event's bookings, newest first. */
  listBookings: (event: string, query: ListQuery): Promise<PagedList<AdminBooking, PaymentSummary & { oversold: number }>> =>
    adminRequest(`/api/sv/admin/event-pass-bookings?${listParams(query, { event })}`),

  /**
   * Marks an unpaid booking paid after the admin found the payment in the CCAvenue dashboard;
   * the member is emailed their pass.
   */
  confirmBooking: (orderId: string, reference: string): Promise<Confirmed<AdminBooking>> =>
    adminRequest(`/api/sv/admin/event-pass-bookings/${encodeURIComponent(orderId)}/confirm`, { method: "POST", body: { reference } }),

  /** One page of membership applications, newest first. */
  listMemberships: (query: ListQuery): Promise<PagedList<AdminMembership>> => adminRequest(`/api/sv/admin/memberships?${listParams(query)}`),

  /** Marks an unpaid application paid; the member's account is made and the welcome email sent. */
  confirmMembership: (orderId: string, reference: string): Promise<Confirmed<AdminMembership>> =>
    adminRequest(`/api/sv/admin/memberships/${encodeURIComponent(orderId)}/confirm`, { method: "POST", body: { reference } }),

  /** One page of contributions, newest first. */
  listContributions: (query: ListQuery): Promise<PagedList<AdminContribution>> => adminRequest(`/api/sv/admin/contributions?${listParams(query)}`),

  /** Marks an unpaid contribution paid; the thank-you email is sent. */
  confirmContribution: (orderId: string, reference: string): Promise<Confirmed<AdminContribution>> =>
    adminRequest(`/api/sv/admin/contributions/${encodeURIComponent(orderId)}/confirm`, { method: "POST", body: { reference } }),

  listFunds: async (): Promise<AdminFund[]> => (await adminRequest<{ data: AdminFund[] }>("/api/sv/admin/contribution-funds")).data,

  createFund: async (fund: NewFund): Promise<AdminFund> =>
    (await adminRequest<{ data: AdminFund }>("/api/sv/admin/contribution-funds", { method: "POST", body: fund })).data,

  updateFund: async (id: number, changes: FundChanges): Promise<AdminFund> =>
    (await adminRequest<{ data: AdminFund }>(`/api/sv/admin/contribution-funds/${id}`, { method: "PATCH", body: changes })).data,

  deleteFund: async (id: number): Promise<void> => {
    await adminRequest(`/api/sv/admin/contribution-funds/${id}`, { method: "DELETE" });
  },

  /**
   * Uploads an image, video, PDF or recording for a section; the address to use for it comes back. The file goes
   * straight to storage, at an address our API hands out (Vercel turns away request bodies over
   * 4.5 MB), and the API then checks it.
   */
  uploadMedia: async (key: SiteSectionKey, file: File, kind: MediaKind = "image"): Promise<string> => {
    const { data: upload } = await adminRequest<{ data: { uploadUrl: string; name: string; contentType: string } }>(
      "/api/sv/admin/media",
      { method: "POST", body: { section: key, kind, fileName: file.name, contentType: file.type, size: file.size } }
    );
    const sent = await fetch(upload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": upload.contentType, "cache-control": "public, max-age=31536000, immutable", "x-upsert": "false" },
      body: file,
    }).catch(() => null);
    if (!sent?.ok) {
      const message = `The ${MEDIA_LABELS[kind]} did not upload. Please check your connection and try again.`;
      throw new ApiError(message, sent?.status ?? 0, { [kind]: message });
    }
    const body = { section: key, kind, name: upload.name };
    return (await adminRequest<{ data: { url: string } }>("/api/sv/admin/media/confirm", { method: "POST", body })).data.url;
  },

  /** Deletes files uploaded for a save that then failed. The server keeps any a saved section uses. */
  discardMedia: async (key: SiteSectionKey, urls: string[]): Promise<void> => {
    await adminRequest("/api/sv/admin/media", { method: "DELETE", body: { section: key, urls } });
  },
};
