import React from 'react';
import { PageCrumb, Paragraphs } from '@/app/(view)/common/component/PageParts';
import { SiteLink } from '@/app/(view)/common/component/SiteLink';
import { downloadHref } from '@/app/(view)/common/helper/routes';
import type { HomeNoticeItem, NoticeFactIcon } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { newsContent as text } from '../content';
import { agendaItems, noticeTags } from '../helper';

const svg = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
const line = { stroke: 'currentColor', strokeWidth: 1.6 } as const;

/** The icons beside a notice's key details, as in the template. */
const FACT_ICONS: Record<NoticeFactIcon, React.ReactNode> = {
  cal: (
    <svg {...svg}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" {...line} />
      <path d="M3.5 10h17M8 3v4M16 3v4" {...line} strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg {...svg}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" {...line} strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" {...line} />
    </svg>
  ),
  doc: (
    <svg {...svg}>
      <path d="M7 3h7l4 4v14H7V3Z" {...line} strokeLinejoin="round" />
      <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5" {...line} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  people: (
    <svg {...svg}>
      <circle cx="9" cy="8.5" r="3" {...line} />
      <path d="M3.5 19c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 6.3a3 3 0 0 1 0 5.4M17.5 14.8c2 .4 3.3 1.8 3.8 4.2" {...line} strokeLinecap="round" />
    </svg>
  ),
  vote: (
    <svg {...svg}>
      <rect x="4" y="11" width="16" height="9" rx="1.5" {...line} />
      <path d="M8 11V7.5l4-3.5 4 3.5V11M9.5 15.5h5" {...line} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/** The page while its notice loads: the breadcrumb and an empty banner, so nothing jumps when it arrives. */
export const NewsDetailSkeleton: React.FC = () => (
  <>
    <PageCrumb trail={[{ label: text.section }]} />
    <section className="page-hero nw-hero" aria-busy="true">
      <div className="wrap">
        <div>
          <span className="eyebrow">{text.eyebrow}</span>
          <h1 aria-hidden="true">&nbsp;</h1>
          <div className="nw-meta" aria-hidden="true">
            <span className="nw-posted">&nbsp;</span>
          </div>
        </div>
      </div>
    </section>
  </>
);

/** One notice on its own page (/news/<slug>): banner, text, key details, agenda, and its PDF. */
export const NewsDetailView: React.FC<{ notice: HomeNoticeItem }> = ({ notice }) => {
  const tags = noticeTags(notice, text.defaultTag);
  const facts = (notice.facts ?? []).filter((fact) => fact.label && fact.text);
  const agenda = agendaItems(notice.agenda);
  const docTitle = notice.pdfTitle || text.defaultDocTitle;

  return (
    <>
      <PageCrumb trail={[{ label: text.section }, { label: notice.title }]} />

      <section className="page-hero nw-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{text.eyebrow}</span>
            <h1>{notice.title}</h1>
            <div className="nw-meta">
              {notice.date && <span className="nw-posted">{text.posted(notice.date)}</span>}
              {tags.map((tag) => (
                <span className={`nw-tag${tag.gold ? ' gold' : ''}`} key={tag.label}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section tight">
        <div className="wrap">
          <article className="nw-article">
            {notice.body && <Paragraphs text={notice.body} />}

            {facts.length > 0 && (
              <div className="nw-facts">
                {facts.map((fact, i) => (
                  <div className="nw-fact" key={`${i}-${fact.label}`}>
                    <span className="nw-ico">{FACT_ICONS[fact.icon] ?? FACT_ICONS.doc}</span>
                    <div>
                      <b>{fact.label}</b>
                      <span>{fact.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {agenda.length > 0 && (
              <div className="nw-agenda">
                <h2>{text.agenda}</h2>
                <ol>
                  {agenda.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </div>
            )}

            {notice.sign && <p className="nw-sign">{text.signedBy(notice.sign)}</p>}

            {notice.href && (
              <div className="nw-actions">
                <SiteLink className="btn btn-primary" href={notice.href}>
                  {notice.actionLabel || text.defaultAction}
                </SiteLink>
              </div>
            )}
          </article>
        </div>
      </section>

      {notice.pdf && (
        <>
          <section className="content-section tint-teal by-reader nw-doc" id="document">
            <div className="wrap">
              <div className="nw-doc-head">
                <span className="eyebrow">{text.docEyebrow}</span>
                <h2>{docTitle}</h2>
              </div>
              <div className="by-viewer">
                <div className="by-scroll" tabIndex={0} aria-label={text.scrollLabel(docTitle)}>
                  <div className="by-pages">
                    <figure className="by-page by-page--pdf">
                      <object data={notice.pdf} type="application/pdf" aria-label={docTitle}>
                        <div className="by-pdf-fallback">
                          <p>{text.pdfFallback}</p>
                          <a className="btn btn-primary" href={notice.pdf} target="_blank" rel="noopener noreferrer">
                            {text.openPdf}
                          </a>
                        </div>
                      </object>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <a className="by-float" href={downloadHref(notice.pdf)} download aria-label={text.downloadAria}>
            <span className="by-float-circle">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="by-float-text">
              <strong>{notice.pdfLabel || text.defaultDownload}</strong>
              <small>{text.downloadNote}</small>
            </span>
          </a>
        </>
      )}
    </>
  );
};

export default NewsDetailView;
