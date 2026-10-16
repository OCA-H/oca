import React from 'react';
import Link from 'next/link';
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
            <Link className="btn btn-primary" href={hero.primaryBtn.href}>
              {hero.primaryBtn.text}
            </Link>
            <Link className="btn btn-secondary" href={hero.secondaryBtn.href}>
              {hero.secondaryBtn.text}
            </Link>
          </div>
        </div>
        <div className="page-hero-media">
          <div className="photo-tile duo-teal">
            <img
              className="tile-img"
              src={hero.image}
              alt={hero.imageAlt}
              loading="lazy"
              decoding="async"
              data-ph="photo"
            />
            <div className="tile-caption">
              <div className="t">{hero.caption}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveCommitteeHero;
