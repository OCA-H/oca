import React from 'react';
import Link from 'next/link';
import { profileContent } from '../../content';

interface ProfileHeroProps {
  firstName: string;
  membershipType: string;
  batchYear: string | null;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ firstName, membershipType, batchYear }) => {
  const { breadcrumb, hero } = profileContent;
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={breadcrumb.homeHref}>{breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <span>{breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="page-hero mp-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>Welcome back, {firstName}</h1>
          </div>
          <div className="mp-chips">
            <span className="mp-chip mp-chip--gold">{membershipType}</span>
            {batchYear && <span className="mp-chip">Batch of {batchYear}</span>}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileHero;
