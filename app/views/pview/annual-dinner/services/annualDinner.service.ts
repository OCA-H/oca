export interface ApiEventPass {
  id: number;
  eventName: string;
  passId: string;
  tierGroup: string;
  tierTitle: string;
  title: string;
  label: string;
  description: string | null;
  batchEligibility: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  totalQuantity: number | null;
  availableQuantity: number | null;
  includesSpouse: boolean;
  allowsChildren: boolean;
  allowsTeacherSponsorship: boolean;
  status: string;
  statusNote: string | null;
  displayOrder: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export const annualDinnerService = {
  getPasses: async (eventName: string = 'annual-dinner'): Promise<ApiEventPass[]> => {
    try {
      const response = await fetch(`/api/event-pass?eventName=${encodeURIComponent(eventName)}`);
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  submitPassBooking: async (data: unknown) => {
    return { success: true, data };
  },
};
