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

/** Why a free amount cannot be paid into this fund, or null when it can. The fund's limits are set in the admin panel. */
export function amountError(fund: ContributionFund, amount: number): string | null {
  if (!Number.isInteger(amount) || amount < fund.minAmount) {
    return `Enter a whole amount of at least ${formatCurrency(fund.minAmount)}.`;
  }
  if (amount > fund.maxAmount) {
    return `The most you can give online is ${formatCurrency(fund.maxAmount)}. For a larger contribution, please write to the Secretariat.`;
  }
  return null;
}
