import type { HomeCause } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { FundProgress } from '@/app/api/(features)/sv/contribution/schema/contributionSchema';

/**
 * Helper to get initial letters for fallback avatars
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Format currency in Indian Rupees
 */
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/** "1988" → "Batch '88" */
export function formatBatch(batchYear: string | null): string {
  return batchYear ? `Batch '${batchYear.slice(-2)}` : 'Old Columban';
}

/** Gmail's compose screen on the web, with the member's address and a birthday wish filled in. */
export function birthdayWishGmailUrl(email: string, name: string, senderName?: string): string {
  const firstName = name.split(' ')[0] || name;
  const subject = `Happy Birthday, ${firstName}!`;
  const body = [
    `Dear ${firstName},`,
    '',
    'Wishing you a very happy birthday! May the year ahead bring you good health, happiness and success.',
    '',
    'Warm wishes from a fellow Columban,',
    senderName || '',
  ].join('\n');
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email, su: subject, body });
  return `https://mail.google.com/mail/?${params}`;
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
