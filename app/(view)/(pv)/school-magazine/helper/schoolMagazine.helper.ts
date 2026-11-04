import type { MagazineEdition } from '@/app/api/(features)/(pview)/site/schema/pageSections';

/** "1981-82" → "1980s"; "" when the edition has no year in it. */
const era = (year: string): string => {
  const match = year.match(/\d{4}/);
  return match ? `${match[0].slice(0, 3)}0s` : '';
};

export const schoolMagazineHelper = {
  era,

  /** The decades the editions cover, earliest first: the archive's filter chips. */
  eras: (editions: MagazineEdition[]): string[] =>
    [...new Set(editions.map((edition) => era(edition.year)).filter(Boolean))].sort(),

  /** "Showing 31 editions". */
  countLabel: (count: number) => `Showing ${count} ${count === 1 ? 'edition' : 'editions'}`,
};
