import { causeFigures, type CauseFigures } from '@/app/(view)/common/helper/fundFigures';
import type { HomeCause } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { FundProgress } from '@/app/api/(features)/sv/contribution/schema/contributionSchema';

export const teachersFundHelper = {
  /**
   * The fund's live figures, worked out exactly as the causes' are, so this page, the home page and
   * the OCA Social Conscience page always agree. The cause is the one with this fund code, else the
   * one titled like the page (a cause saved without a fund code is matched to its fund by title).
   * Without such a cause: the online total of the fund alone, with no goal.
   */
  figures: (fund: string, title: string, causes: HomeCause[], funds: FundProgress[]): CauseFigures => {
    const code = fund.trim();
    const name = title.trim().toLowerCase();
    const cause = causes.find((c) => code && c.fund?.trim() === code) ?? causes.find((c) => c.title.trim().toLowerCase() === name);
    if (cause) return causeFigures(cause, funds);
    return causeFigures(
      { status: 'featured', image: '', imageAlt: '', badge: '', title, desc: '', fund: code, offlineRaised: 0, progress: 0, raised: '', goal: '', href: '', ctaHref: '' },
      funds
    );
  },

  /** (a), (b), (c)… for the committee members, in order. */
  letter: (index: number) => `(${String.fromCharCode(97 + (index % 26))})`,

  /** 01, 02, 03… for the rules. */
  number: (index: number) => String(index + 1).padStart(2, '0'),
};
