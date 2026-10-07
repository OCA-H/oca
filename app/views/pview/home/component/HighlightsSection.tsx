import React from 'react';

export const HighlightsSection: React.FC = () => {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">Get where you're going</span>
          <h2>Everything the Association offers</h2>
        </div>
        <div className="quick-grid">
          <div className="qa-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></div>
            <h3>Alumni Directory</h3>
            <p>Find batchmates &amp; worldwide chapters.</p>
            <a className="qa-link" href="https://www.oldcolumban.net/find-your-batchmates/">Search →</a>
          </div>
          <div className="qa-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h3>Events</h3>
            <p>Lunches, sports &amp; gatherings.</p>
            <a className="qa-link" href="#events">See what's on →</a>
          </div>
          <div className="qa-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h3>OCA Connect</h3>
            <p>News makers, careers &amp; networking.</p>
            <a className="qa-link" href="#connect">Open →</a>
          </div>
          <div className="qa-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h3>Give Back</h3>
            <p>Teachers Fund &amp; school causes.</p>
            <a className="qa-link" href="#give">See how →</a>
          </div>
          <div className="qa-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM22 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h3>Membership</h3>
            <p>Lifetime membership &amp; benefits.</p>
            <a className="qa-link" href="#/membership">Become a member →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
