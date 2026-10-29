import { ApiError, apiRequest } from "@/app/(view)/common/services/api.service";
import { ROUTES } from "@/app/(view)/common/helper/routes";
import { signOutMember } from "@/app/(view)/common/helper/useAuth";
import type { SectionData, SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

export type { SectionData, SectionItem, SectionSpec, FieldSpec, ListSpec, SiteSectionKey } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";

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

/** An Annual Dinner pass, with how many were paid for and the money they took. */
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
  totalQuantity: number;
  availableQuantity: number;
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
  createdAt: string;
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
  maxUnits: number | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export const adminService = {
  getMe: async (): Promise<AdminUser> => (await adminRequest<{ data: AdminUser }>("/api/sv/admin/me")).data,

  listSections: async (): Promise<SectionSummary[]> =>
    (await adminRequest<{ data: SectionSummary[] }>("/api/sv/admin/content")).data,

  getSection: async (key: SiteSectionKey): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`)).data,

  saveSection: async (key: SiteSectionKey, data: SectionData): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`, { method: "PUT", body: data })).data,

  listPasses: async (): Promise<AdminEventPass[]> =>
    (await adminRequest<{ data: AdminEventPass[] }>("/api/sv/admin/event-passes")).data,

  updatePass: async (id: number, changes: EventPassChanges): Promise<AdminEventPass> =>
    (await adminRequest<{ data: AdminEventPass }>(`/api/sv/admin/event-passes/${id}`, { method: "PATCH", body: changes })).data,

  listBookings: async (): Promise<AdminBooking[]> =>
    (await adminRequest<{ data: AdminBooking[] }>("/api/sv/admin/event-pass-bookings")).data,

  listFunds: async (): Promise<AdminFund[]> => (await adminRequest<{ data: AdminFund[] }>("/api/sv/admin/contribution-funds")).data,

  updateFund: async (id: number, changes: FundChanges): Promise<AdminFund> =>
    (await adminRequest<{ data: AdminFund }>(`/api/sv/admin/contribution-funds/${id}`, { method: "PATCH", body: changes })).data,

  deleteFund: async (id: number): Promise<void> => {
    await adminRequest(`/api/sv/admin/contribution-funds/${id}`, { method: "DELETE" });
  },

  /** Uploads an image for a section; the address to use for it comes back. */
  uploadImage: async (key: SiteSectionKey, file: File): Promise<string> => {
    const form = new FormData();
    form.append("section", key);
    form.append("image", file);
    return (await adminRequest<{ data: { url: string } }>("/api/sv/admin/media", { method: "POST", body: form })).data.url;
  },
};
