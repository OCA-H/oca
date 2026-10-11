'use client';

import React from 'react';

export const AnnualLunchView: React.FC = () => {
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <a href="#/home">Home</a>
          <span className="sep">/</span>
          <a href="#/home!events">Events</a>
          <span className="sep">/</span>
          <span>Annual Lunch Get Together</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="page-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">OCA Flagship Event</span>
            <h1>Annual Lunch Get Together</h1>
            <p className="lead">
              The Association&rsquo;s flagship gathering &mdash; Columbans of every batch, back together for an
              afternoon of food, stories and fellowship.
            </p>
            <div className="page-hero-actions">
              <a
                className="btn btn-primary"
                href="mailto:info@oldcolumban.net?subject=RSVP%20-%20OCA%20Annual%20Lunch%202025"
              >
                RSVP for this year&rsquo;s Lunch
              </a>
              <a className="btn btn-secondary" href="https://www.oldcolumban.net/platinum-jubilee-lunch/">
                Check Gallery
              </a>
            </div>
          </div>

          <div className="page-hero-media">
            <div className="photo-tile duo-gold">
              <img
                className="tile-img"
                src="https://www.oldcolumban.net/wp-content/uploads/2025/12/annual-lunch.jpg"
                alt="OCA Annual Lunch Get Together"
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3">
          <div className="fact">
            <div className="fact-num">14 December</div>
            <div className="fact-lbl">Sunday, 2025</div>
          </div>
          <div className="fact">
            <div className="fact-num">12 Noon</div>
            <div className="fact-lbl">Onwards</div>
          </div>
          <div className="fact">
            <div className="fact-num fact-num--text">St. Columba&rsquo;s</div>
            <div className="fact-lbl">School Grounds, Ashoka Place, New Delhi &ndash; 110 001</div>
          </div>
        </div>
      </div>

      {/* About the lunch */}
      <section className="content-section">
        <div className="wrap split-2">
          <div>
            <div className="section-head stack" style={{ marginBottom: '20px' }}>
              <span className="eyebrow">A Columban Tradition</span>
              <h2>One afternoon, every batch, one brotherhood</h2>
            </div>
            <div className="prose">
              <p>
                Held every year, the <strong>OCA Annual Lunch Get Together</strong> is the one afternoon when Columbans
                from every decade &mdash; the Class of &rsquo;68 and the Class of 2018 alike &mdash; sit at the same
                table again.
              </p>
              <p>
                It&rsquo;s part reunion, part celebration of the School that shaped us, and part reminder that the
                brotherhood forged at St. Columba&rsquo;s never really ends. Expect old photographs, older stories, and
                the kind of laughter that only batchmates can pull out of each other.
              </p>
            </div>
          </div>

          <div className="split-media">
            <div className="photo-tile duo-teal">
              <img
                className="tile-img"
                src="https://www.oldcolumban.net/wp-content/uploads/2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg"
                alt="Columbans of every batch at a previous Annual Lunch"
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
            <p className="split-caption">Columbans of every batch, back together again.</p>
          </div>
        </div>
      </section>

      {/* Why come */}
      <section className="content-section tint-gold">
        <div className="wrap">
          <div className="section-head stack">
            <span className="eyebrow">Why Come</span>
            <h2>What the afternoon is for</h2>
          </div>
          <div className="event-info-grid" style={{ marginTop: '28px' }}>
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
              <h3>Reconnect with your batch</h3>
              <p>Find the people you lost touch with &mdash; and the ones you never did.</p>
            </div>

            <div className="qa-card">
              <div className="qa-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <h3>Celebrate the School</h3>
              <p>A toast to St. Columba&rsquo;s, the teachers, and the motto we all grew up on.</p>
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
              <h3>Family welcome</h3>
              <p>Bring your spouse and kids &mdash; the brotherhood extends to them too.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">Save Your Seat</span>
            <h2 className="one-line">Don&rsquo;t miss this year&rsquo;s Lunch</h2>
            <p>RSVP with the Secretariat so we can plan the tables, the food and the fun &mdash; Columban-sized.</p>
          </div>
          <div className="cta-band-actions">
            <a
              className="btn btn-gold"
              href="mailto:info@oldcolumban.net?subject=RSVP%20-%20OCA%20Annual%20Lunch%202025"
            >
              RSVP Now
            </a>
            <a className="btn btn-secondary" href="#/membership">
              Become a Member
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnnualLunchView;
