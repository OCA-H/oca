import React from 'react';

export const EventsSection: React.FC = () => {
  return (
    <section className="section" id="events">
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">On the calendar</span>
          <h2>Upcoming Events</h2>
          <p>Inviting well-connected Columbans of all batches to take responsibility and leadership as "Batch Coordinators." Email us at info@oldcolumban.net.</p>
        </div>
        <div className="event-row">
          <div className="event-card event-featured">
            <div className="event-media photo-tile duo-gold">
              <img
                className="tile-img"
                src="https://www.oldcolumban.net/wp-content/uploads/2025/12/annual-lunch.jpg"
                alt="OCA Annual Dinner Get Together"
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
              <div className="event-date-chip">18 DEC 2026</div>
              <div className="tile-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="#fff"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
              <div className="tile-caption">
                <div className="t">Annual Dinner</div>
              </div>
            </div>
            <div className="event-body">
              <div className="date">Friday, 18 December 2026</div>
              <h4>OCA – Annual Dinner Get Together</h4>
              <p>An evening with Columbans of every batch, at the Qutub Golf Course.</p>
              <a className="btn btn-primary btn-sm event-cta" href="#/annual-dinner">View Details →</a>
            </div>
            <a className="event-overlay" href="#/annual-dinner" tabIndex={-1} aria-hidden="true"></a>
          </div>

          <div className="event-card">
            <div className="event-media photo-tile duo-navy">
              <img
                className="tile-img"
                src="https://www.oldcolumban.net/wp-content/uploads/2022/10/Bro-Foley-Cricket-2022.jpg"
                alt="Brother Foley Memorial Interschool Cricket Tournament"
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
              <div className="event-date-chip">DEC 2022</div>
              <div className="tile-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z" stroke="#fff" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="tile-caption">
                <div className="t">Cricket Tournament</div>
              </div>
            </div>
            <div className="event-body">
              <div className="date">Dec 2022 – Jan 2023</div>
              <h4>Brother Foley Memorial Interschool Cricket Tournament</h4>
              <p>An interschool cricket tournament held in memory of Brother Foley.</p>
              <a className="btn btn-secondary btn-sm" href="#/sports">View Details →</a>
            </div>
            <a className="event-overlay" href="#/sports" tabIndex={-1} aria-hidden="true"></a>
          </div>

          <div className="event-card">
            <div className="event-media photo-tile duo-teal">
              <img
                className="tile-img"
                src="https://www.oldcolumban.net/wp-content/uploads/2022/11/sponsor-new.jpg"
                alt="Sponsorship appeal for the Brother Oman Memorial Tournament"
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
              <div className="event-date-chip">SPONSORSHIP: ₹1.5L</div>
              <div className="tile-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z" stroke="#fff" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="tile-caption">
                <div className="t">Cricket Tournament</div>
              </div>
            </div>
            <div className="event-body">
              <div className="date">Sponsorship: ₹1.50 Lacs</div>
              <h4>Brother Oman Memorial Interschool Cricket Tournament</h4>
              <p>Principal's appeal for sponsorship of this memorial tournament.</p>
              <a className="btn btn-secondary btn-sm" href="#/sports!sponsor">View Details →</a>
            </div>
            <a className="event-overlay" href="#/sports!sponsor" tabIndex={-1} aria-hidden="true"></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
