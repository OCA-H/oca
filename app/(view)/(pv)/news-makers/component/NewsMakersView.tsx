import React from 'react';
import Link from 'next/link';
import { CtaBand, PageCrumb, PageHero, RichText, SectionHead } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import { SiteLink } from '@/app/(view)/common/component/SiteLink';
import type { NewsMakersContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { newsMakersContent as text } from '../content';

export const NewsMakersView: React.FC<{ content: NewsMakersContent }> = ({ content }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-gold"
      actions={
        <>
          <a className="btn btn-primary" href="#profiles">
            {text.readProfiles}
          </a>
          <MailtoLink className="btn btn-secondary" subject={text.nominate.subject}>
            {text.nominate.label}
          </MailtoLink>
        </>
      }
    />

    <section className="content-section" id="profiles">
      <div className="wrap">
        <SectionHead eyebrow={content.profilesEyebrow} title={content.profilesTitle} intro={content.profilesIntro} />
        <div className="nm-grid">
          {content.profiles.map((profile, i) => (
            <article className="nm-card" key={`${i}-${profile.name}`}>
              {/* The lightbox enlarges these photos (see Lightbox). */}
              <div className="nm-photo">
                <img src={profile.image} alt={profile.imageAlt || profile.name} loading="lazy" decoding="async" />
              </div>
              <div className="nm-content">
                <div className="nm-scroll">
                  {profile.chip && <span className="xc-chip">{profile.chip}</span>}
                  <h3>{profile.name}</h3>
                  {profile.batch && <span className="nm-batch">{profile.batch}</span>}
                  {profile.bio && (
                    <p>
                      <RichText text={profile.bio} />
                    </p>
                  )}
                  {profile.linkHref && (
                    <SiteLink className="nm-more" href={profile.linkHref} target="_blank" rel="noopener noreferrer">
                      {profile.linkLabel || 'Read more →'}
                    </SiteLink>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="content-section tint-teal">
      <div className="wrap">
        <p className="note-band" style={{ textAlign: 'center' }}>
          <strong>{text.noteLead}</strong>
          <br />
          <MailtoLink subject={text.nominate.subject}>{text.nominateShort}</MailtoLink> &middot;{' '}
          <MailtoLink subject={text.correction.subject}>{text.correction.label}</MailtoLink>
        </p>
      </div>
    </section>

    <CtaBand content={content}>
      <Link className="btn btn-gold" href={text.becomeMember.href}>
        {text.becomeMember.label}
      </Link>
      <Link className="btn btn-secondary" href={text.newsletters.href}>
        {text.newsletters.label}
      </Link>
    </CtaBand>
  </>
);

export default NewsMakersView;
