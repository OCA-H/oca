import React from 'react';
import Link from 'next/link';
import { PageCrumb, PageHero, SectionHead } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import type { RemembranceContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { remembranceContent as text } from '../content';

/** The three "How we remember" cards' icons: a candle, a letter, a shield. */
const WAY_ICONS = [
  <React.Fragment key="candle">
    <path d="M12 3c1.6 1.8 2.4 3.2 2.4 4.4a2.4 2.4 0 1 1-4.8 0C9.6 6.2 10.4 4.8 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="8.5" y="11" width="7" height="10" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
  </React.Fragment>,
  <React.Fragment key="letter">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="m3.5 7 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.6" />
  </React.Fragment>,
  <path key="shield" d="M12 3 20 6v6c0 4.4-3.2 8-8 9.5C7.2 20 4 16.4 4 12V6l8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
];

export const RemembranceView: React.FC<{ content: RemembranceContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-navy"
      actions={
        <MailtoLink className="btn btn-secondary" subject={text.tellUs.subject}>
          {text.tellUs.label}
        </MailtoLink>
      }
    />

    <section className="content-section">
      <div className="wrap">
        <SectionHead centered wide eyebrow={content.rollEyebrow} title={content.rollTitle} intro={content.rollIntro} />
        {content.entries.length > 0 && (
          <div className="mem-list">
            {content.entries.map((entry, i) => (
              <article className="mem-entry" key={`${i}-${entry.name}`}>
                {entry.image && (
                  // The lightbox enlarges these photos (see Lightbox).
                  <div className="mem-photo">
                    <img src={entry.image} alt={entry.imageAlt || entry.name} loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="mem-body">
                  <h3>{entry.name}</h3>
                  {entry.meta && <span className="mem-meta">{entry.meta}</span>}
                  {entry.quote && <blockquote>{entry.quote}</blockquote>}
                  {entry.text && <p>{entry.text}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="note-band" style={{ marginTop: 30, textAlign: 'center', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
          <strong>{text.noteLead}</strong> {text.noteText}{' '}
          <MailtoLink subject={text.sendName.subject}>{text.sendName.label}</MailtoLink>.
        </p>
      </div>
    </section>

    {content.ways.length > 0 && (
      <section className="content-section tint-teal">
        <div className="wrap">
          <SectionHead eyebrow={content.howEyebrow} title={content.howTitle} />
          <div className="quick-grid">
            {content.ways.map((way, i) => (
              <div className="qa-card" key={`${i}-${way.title}`}>
                <div className="qa-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {WAY_ICONS[i % WAY_ICONS.length]}
                  </svg>
                </div>
                <h3>{way.title}</h3>
                {way.text && <p>{way.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {content.quote && (
      <section className="content-section tint-gold">
        <div className="wrap">
          <div className="editorial-quote">
            <span className="mark">&ldquo;</span>
            <blockquote>{content.quote}</blockquote>
            {content.quoteAfter && <span className="after">{content.quoteAfter}</span>}
          </div>
          <div className="btn-row" style={{ marginTop: 26, justifyContent: 'center' }}>
            <Link className="btn btn-primary" href={text.fund.href}>
              {text.fund.label}
            </Link>
          </div>
        </div>
      </section>
    )}
  </>
);

export default RemembranceView;
