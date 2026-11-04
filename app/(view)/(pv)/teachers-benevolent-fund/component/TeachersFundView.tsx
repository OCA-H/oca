import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, SecurePaymentNote } from '@/app/(view)/common/component/PageParts';
import { donationFundHref } from '@/app/(view)/common/helper/routes';
import type { CauseFigures } from '@/app/(view)/common/helper/fundFigures';
import type { TeachersFundContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { teachersFundContent as text } from '../content';
import { teachersFundHelper } from '../helper';

/** The progress ring, the goal, and the raised and donor tiles, beside the banner text. */
const FundCard: React.FC<{ figures: CauseFigures; contributeHref: string }> = ({ figures, contributeHref }) => {
  const { progress, raised, goal, donors } = figures;
  return (
    <div className="tbf-card">
      <div className="tbf-ring" role="img" aria-label={`${progress}% donated`}>
        <svg viewBox="0 0 220 220">
          <circle className="trk" cx="110" cy="110" r="94" />
          <circle className="val" cx="110" cy="110" r="94" pathLength={100} strokeDasharray={`${progress} ${100 - progress}`} />
        </svg>
        <div className="mid">
          <strong>{progress}%</strong>
          <span>{text.donated}</span>
        </div>
      </div>
      <div className="tbf-info">
        {goal && (
          <span className="tbf-goal-lbl">
            {text.goal} <strong>{goal}</strong>
          </span>
        )}
        <div className="tbf-tiles">
          <div className="tbf-tile">
            <div className="fig">{raised || '₹0'}</div>
            <div className="lbl">{text.donated}</div>
          </div>
          <div className="tbf-tile">
            <div className="fig">{(donors ?? 0).toLocaleString('en-IN')}</div>
            <div className="lbl">{text.donors}</div>
          </div>
        </div>
      </div>
      <div className="tbf-actions tbf-bar">
        <Link className="btn btn-primary" href={contributeHref}>
          {text.contributeNow}
        </Link>
        <SecurePaymentNote small />
      </div>
    </div>
  );
};

export const TeachersFundView: React.FC<{ content: TeachersFundContent; figures: CauseFigures }> = ({ content, figures }) => {
  const contributeHref = donationFundHref(content.fund);
  return (
    <>
      <PageCrumb trail={text.crumb} />

      <PageHero
        content={content}
        media={<FundCard figures={figures} contributeHref={contributeHref} />}
        actions={
          <>
            <Link className="btn btn-primary" href={contributeHref}>
              {text.contributeToFund}
            </Link>
            <a className="btn btn-secondary" href="#tbf-committee">
              {text.meetCommittee}
            </a>
          </>
        }
      />

      <section className="content-section" id="tbf-committee">
        <div className="wrap">
          <div className="section-head stack" style={{ maxWidth: 820 }}>
            {content.committeeEyebrow && <span className="eyebrow">{content.committeeEyebrow}</span>}
            <h2>{content.committeeTitle}</h2>
            {content.committeeIntro && <p>{content.committeeIntro}</p>}
          </div>
          {content.members.length > 0 && (
            <div className="tbf-members">
              {content.members.map((member, i) => (
                <div className="tbf-member" key={`${i}-${member.name}`}>
                  <span className="tbf-letter" aria-hidden="true">
                    {teachersFundHelper.letter(i)}
                  </span>
                  <div>
                    <h4>{member.name}</h4>
                    {member.role && <p>{member.role}</p>}
                    {member.term && <span className={`tbf-term ${member.termKind === 'ec' ? 'ec' : 'fixed'}`}>{member.term}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {content.termNote && (
            <p className="tbf-termnote">
              <strong>{content.termNote}</strong>
            </p>
          )}
        </div>
      </section>

      <section className="content-section tint-gold" id="rules">
        <div className="wrap">
          <div className="section-head stack">
            {content.rulesEyebrow && <span className="eyebrow">{content.rulesEyebrow}</span>}
            <h2>{content.rulesTitle}</h2>
          </div>
          <div className="obj-list" style={{ marginTop: 28 }}>
            {content.rules.map((rule, i) => (
              <div className="obj-item" key={`${i}-${rule.title}`}>
                <span className="obj-num">{teachersFundHelper.number(i)}</span>
                <div className="obj-body">
                  <h3>{rule.title}</h3>
                  {rule.text && <p>{rule.text}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand content={content}>
        <Link className="btn btn-gold" href={contributeHref}>
          {text.contributeNow}
        </Link>
        <SecurePaymentNote />
      </CtaBand>
    </>
  );
};

export default TeachersFundView;
