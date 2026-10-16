export interface PassTier {
  id: 'yb-single' | 'yb-spouse' | 'eb-single' | 'eb-spouse' | 'golden';
  label: string;
  price: number;
  group: 'younger' | 'early' | 'golden';
  spouse: boolean;
}

export const PASS_OPTIONS: Record<string, PassTier> = {
  'yb-single': { id: 'yb-single', label: 'Younger Batches · Single', price: 2500, group: 'younger', spouse: false },
  'yb-spouse': { id: 'yb-spouse', label: 'Younger Batches · With spouse', price: 4000, group: 'younger', spouse: true },
  'eb-single': { id: 'eb-single', label: 'Early Bird · Single', price: 3500, group: 'early', spouse: false },
  'eb-spouse': { id: 'eb-spouse', label: 'Early Bird · With spouse', price: 5000, group: 'early', spouse: true },
  'golden': { id: 'golden', label: 'Golden Pass · With spouse', price: 15000, group: 'golden', spouse: true },
};

export const TEACHER_PRICE = 5000;
export const UNDER12_PRICE = 2500;
export const ABOVE12_PRICE = 3000;

export const annualDinnerContent = {
  title: 'OCA Annual Dinner',
  eyebrow: 'Save the date',
  lead: 'One evening, every batch. Come for the reunion, stay for the stories — the Columban evening of the year.',
  date: 'Friday, 18 December 2026',
  venue: 'Qutub Golf Course, New Delhi',
};
