import { ROUTES } from '@/app/(view)/common/helper/routes';

/** event_passes.event_name for the golf passes. */
export const GOLF_EVENT = 'golf-tournament';

/** A golf pass as the form shows it. */
export interface GolfPassOption {
  passId: string;
  title: string;
  label: string;
  /** The small line under the title, e.g. "Just you". */
  note: string | null;
  price: number;
  spouse: boolean;
  soldOut: boolean;
  locked: boolean;
}

/** Shown until the passes load from the server; the server's own prices are what is charged. */
export const GOLF_PASS_OPTIONS: GolfPassOption[] = [
  { passId: 'single', title: 'Single', label: 'OCA Golf Tournament · Single', note: 'Just you', price: 10000, spouse: false, soldOut: false, locked: false },
  { passId: 'couple', title: 'Couple', label: 'OCA Golf Tournament · Couple', note: 'You and your spouse', price: 12500, spouse: true, soldOut: false, locked: false },
];

export const golfTournamentContent = {
  tier: { title: 'OCA Golf Tournament', pill: '18 Dec · 11:30 am onwards' },
  dinner: {
    title: 'OCA Annual Dinner',
    pill: 'Complimentary',
    included: 'Included with every golf pass',
    desc: 'No separate ticket needed. Your dinner entry comes with the pass, on the same day.',
    tag: 'Included',
    line: 'OCA Annual Dinner entry',
  },
  locked: {
    title: 'Opens later',
    desc: 'Golf passes are not open for booking yet. Pricing is shown when they open.',
    tag: 'Not open yet',
  },
  note: 'Buying the OCA Golf Tournament pass automatically includes entry to the OCA Annual Dinner. Both events are on 18 December, so your dinner entry is complimentary.',
  emptyText: 'Choose Single or Couple above to see your total.',
  lock: {
    description:
      'Become a member or sign in to buy the pass. Passes for the OCA Golf Tournament are reserved exclusively for Old Columbans and their spouses.',
    redirect: ROUTES.GOLF_TOURNAMENT_PASSES,
    perks: ['Single or Couple pass', 'OCA Annual Dinner entry included', 'Tee off from 11:30 am'],
  },
};
