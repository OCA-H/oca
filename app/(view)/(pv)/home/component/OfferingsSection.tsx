import React from 'react';
import type { HomeNoticesContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

/** The OCA Notice Board: News & Notices. */
export const OfferingsSection: React.FC<{ content: HomeNoticesContent }> = ({ content }) => {
  return (
    <section className="section tint-teal" id="notices" style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
            <h2>{content.title}</h2>
            {content.intro && <p>{content.intro}</p>}
          </div>
          {content.updatedLabel && <span className="pill live">{content.updatedLabel}</span>}
        </div>
    
        <div className="notice-carousel-wrap">
          <button className="notice-nav prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
    
          <div className="notice-cards" id="noticeCards">
            {content.items.map((notice, i) => (
              <article className="notice-card" key={`${i}-${notice.title}`}>
                <div className={`notice-card-media photo-tile ${toneAt(i)}`}>
                  <img className="tile-img" src={notice.image} alt={notice.imageAlt} loading="lazy" decoding="async" />
                  <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
                </div>
                <div className="notice-card-body">
                  {notice.date && <div className="notice-card-date">{notice.date}</div>}
                  <h4 className="notice-card-title">{notice.title}</h4>
                  {notice.href && <SiteLink className="qa-link" href={notice.href}>Read more →</SiteLink>}
                </div>
              </article>
            ))}
          </div>
    
          <button className="notice-nav next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
