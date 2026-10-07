import React from 'react';

export const SocialConscienceSection: React.FC = () => {
  return (
    <section className="section" id="give" style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">OCA Social Conscience</span>
          <h2>Your help is very important</h2>
          <p>Our prime objective is assisting the School with funds, amenities and inputs from the alumni.</p>
        </div>
    
        <div className="cause-grid">
          <div className="cause-card">
            <div className="photo-tile duo-gold">
              <div className="tile-icon"><img /><svg viewBox="0 0 24 24" fill="none"><path d="M12 14l9-5-9-5-9 5 9 5Zm0 0v7m-9-7v5c0 1 4 3 9 3s9-2 9-3v-5" stroke="#fff" strokeWidth="1.4"/></svg></div>
              <div className="tile-caption"><span className="pill gold" style={{ background: "rgba(255,255,255,.9)" }}>Featured Cause</span></div>
            </div>
            <div className="cause-body">
              <h4>Teachers Benevolent Fund</h4>
              <div className="progress-track"><div className="progress-fill" style={{ width: "7%" }}></div></div>
              <div className="fund-meta"><span>7% Donated</span><span><strong>₹15,68,928</strong> / ₹2,00,00,000</span></div>
              <a className="btn btn-primary btn-sm" style={{ marginTop: "16px", width: "100%" }} href="#/donation">Contribute</a>
            </div>
          </div>
          <div className="cause-card muted">
            <div className="photo-tile duo-navy">
              <div className="tile-icon"><img /><svg viewBox="0 0 24 24" fill="none"><path d="M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5" stroke="#fff" strokeWidth="1.4"/></svg></div>
              <div className="tile-caption"><span className="pill" style={{ background: "rgba(255,255,255,.9)", color: "var(--navy)" }}>Suspended</span></div>
            </div>
            <div className="cause-body">
              <h4>OCA Breakfast Programme</h4>
              <p style={{ fontSize: "13px", color: "var(--text-soft)" }}>Currently suspended. We'll share an update here when the programme resumes.</p>
            </div>
          </div>
          <div className="cause-card muted">
            <div className="photo-tile duo-teal">
              <div className="tile-icon"><img /><svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.65 12 21 12 21Z" stroke="#fff" strokeWidth="1.4"/></svg></div>
              <div className="tile-caption"><span className="pill" style={{ background: "rgba(255,255,255,.9)", color: "var(--teal-dark)" }}>Coming Soon</span></div>
            </div>
            <div className="cause-body">
              <h4>Support a Child</h4>
              <p style={{ fontSize: "13px", color: "var(--text-soft)" }}>A new sponsorship programme is being prepared — check back soon.</p>
            </div>
          </div>
        </div>
    
        <div style={{ textAlign: "center", marginTop: "26px" }}>
          <button type="button" className="btn btn-secondary" disabled>View More</button>
        </div>
    
        <div className="ask-ribbon" style={{ display: "none" }}>
        </div>
      </div>
    </section>
  );
};

export default SocialConscienceSection;
