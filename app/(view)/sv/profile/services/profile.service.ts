import { ApiError, apiRequest } from "@/app/(view)/common/services/api.service";
import { ROUTES } from "@/app/(view)/common/helper/routes";
import { signOutMember } from "@/app/(view)/common/helper/useAuth";

/**
 * Calls a members-area API. A 401 (session expired, or the account is gone) or 403 (account
 * deactivated) means this session is finished: the cookie is cleared first, or the proxy would
 * bounce sign-in straight back here, then the member signs in and returns to the same panel.
 */
async function svRequest<T>(url: string, options?: Parameters<typeof apiRequest>[1]): Promise<T> {
  try {
    return await apiRequest<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403) && typeof window !== "undefined") {
      await signOutMember();
      const back = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(back)}`);
    }
    throw error;
  }
}

export interface ProfileAddress {
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Contact fields the member signed in with, which stay read-only in My Account. */
export type LockedField = "email" | "mobile";

export interface MemberProfile {
  id: number;
  memberId: string;
  fullName: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  batchYear: string | null;
  house: string | null;
  membershipType: string;
  status: string;
  avatarUrl: string | null;
  address: ProfileAddress;
  lockedFields: LockedField[];
}

export interface MembershipCard {
  memberId: string;
  name: string;
  membershipType: string;
  batchYear: string | null;
  house: string | null;
  status: string;
  /** "For life", or null when the membership type has no fixed term on record. */
  validity: string | null;
  /** ISO date. */
  memberSince: string;
  payment: {
    orderId: string;
    amount: number;
    currency: string;
    paidAt: string | null;
    paymentMode: string | null;
  } | null;
}

export type ProfileUpdate = Pick<
  MemberProfile,
  "title" | "firstName" | "middleName" | "lastName" | "email" | "mobile" | "address"
> & { batchYear: string };

export const profileService = {
  getProfile: async (): Promise<MemberProfile> => {
    const json = await svRequest<{ data: MemberProfile }>("/api/sv/profile");
    return json.data;
  },

  getCard: async (): Promise<MembershipCard> => {
    const json = await svRequest<{ data: MembershipCard }>("/api/sv/profile/card");
    return json.data;
  },

  updateProfile: async (update: ProfileUpdate): Promise<MemberProfile> => {
    const json = await svRequest<{ data: MemberProfile }>("/api/sv/profile", { method: "PATCH", body: update });
    return json.data;
  },

  changePassword: async (current: string, next: string): Promise<void> => {
    await svRequest("/api/sv/profile/password", { method: "POST", body: { current, new: next } });
  },

  sendSuggestion: async (subject: string, message: string): Promise<void> => {
    await svRequest("/api/sv/profile/suggestion", { method: "POST", body: { subject, message } });
  },
};
