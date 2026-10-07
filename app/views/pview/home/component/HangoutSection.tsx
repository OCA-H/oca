import React from 'react';

export const HangoutSection: React.FC = () => {
  return (
    <section className="section band-dark" id="hangout">
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            <span className="eyebrow">OCA Hangout</span>
            <h2 style={{ whiteSpace: "nowrap" }}>Photos &amp; videos from the community</h2>
            <p style={{ color: "#AFC8B6" }}>Cricket, lunches and reunions — <span style={{ color: "var(--gold)", fontWeight: "600" }}>posted live</span> by batches around the world.</p>
          </div>
          <a className="btn btn-gold btn-sm" href="https://www.oldcolumban.net/events-photographs/">View all →</a>
        </div>
    
        <div className="post-carousel-wrap">
          <button className="post-nav prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
    
          <div className="post-carousel" id="postCarousel">
            <article className="post-card" data-type="video">
              <div className="post-media duo-navy"><img />
                <div className="play-btn"><span><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5Z" fill="currentColor"/></svg></span></div>
                <button className="mute-btn" data-muted="true" aria-label="Unmute"><svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg></button>
                <span className="post-duration">2:14</span>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">R. Kapoor</div><div className="post-batch">Batch '88</div></div>
                </div>
                <p className="post-caption-text">Annual Lunch highlights reel — what a turnout this year!</p>
                <div className="post-time">2 days ago</div>
              </div>
            </article>
    
            <article className="post-card" data-type="photo">
              <div className="post-media duo-teal"><img />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M13 21l-1-1-6.36-6.36a5 5 0 1 1 7.07-7.07L13 7l.29-.43a5 5 0 1 1 7.07 7.07L14 20l-1 1Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">S. Mehta</div><div className="post-batch">Batch '95</div></div>
                </div>
                <p className="post-caption-text">Brotherhood, decades on. So good to see everyone again.</p>
                <div className="post-time">3 days ago</div>
              </div>
            </article>
    
            <article className="post-card" data-type="photo">
              <div className="post-media duo-gold"><img />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">A. Bose</div><div className="post-batch">Batch '79</div></div>
                </div>
                <p className="post-caption-text">Batch of '85 reunion — 40 years on and still causing trouble.</p>
                <div className="post-time">5 days ago</div>
              </div>
            </article>
    
            <article className="post-card" data-type="video">
              <div className="post-media duo-teal"><img />
                <div className="play-btn"><span><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5Z" fill="currentColor"/></svg></span></div>
                <button className="mute-btn" data-muted="true" aria-label="Unmute"><svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg></button>
                <span className="post-duration">0:48</span>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">V. Trivedi</div><div className="post-batch">Batch '02</div></div>
                </div>
                <p className="post-caption-text">Cricket at the nets before Sports Day kicks off.</p>
                <div className="post-time">1 week ago</div>
              </div>
            </article>
    
            <article className="post-card" data-type="photo">
              <div className="post-media duo-navy"><img />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">H. Khanna</div><div className="post-batch">Batch '91</div></div>
                </div>
                <p className="post-caption-text">Sports Day 2024 — the tug of war never disappoints.</p>
                <div className="post-time">1 week ago</div>
              </div>
            </article>
    
            <article className="post-card" data-type="photo">
              <div className="post-media duo-gold"><img />
                <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="#fff" strokeWidth="1.4"/></svg></div>
              </div>
              <div className="post-body">
                <div className="post-header">
                  <div className="post-who"><div className="post-name">P. Nair</div><div className="post-batch">Batch '00</div></div>
                </div>
                <p className="post-caption-text">Back on the old campus — the quad hasn't changed a bit.</p>
                <div className="post-time">2 weeks ago</div>
              </div>
            </article>
          </div>
    
          <button className="post-nav next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HangoutSection;
