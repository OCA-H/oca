export interface MemberSearchQuery {
  batch?: string;
  name?: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  batch?: string;
  message: string;
}

export async function searchBatchmates(query: MemberSearchQuery) {
  // Mock endpoint or service adapter
  return {
    success: true,
    results: [],
  };
}

export async function submitContactInquiry(payload: ContactFormPayload) {
  return {
    success: true,
    message: 'Thank you. Your message has been sent to the OCA Secretariat.',
  };
}
