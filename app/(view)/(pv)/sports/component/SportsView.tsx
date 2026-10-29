'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useContact } from '@/app/(view)/common/component/ContactProvider';

export const SportsView: React.FC = () => {
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
            <span className="eyebrow">OCA Sports</span>
            <h1>Brother Foley Memorial Cricket Tournament</h1>
            <p className="lead">
              An interschool cricket tournament presented by the Old Columbans Association in memory of
              Brother Foley &mdash; played on the School grounds, in the Columban spirit.
            </p>
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
                <img
                  src="https://www.oldcolumban.net/wp-content/uploads/2022/10/Bro-Foley-Cricket-2022.jpg"
                  alt="Poster: Old Columbans Association presents the Bro. Foley Memorial Cricket Tournament, 5 to 12 November 2022, St. Columba's School Grounds"
                  decoding="async"
                />
                <span className="poster-chip">2022 EDITION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3">
          <div className="fact">
            <div className="fact-num">5&ndash;12 November</div>
            <div className="fact-lbl">2022 Edition</div>
          </div>
          <div className="fact">
            <div className="fact-num">St. Columba&rsquo;s</div>
            <div className="fact-lbl">School Grounds, Ashoka Place, New Delhi</div>
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
              <span className="eyebrow">Support the Game</span>
              <h2>Brother Oman Memorial Interschool Cricket Tournament</h2>
            </div>
            <div className="prose">
              <p>
                The Principal has appealed for sponsorship of this memorial tournament, seeking{' '}
                <strong>₹1.50 Lacs</strong> in support.
              </p>
              <p>
                If you or your organisation would like to help, write to the Secretariat &mdash; or contribute to the
                Association&rsquo;s causes directly.
              </p>
            </div>
            <div className="btn-row">
              <a className="btn btn-primary" href={contact.mailto('Sponsorship - Brother Oman Memorial Cricket Tournament')}>
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
                src="https://www.oldcolumban.net/wp-content/uploads/2022/11/sponsor-new.jpg"
                alt="The Principal's sponsorship appeal for the Brother Oman Memorial Interschool Cricket Tournament"
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
