import { donationFundHref } from '@/app/(view)/common/helper/routes';
import type { HomeCause } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

/** The badge colours of the muted causes' cards, in turn. */
const MUTED_PILLS = ['navy', 'teal'] as const;

export const socialConscienceHelper = {
  /**
   * Where a cause's Donate button goes: its link, with its fund chosen on the contribution form
   * when the link is the form and the cause has a fund. Empty when the cause has no link.
   */
  contributeHref: (cause: HomeCause): string => {
    const href = cause.ctaHref?.trim() ?? '';
    const fund = cause.fund?.trim();
    if (fund && href.startsWith('/donation') && !href.includes('fund=')) return donationFundHref(fund);
    return href;
  },

  mutedPill: (index: number) => MUTED_PILLS[index % MUTED_PILLS.length],
};
