'use client';

import React from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { GolfGlancePrice } from '../../helper/golfTournament.helper';
import { GolfIcon } from './GolfIcon';

const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/** A pass's price, or "Opens later" while it is locked. */
const GlancePrice: React.FC<{ price: GolfGlancePrice }> = ({ price }) =>
  price.open ? <em>{rupees(price.price)}</em> : <em className="dn-muted">Opens later</em>;

interface GolfTournamentAboutProps {
  /** Single and Couple as priced in the admin panel (Passes → Golf passes & seats). */
  prices: Record<'single' | 'couple', GolfGlancePrice>;
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const GolfTournamentAbout: React.FC<GolfTournamentAboutProps> = ({ prices, onScrollToAnchor }) => {
  return (
    <section className="content-section">
      <div className="wrap split-2">
        <div>
          <div className="section-head stack" style={{ marginBottom: '20px' }}>
            <span className="eyebrow">One pass, two events</span>
            <h2>Play the day. Stay for the dinner.</h2>
          </div>
          <div className="prose">
            <p>
              On 18 December, Columbans take to the course for the <strong>OCA Golf Tournament</strong>, starting at
              11:30 am. When the golf is done, the rest of the day is already sorted: your pass also gets you into the{' '}
              <strong>OCA Annual Dinner</strong>, held the same day, at no extra cost.
            </p>
            <p>
              Playing on your own? Choose Single at {rupees(prices.single.price)}. Coming as a couple? The Couple pass is{' '}
              {rupees(prices.couple.price)}.
            </p>
          </div>
        </div>
        <aside className="dn-glance" aria-label="Your pass at a glance">
          <h3>Your pass at a glance</h3>
          <ul>
            <li className="tier-yb">
              <span className="dn-g-ico">
                <GolfIcon name="person" />
              </span>
              <span className="dn-g-t">
                <b>Single</b>
                <small>OCA Golf Tournament</small>
              </span>
              <GlancePrice price={prices.single} />
            </li>
            <li className="tier-eb">
              <span className="dn-g-ico">
                <GolfIcon name="couple" />
              </span>
              <span className="dn-g-t">
                <b>Couple</b>
                <small>OCA Golf Tournament</small>
              </span>
              <GlancePrice price={prices.couple} />
            </li>
            <li className="tier-gold">
              <span className="dn-g-ico">
                <GolfIcon name="dinner" />
              </span>
              <span className="dn-g-t">
                <b>Annual Dinner</b>
                <small>Same day &middot; with every pass</small>
              </span>
              <em>Included</em>
            </li>
          </ul>
          <a className="btn btn-primary" href={ROUTES.GOLF_TOURNAMENT_PASSES} onClick={onScrollToAnchor('passes')}>
            Choose your pass
          </a>
        </aside>
      </div>
    </section>
  );
};

export default GolfTournamentAbout;
