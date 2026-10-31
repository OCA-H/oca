import React from 'react';
import type { HomeCause, HomeSocialContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { FundProgress } from '@/app/api/(features)/sv/contribution/schema/contributionSchema';
import { causeFigures } from '../helper';
import { SiteLink, toneAt } from './SiteLink';

/** A muted cause's badge takes its tile's colour. */
const BADGE_COLOURS: Record<string, string> = { 'duo-navy': 'var(--navy)', 'duo-teal': 'var(--teal-dark)', 'duo-gold': 'var(--gold-dark)' };

function CauseCard({ cause, index, funds }: { cause: HomeCause; index: number; funds: FundProgress[] }) {
  const tone = toneAt(index, 2);
  const featured = cause.status === 'featured';
  const { progress, raised, goal, donors } = causeFigures(cause, funds);
  // Offline gifts have no donor count, so the count is labelled as online when they are added in.
  const donorNote = donors ? ` · ${donors} ${Number(cause.offlineRaised) > 0 ? 'online ' : ''}${donors === 1 ? 'donor' : 'donors'}` : '';
  return (
    <div className={`cause-card${featured ? '' : ' muted'}`}>
      <div className={`photo-tile ${tone}`}>
        <img className="tile-img" src={cause.image} alt={cause.imageAlt} loading="lazy" decoding="async" />
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
              <span>{progress}% Donated{donorNote}</span>
              {(raised || goal) && <span><strong>{raised}</strong>{goal && ` / ${goal}`}</span>}
            </div>
            {cause.ctaHref && <SiteLink className="btn btn-primary btn-sm" style={{ marginTop: "16px", width: "100%" }} href={cause.ctaHref}>Contribute</SiteLink>}
          </>
        ) : (
          cause.desc && <p style={{ fontSize: "13px", color: "var(--text-soft)" }}>{cause.desc}</p>
        )}
      </div>
    </div>
  );
}

/** `funds` are the paid totals that fill the featured causes' progress bars (see causeFigures). */
export const SocialConscienceSection: React.FC<{ content: HomeSocialContent; funds: FundProgress[] }> = ({ content, funds }) => {
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
            <CauseCard cause={cause} index={i} funds={funds} key={`${i}-${cause.title}`} />
          ))}
        </div>
    
        <div className="ask-ribbon" style={{ display: "none" }}>
        </div>
      </div>
    </section>
  );
};

export default SocialConscienceSection;
