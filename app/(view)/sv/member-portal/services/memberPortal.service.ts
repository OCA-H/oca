export interface MemberProfile {
  id: number;
  memberId: string;
  email: string;
  mobile?: string | null;
  fullName: string;
  role: string;
  batchYear?: string | null;
  house?: string | null;
  membershipType: string;
  status: string;
  avatarUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export const memberPortalService = {
  getProfile: async (): Promise<MemberProfile> => {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || "Failed to load member profile.");
    }

    return json.data as MemberProfile;
  },

  signOut: async (): Promise<void> => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  },
};
