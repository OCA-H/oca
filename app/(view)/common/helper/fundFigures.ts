import type { HomeCause } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { FundProgress } from '@/app/api/(features)/sv/contribution/schema/contributionSchema';

// A cause's progress, from the paid contributions to its fund: the home page's OCA Social Conscience
// section, the OCA Social Conscience page and the Teachers Benevolent Fund page all show these.

/**
 * Format currency in Indian Rupees
 */
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/** What a featured cause's progress bar shows. `donors` is null when the figures were typed in. */
export interface CauseFigures {
  progress: number;
  raised: string;
  goal: string;
  donors: number | null;
}

/** "₹2,00,00,000" → 20000000; 0 when there is no number in it. */
const rupeesIn = (text: string): number => Number(String(text ?? '').replace(/[^\d]/g, '')) || 0;

/**
 * Live figures from paid contributions to the cause's fund (its code, else the fund labelled like
 * its title), plus anything raised offline. Falls back to the typed-in figures when no fund matches.
 */
export function causeFigures(cause: HomeCause, funds: FundProgress[]): CauseFigures {
  const code = cause.fund?.trim();
  const title = cause.title.trim().toLowerCase();
  const fund = code ? funds.find((f) => f.code === code) : funds.find((f) => f.label.trim().toLowerCase() === title);
  if (!code && !fund) {
    const progress = Math.max(0, Math.min(100, Number(cause.progress) || 0));
    return { progress, raised: cause.raised, goal: cause.goal, donors: null };
  }
  const raised = (fund?.raised ?? 0) + (Number(cause.offlineRaised) || 0);
  const goal = rupeesIn(cause.goal);
  return {
    progress: goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0,
    raised: formatINR(raised),
    goal: goal > 0 ? formatINR(goal) : '',
    donors: fund?.donors ?? 0,
  };
}
