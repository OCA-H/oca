'use client';

import React from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';

interface AnnualDinnerAboutProps {
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const AnnualDinnerAbout: React.FC<AnnualDinnerAboutProps> = ({ onScrollToAnchor }) => {
  return (
    <section className="content-section">
      <div className="wrap split-2">
        <div>
          <div className="section-head stack" style={{ marginBottom: '20px' }}>
            <span className="eyebrow">A Columban tradition</span>
            <h2>One evening, every batch, one brotherhood</h2>
          </div>
          <div className="prose">
            <p>
              Once a year, the Old Columbans Association brings Columbans of every decade to the same table &mdash;
              the Class of &rsquo;68 and the Class of 2018 alike. This December, the evening belongs to us: the{' '}
              <strong>OCA Annual Dinner</strong>, at the Qutub Golf Course on Friday, 18 December.
            </p>
            <p>
              Bring the stories you still tell, and the friends who tell them back to you. Whether you left St.
              Columba&rsquo;s last year or last century, there is a seat at the table with your name on it.
            </p>
          </div>
        </div>
        <aside className="dn-glance" aria-label="Passes at a glance">
          <h3>Passes at a glance</h3>
          <ul>
            <li className="tier-yb">
              <span className="dn-g-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="m12 4 10 5-10 5L2 9l10-5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <span className="dn-g-t">
                <b>Younger Batches</b>
                <small>Batch 2015&ndash;25 only</small>
              </span>
              <em>from &#8377;2,500</em>
            </li>
            <li className="tier-eb">
              <span className="dn-g-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="dn-g-t">
                <b>Early Bird</b>
                <small>All batches</small>
              </span>
              <em>from &#8377;3,500</em>
            </li>
            <li className="tier-reg">
              <span className="dn-g-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 7v5l3.2 2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="dn-g-t">
                <b>Regular</b>
                <small>All batches &middot; opens after Early Bird</small>
              </span>
              <em className="dn-muted">Opens later</em>
            </li>
            <li className="tier-gold">
              <span className="dn-g-ico">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="dn-g-t">
                <b>Golden Pass</b>
                <small>All batches &middot; with spouse</small>
              </span>
              <em>&#8377;15,000</em>
            </li>
          </ul>
          <a className="btn btn-primary" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={onScrollToAnchor('passes')}>
            Choose your pass
          </a>
        </aside>
      </div>
    </section>
  );
};

export default AnnualDinnerAbout;
