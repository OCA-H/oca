import type { ApiEventPass } from '@/app/(view)/(pv)/annual-dinner/services/annualDinner.service';
import type { PassPrice } from '@/app/api/(features)/(pview)/event-pass/services/passPrices';
import { GOLF_PASS_OPTIONS, type GolfPassOption } from '../content/golfTournament.content';

/** A golf pass from the server, as the form shows it. */
export const toGolfPassOption = (pass: ApiEventPass): GolfPassOption => ({
  passId: pass.passId,
  title: pass.title,
  label: pass.label,
  note: pass.statusNote,
  price: pass.price,
  spouse: pass.includesSpouse,
  soldOut: pass.availableQuantity === 0,
  locked: pass.status !== 'active',
});

/** A pass's price in the "at a glance" box; open is false while the pass is locked. */
export interface GolfGlancePrice {
  price: number;
  open: boolean;
}

/**
 * Single and Couple as priced in the admin panel (Passes → Golf passes & seats), falling back to the
 * built-in prices when the passes could not be read.
 */
export const golfGlancePrices = (passes: PassPrice[]): Record<'single' | 'couple', GolfGlancePrice> => {
  const priceOf = (passId: 'single' | 'couple'): GolfGlancePrice => {
    const pass = passes.find((p) => p.passId === passId);
    if (pass) return { price: pass.price, open: pass.status === 'active' };
    return { price: GOLF_PASS_OPTIONS.find((p) => p.passId === passId)?.price ?? 0, open: true };
  };
  return { single: priceOf('single'), couple: priceOf('couple') };
};
