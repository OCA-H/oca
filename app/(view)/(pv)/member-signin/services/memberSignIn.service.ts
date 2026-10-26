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

  requestPasswordReset: async (identifier: string): Promise<string> => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || 'We could not send the reset email. Please try again.');
    }
    return json.message as string;
  },

  resetPassword: async (token: string, password: string): Promise<string> => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      throw new Error(json?.fields?.password || json?.error || 'We could not change your password. Please try again.');
    }
    return json.message as string;
  },
};
