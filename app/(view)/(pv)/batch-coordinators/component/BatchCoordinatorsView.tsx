import React from 'react';
import Link from 'next/link';
import { PageCrumb, PageHero } from '@/app/(view)/common/component/PageParts';
import { TelLink } from '@/app/(view)/common/component/ContactLinks';
import type { BatchCoordinatorsContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { batchCoordinatorsContent as text } from '../content';

export const BatchCoordinatorsView: React.FC<{ content: BatchCoordinatorsContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      actions={
        <>
          <TelLink className="btn btn-primary" phone={content.contactPhone}>
            {text.callPrefix} {content.contactName}
          </TelLink>
          <Link className="btn btn-secondary" href={text.committee.href}>
            {text.committee.label}
          </Link>
        </>
      }
    />

    <section className="content-section tint-teal" id="get-on-board">
      <div className="wrap">
        <div className="bc-grid">
          <div className="bc-copy">
            {content.boardEyebrow && <span className="eyebrow">{content.boardEyebrow}</span>}
            <h2>{content.boardTitle}</h2>
            {content.boardLead && <p className="bc-lead">{content.boardLead}</p>}
            {content.traits.length > 0 && (
              <div className="bc-traits">
                {content.traits.map((trait) => (
                  <span key={trait.label}>
                    <i></i>
                    {trait.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bc-card">
            {content.cardBadge && <span className="bc-badge">{content.cardBadge}</span>}
            <p className="bc-line">
              {text.getInTouch} <strong>{content.contactName}</strong> {text.at}
            </p>
            <TelLink className="bc-phone" phone={content.contactPhone}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{content.contactPhone}</span>
            </TelLink>
            {content.cardNote && <p className="bc-line bc-sub">{content.cardNote}</p>}
            <TelLink className="btn btn-primary" phone={content.contactPhone}>
              {text.callNow}
            </TelLink>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default BatchCoordinatorsView;
