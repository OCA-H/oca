'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/route';

interface AnnualDinnerCTAProps {
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const AnnualDinnerCTA: React.FC<AnnualDinnerCTAProps> = ({ onScrollToAnchor }) => {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div>
          <span className="eyebrow">Save your seat</span>
          <h2 className="one-line">Don&rsquo;t miss the Dinner</h2>
          <p>
            Friday, 18 December, at the Qutub Golf Course. Passes are limited &mdash; reserve yours before they&rsquo;re
            gone.
          </p>
        </div>
        <div className="cta-band-actions">
          <a className="btn btn-gold" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={onScrollToAnchor('passes')}>
            Get your pass
          </a>
          <Link className="btn btn-secondary" href={ROUTES.ANNUAL_LUNCH}>
            See the Annual Lunch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnnualDinnerCTA;
