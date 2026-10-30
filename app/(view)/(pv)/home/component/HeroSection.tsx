import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { HomeTickerContent, HomeTickerItem } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

/** Where today's birthday line goes among the admin's ticker lines. */
const BIRTHDAY_LINE_AT = 2;

/**
 * `ticker` is what admins set in the admin panel (Home page → Live ticker). `birthdayCount` is how
 * many members have their birthday today; the ticker leaves that line out when none do.
 */
export const HeroSection: React.FC<{ ticker: HomeTickerContent; birthdayCount: number }> = ({ ticker, birthdayCount }) => {
  const lines: HomeTickerItem[] = [...ticker.items];
  if (birthdayCount > 0) {
    lines.splice(BIRTHDAY_LINE_AT, 0, {
      label: 'Today:',
      text: `${birthdayCount} ${birthdayCount === 1 ? 'Columban is' : 'Columbans are'} celebrating their birthday — send your wishes`,
    });
  }
  // Rendered twice so the strip can loop without a visible jump.
  const track = [...lines, ...lines];

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div>
          <span className="hero-est">★ Serving Columbans since 1941</span>
          <h1><span className="nowrap-line">One school. One brotherhood.</span><br /><span style={{ color: "var(--gold)" }}>A lifetime of belonging.</span></h1>
          <p className="lead">OCA's mission is to praise, promote and protect St. Columba's School and its students, and to unite, inform and involve alumni and friends in fellowship and support of each other and the school.</p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href={ROUTES.MEMBERSHIP}>Become a Member</Link>
            <Link className="btn btn-secondary" href={ROUTES.HOME_EVENTS}>Explore Events &amp; Connect</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-crest-frame">
            <svg className="hero-rings" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="180" cy="180" r="176" stroke="rgba(201,162,39,.35)" strokeWidth="1"/>
              <circle cx="180" cy="180" r="140" stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
            </svg>
            <img 
              className="hero-crest-img" 
              src="/images/oca-crest.png" 
              alt="Old Columbans Association crest" 
            />
          </div>
        </div>
      </div>
      <div className="hero-ticker">
        <div className="wrap">
          <span className="tick-label">{ticker.badge}</span>
          <div style={{ overflow: "hidden", flex: "1" }}>
            <div className="ticker-track">
              {track.map((line, idx) => (
                <span key={idx} aria-hidden={idx >= lines.length || undefined}>
                  {line.label && <strong>{line.label}</strong>} {line.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
