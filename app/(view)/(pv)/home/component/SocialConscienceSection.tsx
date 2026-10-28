import React from 'react';
import type { HomeCause, HomeSocialContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

const CAUSE_ICONS = [
  'M12 14l9-5-9-5-9 5 9 5Zm0 0v7m-9-7v5c0 1 4 3 9 3s9-2 9-3v-5',
  'M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5',
  'M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.65 12 21 12 21Z',
];

/** A muted cause's badge takes its tile's colour. */
const BADGE_COLOURS: Record<string, string> = { 'duo-navy': 'var(--navy)', 'duo-teal': 'var(--teal-dark)', 'duo-gold': 'var(--gold-dark)' };

function CauseCard({ cause, index }: { cause: HomeCause; index: number }) {
  const tone = toneAt(index, 2);
  const featured = cause.status === 'featured';
  const progress = Math.max(0, Math.min(100, Number(cause.progress) || 0));
  return (
    <div className={`cause-card${featured ? '' : ' muted'}`}>
      <div className={`photo-tile ${tone}`}>
        <div className="tile-icon">
          <img className="tile-img" src={cause.image} alt={cause.imageAlt} loading="lazy" decoding="async" />
          <svg viewBox="0 0 24 24" fill="none"><path d={CAUSE_ICONS[index % CAUSE_ICONS.length]} stroke="#fff" strokeWidth="1.4"/></svg>
        </div>
        {cause.badge && (
          <div className="tile-caption">
            {featured ? (
              <span className="pill gold" style={{ background: "rgba(255,255,255,.9)" }}>{cause.badge}</span>
            ) : (
              <span className="pill" style={{ background: "rgba(255,255,255,.9)", color: BADGE_COLOURS[tone] }}>{cause.badge}</span>
            )}
          </div>
        )}
      </div>
      <div className="cause-body">
        <h4>{featured && cause.href ? <SiteLink href={cause.href}>{cause.title}</SiteLink> : cause.title}</h4>
        {featured ? (
          <>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
            <div className="fund-meta">
              <span>{progress}% Donated</span>
              {(cause.raised || cause.goal) && <span><strong>{cause.raised}</strong>{cause.goal && ` / ${cause.goal}`}</span>}
            </div>
            {cause.ctaHref && <SiteLink className="btn btn-primary btn-sm" style={{ marginTop: "16px", width: "100%" }} href={cause.ctaHref}>Contribute</SiteLink>}
            {cause.href && <SiteLink href={cause.href} style={{ display: "block", textAlign: "center", marginTop: "12px", fontSize: "13.5px", fontWeight: 600, color: "var(--brand-mid)" }}>About the fund &rarr;</SiteLink>}
          </>
        ) : (
          cause.desc && <p style={{ fontSize: "13px", color: "var(--text-soft)" }}>{cause.desc}</p>
        )}
      </div>
    </div>
  );
}

export const SocialConscienceSection: React.FC<{ content: HomeSocialContent }> = ({ content }) => {
  return (
    <section className="section" id="give" style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head stack">
          {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
          <h2>{content.title}</h2>
          {content.intro && <p>{content.intro}</p>}
        </div>
    
        <div className="cause-grid">
          {content.causes.map((cause, i) => (
            <CauseCard cause={cause} index={i} key={`${i}-${cause.title}`} />
          ))}
        </div>
    
        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <button type="button" className="btn btn-secondary" disabled>View More</button>
        </div>
    
        <div className="ask-ribbon" style={{ display: "none" }}>
        </div>
      </div>
    </section>
  );
};

export default SocialConscienceSection;
