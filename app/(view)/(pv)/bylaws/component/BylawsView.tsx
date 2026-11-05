import React from 'react';
import { PageCrumb, PageHero } from '@/app/(view)/common/component/PageParts';
import { downloadHref } from '@/app/(view)/common/helper/routes';
import type { BylawsContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { bylawsContent as text } from '../content';

export const BylawsView: React.FC<{ content: BylawsContent }> = ({ content }) => {
  const { pages, pdf } = content;
  return (
    <>
      <PageCrumb trail={text.crumb} />

      <PageHero className="by-hero" content={content} />

      <section className="content-section tint-teal by-reader" id="reader">
        <div className="wrap">
          <div className="by-viewer">
            <div className="by-scroll" tabIndex={0} aria-label={text.scrollLabel}>
              <div className="by-pages">
                {pages.length > 0 ? (
                  pages.map((page, i) => (
                    <figure className="by-page" id={`bylaw-page-${i + 1}`} key={`${i}-${page.image}`}>
                      <img src={page.image} alt={page.imageAlt || text.pageOf(i + 1, pages.length)} loading="lazy" decoding="async" />
                      <figcaption>{text.pageOf(i + 1, pages.length)}</figcaption>
                    </figure>
                  ))
                ) : (
                  // No page images yet: the PDF itself, with a link for browsers that cannot show it inline.
                  <figure className="by-page by-page--pdf">
                    <object data={pdf} type="application/pdf" aria-label={text.pdfTitle}>
                      <div className="by-pdf-fallback">
                        <p>{text.pdfFallback}</p>
                        <a className="btn btn-primary" href={pdf} target="_blank" rel="noopener noreferrer">
                          {text.openPdf}
                        </a>
                      </div>
                    </object>
                  </figure>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {pdf && (
        <a className="by-float" href={downloadHref(pdf)} download aria-label={text.downloadAria}>
          <span className="by-float-circle">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="by-float-text">
            <strong>{content.downloadLabel || 'Download the ByLaws'}</strong>
            {content.downloadNote && <small>{content.downloadNote}</small>}
          </span>
        </a>
      )}
    </>
  );
};

export default BylawsView;
