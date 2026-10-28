import React from 'react';
import Link from 'next/link';
import { adminContent } from '../../content';

export const AdminHero: React.FC = () => {
  const { breadcrumb, hero } = adminContent;
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={breadcrumb.homeHref}>{breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <Link href={breadcrumb.membersHref}>{breadcrumb.membersText}</Link>
          <span className="sep">/</span>
          <span>{breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="page-hero mp-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
          </div>
          <div className="mp-chips">
            <span className="mp-chip mp-chip--gold">{hero.chip}</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminHero;
