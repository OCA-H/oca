import React from 'react';
import Link from 'next/link';
import { MemberSwitch } from '@/app/(view)/common/component/MemberSwitch';
import { ExecutiveCommitteeCtaContent } from '../../content/executiveCommittee.content';

export interface ExecutiveCommitteeCTAProps {
  cta: ExecutiveCommitteeCtaContent;
  /** Shown instead of `cta` to a signed-in member. */
  memberCta: ExecutiveCommitteeCtaContent;
}

const CtaBody: React.FC<{ cta: ExecutiveCommitteeCtaContent }> = ({ cta }) => (
  <>
    <div>
      <span className="eyebrow">{cta.eyebrow}</span>
      <h2>{cta.title}</h2>
      <p>{cta.lead}</p>
    </div>
    <div className="cta-band-actions">
      <Link className="btn btn-gold" href={cta.primaryBtn.href}>
        {cta.primaryBtn.text}
      </Link>
      <Link className="btn btn-secondary" href={cta.secondaryBtn.href}>
        {cta.secondaryBtn.text}
      </Link>
    </div>
  </>
);

export const ExecutiveCommitteeCTA: React.FC<ExecutiveCommitteeCTAProps> = ({ cta, memberCta }) => {
  return (
    <section className="cta-band">
      <div className="wrap">
        <MemberSwitch guest={<CtaBody cta={cta} />} member={<CtaBody cta={memberCta} />} />
      </div>
    </section>
  );
};

export default ExecutiveCommitteeCTA;
