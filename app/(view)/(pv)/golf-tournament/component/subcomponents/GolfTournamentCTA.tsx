'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';

interface GolfTournamentCTAProps {
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const GolfTournamentCTA: React.FC<GolfTournamentCTAProps> = ({ onScrollToAnchor }) => {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div>
          <span className="eyebrow">Save your place</span>
          <h2 className="one-line">See you on the course</h2>
          <p>Friday, 18 December, from 11:30 am. Your pass includes the OCA Annual Dinner.</p>
        </div>
        <div className="cta-band-actions">
          <a className="btn btn-gold" href={ROUTES.GOLF_TOURNAMENT_PASSES} onClick={onScrollToAnchor('passes')}>
            Get your pass
          </a>
          <Link className="btn btn-secondary" href={ROUTES.ANNUAL_DINNER}>
            See the Annual Dinner
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GolfTournamentCTA;
