import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, RichText, SectionHead, type TileTone } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import { SiteLink } from '@/app/(view)/common/component/SiteLink';
import type { NewslettersContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import type { HomeNoticeItem } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { newslettersContent as text } from '../content';
import { EmailUpdateForm } from './subcomponents';

const TONES: TileTone[] = ['duo-navy', 'duo-teal', 'duo-gold'];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** One notice: a card that opens it, or just reads it when it has no link. */
const NoticeCard: React.FC<{ notice: HomeNoticeItem; index: number }> = ({ notice, index }) => {
  const body = (
    <>
      <div className={`photo-tile ${TONES[index % TONES.length]} nlc-tile`}>
        <div className="event-date-chip">{(notice.tag || text.defaultTag).toUpperCase()}</div>
        <div className="tile-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
      </div>
      <div className="nlc-body">
        {notice.date && <span className="nlc-date">{notice.date}</span>}
        <h4>{notice.title}</h4>
        {notice.href && (
          <span className="nlc-act">
            {text.readNotice} <Arrow />
          </span>
        )}
      </div>
    </>
  );
  return notice.href ? (
    <SiteLink className="nlc-card" href={notice.href} target="_blank" rel="noopener noreferrer">
      {body}
    </SiteLink>
  ) : (
    <div className="nlc-card">{body}</div>
  );
};

/** `notices` are the home page's (Home page → News & Notices), newest first. */
export const NewslettersView: React.FC<{ content: NewslettersContent; notices: HomeNoticeItem[] }> = ({ content, notices }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-navy"
      actions={
        <>
          <a className="btn btn-primary" href="#archive">
            {text.readArchive}
          </a>
          <a className="btn btn-secondary" href="#by-email">
            {text.getByEmail}
          </a>
        </>
      }
    />

    {notices.length > 0 && (
      <section className="content-section" id="archive">
        <div className="wrap">
          <SectionHead eyebrow={content.noticesEyebrow} title={content.noticesTitle} intro={content.noticesIntro} />
          <div className="nlc-grid">
            {notices.map((notice, i) => (
              <NoticeCard key={`${i}-${notice.title}`} notice={notice} index={i} />
            ))}
          </div>
        </div>
      </section>
    )}

    <section className="content-section tint-gold">
      <div className="wrap">
        <SectionHead eyebrow={content.archiveEyebrow} title={content.archiveTitle} intro={content.archiveIntro} />
        {content.issues.length > 0 && (
          <div className="nlc-grid">
            {content.issues.map((issue, i) => (
              <a className="nlc-card nlc-mag" href={issue.file} target="_blank" rel="noopener noreferrer" key={`${i}-${issue.title}`}>
                <div className="nlc-cover">
                  <img src={issue.image} alt={text.coverAlt(issue.title)} loading="lazy" decoding="async" />
                </div>
                <div className="nlc-body">
                  {issue.date && <span className="nlc-date">{issue.date}</span>}
                  <h4>{issue.title}</h4>
                  <span className="nlc-act">
                    {text.downloadPdf} <DownloadIcon />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
        {content.olderNote && (
          <p className="note-band" style={{ marginTop: 30 }}>
            <RichText text={content.olderNote} /> {text.writeTo} <MailtoLink />.
          </p>
        )}
      </div>
    </section>

    <section className="content-section" id="by-email">
      <div className="wrap">
        <SectionHead eyebrow={content.emailEyebrow} title={content.emailTitle} intro={content.emailIntro} />
        <div className="form-panel-lg" style={{ maxWidth: 620, margin: '0 auto' }}>
          <EmailUpdateForm />
        </div>
      </div>
    </section>

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.becomeMember.href}>
        {text.becomeMember.label}
      </Link>
      <Link className="btn btn-secondary" href={text.bylaws.href}>
        {text.bylaws.label}
      </Link>
    </CtaBand>
  </>
);

export default NewslettersView;
