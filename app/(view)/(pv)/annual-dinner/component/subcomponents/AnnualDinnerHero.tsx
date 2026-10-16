'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/route';

interface AnnualDinnerHeroProps {
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const AnnualDinnerHero: React.FC<AnnualDinnerHeroProps> = ({ onScrollToAnchor }) => {
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <span>Events</span>
          <span className="sep">/</span>
          <span>Annual Dinner Get Together</span>
        </div>
      </nav>

      <section className="page-hero dn-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Save the date</span>
            <h1>OCA Annual Dinner</h1>
            <p className="lead">
              One evening, every batch. Come for the reunion, stay for the stories &mdash; the Columban family is
              gathering at the Qutub Golf Course.
            </p>
            <div className="page-hero-actions">
              <a className="btn btn-primary" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={onScrollToAnchor('passes')}>
                Get your pass
              </a>
              <a className="btn btn-secondary" href={ROUTES.ANNUAL_DINNER_DETAILS} onClick={onScrollToAnchor('details')}>
                See the details
              </a>
            </div>
          </div>
          <div className="page-hero-media">
            <figure className="dn-poster">
              <img
                src="/images/annual-dinner-poster.jpg"
                alt="Save the date: OCA Annual Dinner, 18th December, Qutub Golf Course. A poster with the OCA crest and an illustration of the St. Columba’s School building."
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Key facts ---------- */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3" id="details">
          <div className="fact">
            <div className="fact-num">18 December</div>
            <div className="fact-lbl">Friday, 2026</div>
          </div>
          <div className="fact">
            <div className="fact-num fact-num--text">Qutub Golf Course</div>
            <div className="fact-lbl">New Delhi</div>
          </div>
          <div className="fact">
            <div className="fact-num">&#8377;2,500</div>
            <div className="fact-lbl">Passes from &mdash; limited numbers</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnualDinnerHero;
