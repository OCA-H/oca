import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, SectionHead } from '@/app/(view)/common/component/PageParts';
import { SiteLink } from '@/app/(view)/common/component/SiteLink';
import { causeFigures } from '@/app/(view)/common/helper/fundFigures';
import type { SocialConsciencePageContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import type { HomeCause } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { FundProgress } from '@/app/api/(features)/sv/contribution/schema/contributionSchema';
import { socialConscienceContent as text } from '../content';
import { socialConscienceHelper } from '../helper';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A cause's photo, a link to its page when it has one. */
const CauseImage: React.FC<{ cause: HomeCause; className: string; children: React.ReactNode }> = ({ cause, className, children }) =>
  cause.href ? (
    <SiteLink className={className} href={cause.href} aria-label={cause.title}>
      {children}
    </SiteLink>
  ) : (
    <div className={className}>{children}</div>
  );

/** A featured cause: its fund's live total, progress and goal. */
const FeaturedCause: React.FC<{ cause: HomeCause; funds: FundProgress[] }> = ({ cause, funds }) => {
  const { progress, raised, goal } = causeFigures(cause, funds);
  const donateHref = socialConscienceHelper.contributeHref(cause);
  return (
    <article className="sc-feature">
      <CauseImage cause={cause} className="sc-feature-img">
        <img src={cause.image} alt={cause.imageAlt} loading="lazy" decoding="async" />
        {cause.badge && <span className="sc-pill gold">{cause.badge}</span>}
      </CauseImage>
      <div className="sc-feature-body">
        <h3>{cause.href ? <SiteLink href={cause.href}>{cause.title}</SiteLink> : cause.title}</h3>
        <div className="sc-raised">
          {raised && <span className="num">{raised}</span>}
          <span className="lbl">{text.donated(progress)}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress}% of goal donated`}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        {goal && (
          <div className="sc-goal">
            {text.goal} <strong>{goal}</strong>
          </div>
        )}
        {cause.desc && <p>{cause.desc}</p>}
        <div className="sc-actions">
          {donateHref && (
            <SiteLink className="btn btn-primary" href={donateHref}>
              {text.donate}
            </SiteLink>
          )}
          {cause.href && (
            <SiteLink className="sc-more" href={cause.href}>
              {text.readMore} <Arrow />
            </SiteLink>
          )}
        </div>
      </div>
    </article>
  );
};

/** A muted cause (suspended, coming soon): its badge and note. */
const MutedCause: React.FC<{ cause: HomeCause; index: number }> = ({ cause, index }) => {
  const donateHref = socialConscienceHelper.contributeHref(cause);
  return (
    <article className="sc-card">
      <CauseImage cause={cause} className="sc-card-img">
        <img src={cause.image} alt={cause.imageAlt} loading="lazy" decoding="async" />
        {cause.badge && <span className={`sc-pill ${socialConscienceHelper.mutedPill(index)}`}>{cause.badge}</span>}
      </CauseImage>
      <div className="sc-card-body">
        <h3>{cause.href ? <SiteLink href={cause.href}>{cause.title}</SiteLink> : cause.title}</h3>
        {cause.desc && <p>{cause.desc}</p>}
        {donateHref && (
          <div className="sc-actions">
            <SiteLink className="btn btn-primary" href={donateHref}>
              {text.donate}
            </SiteLink>
          </div>
        )}
      </div>
    </article>
  );
};

interface SocialConscienceViewProps {
  content: SocialConsciencePageContent;
  /** The causes, from Home page → OCA Social Conscience. */
  causes: HomeCause[];
  /** Paid totals per fund, for the featured causes' progress. */
  funds: FundProgress[];
}

export const SocialConscienceView: React.FC<SocialConscienceViewProps> = ({ content, causes, funds }) => {
  const featured = causes.filter((cause) => cause.status === 'featured');
  const muted = causes.filter((cause) => cause.status !== 'featured');
  return (
    <>
      <PageCrumb trail={text.crumb} />

      <PageHero
        content={content}
        actions={
          <>
            <a className="btn btn-primary" href="#causes">
              {text.seeCauses}
            </a>
            <Link className="btn btn-secondary" href={text.contribute.href}>
              {text.contribute.label}
            </Link>
          </>
        }
      />

      <section className="content-section" id="causes">
        <div className="wrap">
          <SectionHead centered eyebrow={content.causesEyebrow} title={content.causesTitle} />
          {featured.map((cause, i) => (
            <FeaturedCause key={`${i}-${cause.title}`} cause={cause} funds={funds} />
          ))}
          {muted.length > 0 && (
            <div className="sc-grid">
              {muted.map((cause, i) => (
                <MutedCause key={`${i}-${cause.title}`} cause={cause} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand content={content}>
        <Link className="btn btn-gold" href={text.contribute.href}>
          {text.contributeNow}
        </Link>
      </CtaBand>
    </>
  );
};

export default SocialConscienceView;
