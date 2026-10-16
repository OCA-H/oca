import React from 'react';

export const OfferingsSection: React.FC = () => {
  return (
    <section className="section tint-teal" style={{ paddingTop: "80px" }}>
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            <span className="eyebrow">OCA Notice Board</span>
            <h2>News &amp; Notice(s)</h2>
            <p>The latest word from the OCA Secretariat — AGM notices, elections and community updates.</p>
          </div>
          <span className="pill live">Updated Nov 19, 2025</span>
        </div>
    
        <div className="notice-carousel-wrap">
          <button className="notice-nav prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
    
          <div className="notice-cards" id="noticeCards">
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-navy">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">November 19, 2025</div>
                <h4 className="notice-card-title">OCA – AGM 2025 Reminder &amp; Balance Sheet</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-teal">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">October 31, 2025</div>
                <h4 className="notice-card-title">OCA – AGM and Election Notice 2025</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-gold">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">October 14, 2024</div>
                <h4 className="notice-card-title">OCA – AGM MOM 23rd April 2023</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-navy">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">September 25, 2024</div>
                <h4 className="notice-card-title">OCA AGM Notice to be held on 17th October, 2024</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-teal">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">March 10, 2023</div>
                <h4 className="notice-card-title">OCA – AGM and Election Notice 2023</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
            <article className="notice-card">
              <div className="notice-card-media photo-tile duo-gold">
                <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2016/03/OCA_Newsletter-Volume11.jpg" alt="OCA newsletter and notice" loading="lazy" decoding="async" />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="notice-card-body">
                <div className="notice-card-date">October 14, 2022</div>
                <h4 className="notice-card-title">Become members of the Old Columban Association – Principal Letter</h4>
                <a className="qa-link" href="#">Read more →</a>
              </div>
            </article>
          </div>
    
          <button className="notice-nav next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
