import React from 'react';
import Link from 'next/link';
import { ExecutiveCommitteeContent } from '../../content/executiveCommittee.content';

export interface ExecutiveCommitteeCTAProps {
  cta: ExecutiveCommitteeContent['cta'];
}

export const ExecutiveCommitteeCTA: React.FC<ExecutiveCommitteeCTAProps> = ({ cta }) => {
  return (
    <section className="cta-band">
      <div className="wrap">
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
      </div>
    </section>
  );
};

export default ExecutiveCommitteeCTA;
