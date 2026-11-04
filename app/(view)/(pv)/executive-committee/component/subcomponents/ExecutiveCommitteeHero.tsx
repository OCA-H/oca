import React from 'react';
import Link from 'next/link';
import { MemberSwitch } from '@/app/(view)/common/component/MemberSwitch';
import { PhotoTile } from '@/app/(view)/common/component/PageParts';
import { ExecutiveCommitteeContent } from '../../content/executiveCommittee.content';

export interface ExecutiveCommitteeHeroProps {
  hero: ExecutiveCommitteeContent['hero'];
}

export const ExecutiveCommitteeHero: React.FC<ExecutiveCommitteeHeroProps> = ({ hero }) => {
  return (
    <section className="page-hero">
      <div className="wrap">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.lead}</p>
          <div className="page-hero-actions">
            <MemberSwitch
              guest={<Link className="btn btn-primary" href={hero.primaryBtn.href}>{hero.primaryBtn.text}</Link>}
              member={<Link className="btn btn-primary" href={hero.memberPrimaryBtn.href}>{hero.memberPrimaryBtn.text}</Link>}
            />
            <Link className="btn btn-secondary" href={hero.secondaryBtn.href}>
              {hero.secondaryBtn.text}
            </Link>
          </div>
        </div>
        <div className="page-hero-media">
          <PhotoTile
            src={hero.image}
            alt={hero.imageAlt}
            caption={hero.caption}
            tone="duo-teal"
            eager
          />
        </div>
      </div>
    </section>
  );
};

export default ExecutiveCommitteeHero;
