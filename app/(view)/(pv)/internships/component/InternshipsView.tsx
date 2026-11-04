import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, SectionHead } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import type { InternshipsContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { internshipsContent as text } from '../content';

export const InternshipsView: React.FC<{ content: InternshipsContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-gold"
      actions={
        <>
          <MailtoLink className="btn btn-primary" subject={text.offer.subject}>
            {text.offer.label}
          </MailtoLink>
          <MailtoLink className="btn btn-secondary" subject={text.apply.subject}>
            {text.apply.label}
          </MailtoLink>
        </>
      }
    />

    {content.facts.length > 0 && (
      <div className="wrap">
        <div className={`fact-strip fact-strip--${Math.max(2, content.facts.length)}`}>
          {content.facts.map((fact, i) => (
            <div className="fact" key={`${i}-${fact.value}`}>
              <div className="fact-num">{fact.value}</div>
              {fact.label && <div className="fact-lbl">{fact.label}</div>}
            </div>
          ))}
        </div>
      </div>
    )}

    <section className="content-section">
      <div className="wrap">
        <SectionHead eyebrow={content.hostEyebrow} title={content.hostTitle} intro={content.hostIntro} />
        <div className="obj-list">
          {content.hostSteps.map((step, i) => (
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

    <section className="content-section tint-gold">
      <div className="wrap">
        <SectionHead eyebrow={content.applyEyebrow} title={content.applyTitle} intro={content.applyText} />
        <div className="btn-row">
          <MailtoLink className="btn btn-primary" subject={text.apply.subject}>
            {text.applyLong}
          </MailtoLink>
          <Link className="btn btn-secondary" href={text.careers.href}>
            {text.careers.label}
          </Link>
        </div>
      </div>
    </section>

    <CtaBand content={content}>
      <MailtoLink className="btn btn-gold" subject={text.offer.subject}>
        {text.offer.label}
      </MailtoLink>
      <Link className="btn btn-secondary" href={text.talkFirst.href}>
        {text.talkFirst.label}
      </Link>
    </CtaBand>
  </>
);

export default InternshipsView;
