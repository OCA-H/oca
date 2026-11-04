import { apiRequest } from '@/app/(view)/common/services/api.service';

/** The "Have them sent to you" form. */
export interface EmailUpdateRequest {
  name: string;
  email: string;
  batch: string;
  /** Hidden from people; only bots fill it, and the server then sends nothing. */
  website: string;
}

export const newslettersService = {
  /**
   * Asks the Secretariat to update the member's email on the roll. Goes through the contact form's
   * API (POST /api/contact), which checks the details, limits how often it can be used, emails the
   * Secretariat and sends the member a copy.
   */
  requestEmailUpdate: (request: EmailUpdateRequest): Promise<{ message: string }> =>
    apiRequest<{ ok: true; message: string }>('/api/contact', {
      method: 'POST',
      body: {
        name: request.name,
        email: request.email,
        batch: request.batch,
        phone: '',
        subject: 'Please update my email for OCA notices',
        message: [
          'Please send OCA notices and newsletters to this email address, and update it on the membership roll.',
          '',
          `Name: ${request.name.trim()}`,
          `Email: ${request.email.trim()}`,
          `Batch year: ${request.batch.trim() || 'not given'}`,
        ].join('\n'),
        website: request.website,
      },
    }),
};
