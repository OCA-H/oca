import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, RichText, SectionHead } from '@/app/(view)/common/component/PageParts';
import type { MagazineContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { schoolMagazineContent as text } from '../content';
import { MagazineArchive, MagazineCard } from './subcomponents';

export const SchoolMagazineView: React.FC<{ content: MagazineContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-navy"
      actions={
        <>
          <a className="btn btn-primary" href="#mag-archive">
            {text.browse}
          </a>
          <Link className="btn btn-secondary" href={text.becomeMember.href}>
            {text.becomeMember.label}
          </Link>
        </>
      }
    />

    {content.featured.length > 0 && (
      <section className="content-section tint-gold">
        <div className="wrap">
          <SectionHead eyebrow={content.featuredEyebrow} title={content.featuredTitle} intro={content.featuredIntro} style={{ marginBottom: 36 }} />
          <div className="mag-feat-row">
            {content.featured.map((item, i) => (
              <MagazineCard key={`${i}-${item.year}`} featured year={item.year} image={item.image} href={item.href} kicker={item.kicker} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>
    )}

    <section className="content-section" id="mag-archive" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <SectionHead eyebrow={content.archiveEyebrow} title={content.archiveTitle} style={{ marginBottom: 28 }} />
        <MagazineArchive editions={content.editions} />
        {content.membersNote && (
          <div className="mag-note">
            <span>
              <RichText text={content.membersNote} />{' '}
              <Link href={text.signIn.href} style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>
                {text.signIn.label}
              </Link>{' '}
              or{' '}
              <Link href={text.becomeMember.href} style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>
                {text.becomeMemberLower}
              </Link>
              .
            </span>
          </div>
        )}
      </div>
    </section>

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.becomeMember.href}>
        {text.becomeMember.label}
      </Link>
      <Link className="btn btn-secondary" href={text.support.href}>
        {text.support.label}
      </Link>
    </CtaBand>
  </>
);

export default SchoolMagazineView;
