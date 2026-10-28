'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { EventDinnerContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

interface AnnualDinnerHeroProps {
  content: EventDinnerContent;
  onScrollToAnchor: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const AnnualDinnerHero: React.FC<AnnualDinnerHeroProps> = ({ content, onScrollToAnchor }) => {
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
            {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
            <h1>{content.title}</h1>
            {content.lead && <p className="lead">{content.lead}</p>}
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
              <img src={content.image} alt={content.imageAlt} />
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Key facts ---------- */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3" id="details">
          <div className="fact">
            <div className="fact-num">{content.date}</div>
            {content.dateDetail && <div className="fact-lbl">{content.dateDetail}</div>}
          </div>
          <div className="fact">
            <div className="fact-num fact-num--text">{content.venue}</div>
            {content.venueDetail && <div className="fact-lbl">{content.venueDetail}</div>}
          </div>
          <div className="fact">
            <div className="fact-num">{content.priceFact}</div>
            {content.priceDetail && <div className="fact-lbl">{content.priceDetail}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnualDinnerHero;
