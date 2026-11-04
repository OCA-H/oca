import React from 'react';
import Link from 'next/link';
import { ComingSoonBox, CtaBand, PageCrumb, PageHero } from '@/app/(view)/common/component/PageParts';
import { MailtoLink } from '@/app/(view)/common/component/ContactLinks';
import type { PhotographsContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import type { HomeGalleryAlbum } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { eventPhotographsContent as text } from '../content';
import { PhotoAlbums } from './subcomponents';

/** `albums` are the home page's gallery albums (Home page → Our Gallery). */
export const EventPhotographsView: React.FC<{ content: PhotographsContent; albums: HomeGalleryAlbum[] }> = ({ content, albums }) => (
  <>
    <PageCrumb trail={text.crumb} />

    <PageHero
      content={content}
      tone="duo-navy"
      actions={
        <>
          <a className="btn btn-primary" href="#ph-albums">
            {text.viewAlbums}
          </a>
          <Link className="btn btn-secondary" href={text.becomeMember.href}>
            {text.becomeMember.label}
          </Link>
        </>
      }
    />

    <section className="content-section" id="ph-albums">
      <div className="wrap">
        <PhotoAlbums albums={albums} />
        <ComingSoonBox
          pill={false}
          narrow={false}
          title={content.soonTitle}
          text={content.soonText}
          action={
            <MailtoLink className="btn btn-secondary" subject={text.shareSubject}>
              {text.sharePhotos}
            </MailtoLink>
          }
        />
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

export default EventPhotographsView;
