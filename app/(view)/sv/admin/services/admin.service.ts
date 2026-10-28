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

export const adminService = {
  getMe: async (): Promise<AdminUser> => (await adminRequest<{ data: AdminUser }>("/api/sv/admin/me")).data,

  listSections: async (): Promise<SectionSummary[]> =>
    (await adminRequest<{ data: SectionSummary[] }>("/api/sv/admin/content")).data,

  getSection: async (key: SiteSectionKey): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`)).data,

  saveSection: async (key: SiteSectionKey, data: SectionData): Promise<SectionContent> =>
    (await adminRequest<{ data: SectionContent }>(`/api/sv/admin/content/${encodeURIComponent(key)}`, { method: "PUT", body: data })).data,

  /** Uploads an image for a section; the address to use for it comes back. */
  uploadImage: async (key: SiteSectionKey, file: File): Promise<string> => {
    const form = new FormData();
    form.append("section", key);
    form.append("image", file);
    return (await adminRequest<{ data: { url: string } }>("/api/sv/admin/media", { method: "POST", body: form })).data.url;
  },
};
