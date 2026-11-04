import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, SectionHead } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import type { BatchmatesContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { findBatchmatesContent as text } from '../content';
import { findBatchmatesHelper } from '../helper';
import { BatchmateSearchForm } from './subcomponents';

export const FindBatchmatesView: React.FC<{ content: BatchmatesContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      actions={
        <>
          <Link className="btn btn-primary" href={text.signInToSearch.href}>
            {text.signInToSearch.label}
          </Link>
          <Link className="btn btn-secondary" href={text.becomeMember.href}>
            {text.becomeMember.label}
          </Link>
        </>
      }
    />

    <section className="content-section">
      <div className="wrap">
        <SectionHead eyebrow={content.howEyebrow} title={content.howTitle} intro={content.howIntro} />
        <div className="obj-list">
          {content.steps.map((step, i) => (
            <div className="obj-item" key={`${i}-${step.title}`}>
              <span className="obj-num">{i + 1}</span>
              <div className="obj-body">
                <h3>{step.title}</h3>
                {step.text && <p>{step.text}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="content-section tint-teal" id="search">
      <div className="wrap">
        <div className="form-section">
          <div className="form-aside">
            {content.searchEyebrow && <span className="eyebrow">{content.searchEyebrow}</span>}
            <h2>{content.searchTitle}</h2>
            {content.searchText && <p>{content.searchText}</p>}
            <div className="aside-links">
              <Link href={text.signInToSearch.href}>{text.signInToSearch.label}</Link>
              <Link href={text.becomeMember.href}>{text.becomeMember.label}</Link>
            </div>
          </div>
          <div className="form-panel-lg">
            <BatchmateSearchForm />
          </div>
        </div>
      </div>
    </section>

    <section className="content-section" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <SectionHead eyebrow={content.visibilityEyebrow} title={content.visibilityTitle} intro={content.visibilityIntro} />
        <div className="fy-tagrow">
          <span className="fy-label">{text.shownLabel}</span>
          {findBatchmatesHelper.tags(content.shownTags).map((tag) => (
            <span className="fy-tag on" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="fy-tagrow">
          <span className="fy-label">{text.hiddenLabel}</span>
          {findBatchmatesHelper.tags(content.hiddenTags).map((tag) => (
            <span className="fy-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.updateDetails.href}>
        {text.updateDetails.label}
      </Link>
      <MailtoLink className="btn btn-secondary">{text.writeSecretariat}</MailtoLink>
    </CtaBand>
  </>
);

export default FindBatchmatesView;
