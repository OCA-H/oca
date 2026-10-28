import type { ContributionFund } from '../services/donation.service';

export function formatCurrency(amount: number): string {
  const n = isNaN(amount) ? 0 : amount;
  return `₹${n.toLocaleString('en-IN')}`;
}

/** What the member pays: units × unit price on a per-unit fund, else the amount they chose. */
export function calculateAmount(fund: ContributionFund | null, amount: number, units: number): number {
  if (fund?.unitAmount) return (units || 1) * fund.unitAmount;
  return amount;
}

/** "1 teacher", "3 teachers": the choices for a per-unit fund. */
export function unitOptions(fund: ContributionFund): string[] {
  return Array.from({ length: fund.maxUnits ?? 1 }, (_, i) => String(i + 1));
}
