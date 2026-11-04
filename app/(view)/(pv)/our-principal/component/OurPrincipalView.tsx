import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, Paragraphs } from '@/app/(view)/common/component/PageParts';
import type { PrincipalContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { ourPrincipalContent as text } from '../content';

export const OurPrincipalView: React.FC<{ content: PrincipalContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      className="pr-hero"
      content={content}
      actions={
        <>
          <a className="btn btn-primary" href="#story">
            {text.readStory}
          </a>
          <Link className="btn btn-secondary" href={text.patron.href}>
            {text.patron.label}
          </Link>
        </>
      }
      media={
        <figure className="pr-portrait">
          <img src={content.image} alt={content.imageAlt} decoding="async" />
        </figure>
      }
    />

    <section className="content-section" id="story">
      <div className="wrap">
        <div className="section-head stack" style={{ maxWidth: 760 }}>
          {content.storyEyebrow && <span className="eyebrow">{content.storyEyebrow}</span>}
          <h2>{content.storyTitle}</h2>
        </div>
        <div className="pr-grid">
          <div className="pr-story">
            {content.blocks.map((block, i) => (
              <div className="pr-block" key={`${i}-${block.heading}`}>
                <h3>{block.heading}</h3>
                <Paragraphs text={block.body} />
              </div>
            ))}
          </div>
          {content.timeline.length > 0 && (
            <aside className="pr-side" aria-label={text.timelineAria}>
              {content.timelineBadge && <span className="pr-badge">{content.timelineBadge}</span>}
              <ol className="pr-tl">
                {content.timeline.map((item, i) => (
                  <li key={`${i}-${item.year}`}>
                    <span className="pr-yr">{item.year}</span>
                    <span className="pr-ev">{item.event}</span>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
      </div>
    </section>

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.viewCommittee.href}>
        {text.viewCommittee.label}
      </Link>
    </CtaBand>
  </>
);

export default OurPrincipalView;
