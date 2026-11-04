import React from 'react';
import Link from 'next/link';
import { CtaBand, MottoFigure, PageCrumb, PageHero, Paragraphs, PhotoTile, SectionHead } from '@/app/(view)/common/component/PageParts';
import type { SchoolHistoryContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { schoolHistoryContent as text } from '../content';

/** The honours' icons, in turn. */
const RECOGNITION_ICONS = [
  <path key="star" d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z" stroke="currentColor" strokeWidth="1.6" />,
  <path key="chart" d="M4 20V10M10 20V4M16 20v-8M22 20H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
];

export const SchoolHistoryView: React.FC<{ content: SchoolHistoryContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-navy"
      actions={
        <>
          <Link className="btn btn-primary" href={text.join.href}>
            {text.join.label}
          </Link>
          {content.schoolUrl && (
            <a className="btn btn-secondary" href={content.schoolUrl} target="_blank" rel="noopener noreferrer">
              {text.visitSchool}
            </a>
          )}
        </>
      }
    />

    {content.stats.length > 0 && (
      <div className="wrap">
        <div className="stat-strip">
          {content.stats.map((stat, i) => (
            <div className="stat" key={`${i}-${stat.label}`}>
              <div className="num">
                {stat.value}
                {stat.suffix && <sup>{stat.suffix}</sup>}
              </div>
              <div className="lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    )}

    <section className="content-section">
      <div className="wrap split-2">
        <div>
          <SectionHead eyebrow={content.introEyebrow} title={content.introTitle} style={{ marginBottom: 20 }} />
          <div className="prose">
            <Paragraphs text={content.introBody} />
          </div>
          {content.mottoLatin1 && (
            <MottoFigure
              variant="plaque"
              latin={[content.mottoLatin1, content.mottoLatin2]}
              translation={content.mottoTranslation}
              caption={content.mottoCaption}
              style={{ marginTop: 26 }}
            />
          )}
        </div>
        <div className="split-media">
          <PhotoTile src={content.introImage} alt={content.introImageAlt} />
          {content.introCaption && <p className="split-caption">{content.introCaption}</p>}
        </div>
      </div>
    </section>

    {content.timeline.length > 0 && (
      <section className="content-section tint-gold">
        <div className="wrap">
          <SectionHead
            eyebrow={content.timelineEyebrow}
            title={content.timelineTitle}
            intro={content.timelineIntro}
            style={{ maxWidth: 820, margin: '0 auto 44px' }}
          />
          <div className="timeline">
            {content.timeline.map((item, i) => (
              <div className={`tl-item${item.major === 'yes' ? ' major' : ''}`} key={`${i}-${item.title}`}>
                <div className="tl-date">{item.date}</div>
                <h3>{item.title}</h3>
                {item.text && <p>{item.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <section className="content-section" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="wrap split-2 media-left">
        <div className="split-media">
          <PhotoTile src={content.academicsImage} alt={content.academicsImageAlt} tone="duo-gold" />
          {content.academicsCaption && <p className="split-caption">{content.academicsCaption}</p>}
        </div>
        <div>
          {content.academicsEyebrow && <span className="eyebrow">{content.academicsEyebrow}</span>}
          <h2 style={{ fontSize: 30, lineHeight: 1.25, marginTop: 8 }}>{content.academicsTitle}</h2>
          <div className="prose" style={{ marginTop: 20 }}>
            <Paragraphs text={content.academicsBody} />
          </div>
          {content.pillars.length > 0 && (
            <ul className="pillar-list">
              {content.pillars.map((pillar, i) => (
                <li key={`${i}-${pillar.title}`}>
                  <span>
                    <strong>{pillar.title}</strong>
                    {pillar.text && <> &mdash; {pillar.text}</>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>

    {content.quote && (
      <section className="content-section tint-teal">
        <div className="wrap editorial-quote">
          {content.quoteEyebrow && <span className="eyebrow">{content.quoteEyebrow}</span>}
          <span className="mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote>{content.quote}</blockquote>
          {content.quoteAfter && <div className="after">{content.quoteAfter}</div>}
        </div>
      </section>
    )}

    {content.recognitions.length > 0 && (
      <section className="content-section">
        <div className="wrap">
          <SectionHead eyebrow={content.recognitionEyebrow} title={content.recognitionTitle} />
          <div className="recog-grid">
            {content.recognitions.map((item, i) => (
              <div className="recog-card" key={`${i}-${item.title}`}>
                <div className="qa-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {RECOGNITION_ICONS[i % RECOGNITION_ICONS.length]}
                  </svg>
                </div>
                <h3>{item.title}</h3>
                {item.text && <p>{item.text}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.becomeMember.href}>
        {text.becomeMember.label}
      </Link>
      <Link className="btn btn-secondary" href={text.support.href}>
        {text.support.label}
      </Link>
    </CtaBand>
  </>
);

export default SchoolHistoryView;
