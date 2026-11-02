export function formatRupees(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/** One tier's row in "Passes at a glance". */
export interface DinnerGlanceTier {
  /** The small line under the tier's name, e.g. "Batch 2015–25 only". */
  detail: string;
  /** "from ₹2,500", "₹15,000", or "Opens later" while every pass in the tier is locked. */
  price: string;
  isOpen: boolean;
}

export type DinnerGlanceGroup = 'younger' | 'early' | 'regular' | 'golden';

/** What the box shows when the passes could not be read: the seeded passes. */
const GLANCE_FALLBACK: Record<DinnerGlanceGroup, DinnerGlanceTier> = {
  younger: { detail: 'Batch 2015–25 only', price: 'from ₹2,500', isOpen: true },
  early: { detail: 'All batches', price: 'from ₹3,500', isOpen: true },
  regular: { detail: 'All batches · opens after Early Bird', price: 'Opens later', isOpen: false },
  golden: { detail: 'All batches · with spouse', price: '₹15,000', isOpen: true },
};

/**
 * Each tier's row in "Passes at a glance", from the passes as set in the admin panel (Passes →
 * Dinner passes & seats): the lowest open price, "from" when the tier has more than one.
 */
export function dinnerGlance(
  passes: { tierGroup: string; batchEligibility: string | null; price: number; status: string }[]
): Record<DinnerGlanceGroup, DinnerGlanceTier> {
  const tier = (group: DinnerGlanceGroup): DinnerGlanceTier => {
    const inTier = passes.filter((p) => p.tierGroup === group);
    if (inTier.length === 0) return GLANCE_FALLBACK[group];
    const detail = inTier[0].batchEligibility ?? GLANCE_FALLBACK[group].detail;
    const open = inTier.filter((p) => p.status === 'active');
    if (open.length === 0) return { detail, price: 'Opens later', isOpen: false };
    const lowest = Math.min(...open.map((p) => p.price));
    return { detail, price: `${open.length > 1 ? 'from ' : ''}${formatRupees(lowest)}`, isOpen: true };
  };
  return { younger: tier('younger'), early: tier('early'), regular: tier('regular'), golden: tier('golden') };
}
