export interface SignInResponse {
  ok: boolean;
  message?: string;
  error?: string;
  data?: {
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
  };
}

export const memberSignInService = {
  login: async (credentials: { user: string; pass: string }): Promise<SignInResponse> => {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || "Sign in failed. Please verify your details.");
    }

    return json as SignInResponse;
  },
};
