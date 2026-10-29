import { apiRequest } from '@/app/(view)/common/services/api.service';

export interface MemberSearchQuery {
  batch?: string;
  name?: string;
}

/** The "Get in touch" form, as POST /api/contact takes it. */
export interface ContactFormPayload {
  name: string;
  email: string;
  batch: string;
  phone: string;
  subject: string;
  message: string;
  /** Hidden from people; only bots fill it, and the server then sends nothing. */
  website: string;
}

export async function searchBatchmates(query: MemberSearchQuery) {
  // Mock endpoint or service adapter
  return {
    success: true,
    results: [],
  };
}

/** Emails the message to the Secretariat, and a copy to the sender. Throws an ApiError if it fails. */
export async function submitContactInquiry(payload: ContactFormPayload): Promise<{ message: string }> {
  return apiRequest<{ ok: true; message: string }>('/api/contact', { method: 'POST', body: payload });
}
