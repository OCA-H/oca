import React from 'react';
import type { HomeSpotlightContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink } from './SiteLink';

/** In the spotlight: Columban Newsmakers. */
export const NoticeBoardSection: React.FC<{ content: HomeSpotlightContent }> = ({ content }) => {
  return (
    <section className="section" id="spotlight" style={{ background: '#fff' }}>
      <div className="wrap">
        <div className="section-head stack">
          {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
          <h2>{content.title}</h2>
          {content.intro && <p>{content.intro}</p>}
        </div>
        <div className="spotlight">
          <div className="spotlight-poster">
            <img src={content.image} alt={content.imageAlt} />
          </div>
          <div className="spotlight-body">
            <div className="spotlight-top-row">
              {content.pill && <span className="pill">{content.pill}</span>}
              <div className="donor-strip" title="Columbans who've taken their donor pass">
                <div className="donor-chip">SK</div>
                <div className="donor-chip">AA</div>
                <div className="donor-chip">KU</div>
                <div className="donor-chip">+42</div>
                <span className="donor-strip-label">taken their donor pass</span>
              </div>
            </div>
            <h3>{content.headline}</h3>
            {content.body && <p>{content.body}</p>}
            {content.linkHref && (
              <SiteLink className="qa-link" style={{ marginTop: '14px', display: 'inline-block' }} href={content.linkHref}>
                {content.linkLabel || 'Read more →'}
              </SiteLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoardSection;
