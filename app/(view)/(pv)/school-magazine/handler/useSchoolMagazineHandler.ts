'use client';

import { useMemo, useState } from 'react';
import type { MagazineEdition } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { schoolMagazineHelper } from '../helper';

/** "All", or a decade such as "1980s". */
export const ALL_ERAS = 'All';

/** The archive's decade filter: which chip is on, and the editions it shows. */
export function useSchoolMagazineHandler(editions: MagazineEdition[]) {
  const [filter, setFilter] = useState<string>(ALL_ERAS);
  const eras = useMemo(() => [ALL_ERAS, ...schoolMagazineHelper.eras(editions)], [editions]);
  const shown = useMemo(
    () => (filter === ALL_ERAS ? editions : editions.filter((edition) => schoolMagazineHelper.era(edition.year) === filter)),
    [editions, filter]
  );
  return { eras, filter, setFilter, shown };
}

export default useSchoolMagazineHandler;
