'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import type { EventSportsContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

export const SportsView: React.FC<{ content: EventSportsContent }> = ({ content }) => {
  const contact = useContact();
  const enquiryHref = contact.mailto('Enquiry - OCA Sports');
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <Link href={ROUTES.HOME_EVENTS}>Events</Link>
          <span className="sep">/</span>
          <span>OCA Sports</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="page-hero">
        <div className="wrap">
          <div>
            {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
            <h1>{content.title}</h1>
            {content.lead && <p className="lead">{content.lead}</p>}
            <div className="page-hero-actions">
              <a className="btn btn-primary" href={enquiryHref}>
                Enquire about OCA Sports
              </a>
              <a className="btn btn-secondary" href="#sponsor">
                Support the tournaments
              </a>
            </div>
          </div>

          <div className="page-hero-media">
            <div className="sports-poster">
              <div className="poster-frame">
                <img src={content.image} alt={content.imageAlt} decoding="async" />
                {content.posterChip && <span className="poster-chip">{content.posterChip}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3">
          <div className="fact">
            <div className="fact-num">{content.date}</div>
            {content.dateDetail && <div className="fact-lbl">{content.dateDetail}</div>}
          </div>
          <div className="fact">
            <div className="fact-num">{content.venue}</div>
            {content.venueDetail && <div className="fact-lbl">{content.venueDetail}</div>}
          </div>
          <div className="fact">
            <div className="fact-num">{contact.phone}</div>
            <div className="fact-lbl">Enquiries &mdash; {contact.email}</div>
          </div>
        </div>
      </div>

      {/* In memory */}
      <section className="content-section">
        <div className="wrap benefit-split">
          <div>
            <span className="eyebrow">In Memory</span>
            <h2 style={{ fontSize: '30px', lineHeight: '1.25', marginTop: '8px' }}>
              Cricket, played in the Columban spirit
            </h2>
            <div className="prose" style={{ marginTop: '20px' }}>
              <p>
                The <strong>Brother Foley Memorial Cricket Tournament</strong> is an interschool competition presented
                by the Old Columbans Association in memory of Brother Foley. It is one of the fixtures on OCA&rsquo;s
                sports calendar, alongside the Association&rsquo;s other memorial tournaments.
              </p>
              <p>
                The tournament brings together schools across Delhi-NCR on St. Columba&rsquo;s School Grounds.
                OCA&rsquo;s sports calendar follows from the Association&rsquo;s mission &mdash; to praise, promote and
                protect St. Columba&rsquo;s School and its students, and to keep Columbans together in fellowship.
              </p>
            </div>
          </div>

          <div className="benefit-list">
            <div className="benefit">
              <div className="bn">01</div>
              <div>
                <h4>Interschool competition</h4>
                <p>
                  Schools take the field against one another in a competitive tournament that carries Brother
                  Foley&rsquo;s name.
                </p>
              </div>
            </div>
            <div className="benefit">
              <div className="bn">02</div>
              <div>
                <h4>Played at the School</h4>
                <p>
                  Matches are held on St. Columba&rsquo;s School Grounds, Ashoka Place, New Delhi &mdash; the
                  Association back where it began.
                </p>
              </div>
            </div>
            <div className="benefit">
              <div className="bn">03</div>
              <div>
                <h4>Presented by OCA</h4>
                <p>
                  Part of the Association&rsquo;s sports calendar of memorial tournaments, sports days and reunions that
                  keep Columban sport in front of the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why sport matters */}
      <section className="content-section tint-gold">
        <div className="wrap">
          <div className="section-head stack">
            <span className="eyebrow">Why Sport Matters</span>
            <h2>More than the scoreboard</h2>
          </div>
          <div className="event-info-grid" style={{ marginTop: '28px' }}>
            <div className="qa-card">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.9L12 16.4 6.8 19.2l1-5.9L3.5 9.2l5.9-.9L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Keep School sport alive</h3>
              <p>Memorial tournaments give students a stage, and a reason to play.</p>
            </div>

            <div className="qa-card">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Bring Columbans together</h3>
              <p>Old boys, staff and families on the boundary &mdash; the community, back at the School.</p>
            </div>

            <div className="qa-card">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
              <h3>Honour those who taught us</h3>
              <p>A tournament in a Brother&rsquo;s name keeps his memory in the School&rsquo;s life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship section (Brother Oman Memorial Tournament) */}
      <section className="content-section tint-navy-soft" id="sponsor">
        <div className="wrap split-2 media-left">
          <div>
            <div className="section-head stack" style={{ marginBottom: '20px' }}>
              {content.sponsorEyebrow && <span className="eyebrow">{content.sponsorEyebrow}</span>}
              <h2>{content.sponsorTitle}</h2>
            </div>
            <div className="prose">
              <p>
                The Principal has appealed for sponsorship of this memorial tournament, seeking{' '}
                <strong>{content.sponsorAmount}</strong> in support.
              </p>
              <p>
                If you or your organisation would like to help, write to the Secretariat &mdash; or contribute to the
                Association&rsquo;s causes directly.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn-primary" href={contact.mailto(`Sponsorship - ${content.sponsorTitle}`)}>
                Enquire about sponsoring
              </a>
              <a className="btn btn-secondary" href={ROUTES.DONATION}>
                Contribute to OCA
              </a>
            </div>
          </div>

          <div className="split-media poster-media">
            <div className="poster-wrap">
              <img
                className="poster-img"
                src={content.sponsorImage}
                alt={content.sponsorImageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="split-caption">The Principal&rsquo;s appeal for sponsorship.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">Get Involved</span>
            <h2 className="one-line">Be part of the next match</h2>
            <p>
              Write to the Secretariat to hear about upcoming tournaments, teams and sponsorship &mdash; or revisit the
              moments from past events.
            </p>
          </div>
          <div className="cta-band-actions">
            <a className="btn btn-gold" href={enquiryHref}>
              Write to Us
            </a>
            <a className="btn btn-secondary" href="https://www.oldcolumban.net/platinum-jubilee-lunch/">
              Check Gallery
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default SportsView;
