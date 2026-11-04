'use client';

import React from 'react';
import type { MagazineEdition } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { schoolMagazineContent as text } from '../../content';
import { useSchoolMagazineHandler } from '../../handler';
import { schoolMagazineHelper } from '../../helper';
import { MagazineCard } from './MagazineCard';

/** Every edition, with chips to show one decade at a time. */
export const MagazineArchive: React.FC<{ editions: MagazineEdition[] }> = ({ editions }) => {
  const { eras, filter, setFilter, shown } = useSchoolMagazineHandler(editions);
  return (
    <>
      <div className="mag-toolbar">
        <div className="mag-chips" role="group" aria-label={text.filterAria}>
          {eras.map((era) => (
            <button type="button" key={era} className={`mag-chip${filter === era ? ' active' : ''}`} aria-pressed={filter === era} onClick={() => setFilter(era)}>
              {era}
            </button>
          ))}
        </div>
        <span className="mag-count" aria-live="polite">
          {schoolMagazineHelper.countLabel(shown.length)}
        </span>
      </div>
      <div className="mag-grid">
        {shown.map((edition, i) => (
          <MagazineCard key={`${i}-${edition.year}-${edition.href}`} year={edition.year} image={edition.image} href={edition.href} />
        ))}
      </div>
    </>
  );
};

export default MagazineArchive;
