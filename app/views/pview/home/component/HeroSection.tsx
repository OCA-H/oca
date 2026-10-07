import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div>
          <span className="hero-est">★ Serving Columbans since 1941</span>
          <h1><span className="nowrap-line">One school. One brotherhood.</span><br /><span style={{ color: "var(--gold)" }}>A lifetime of belonging.</span></h1>
          <p className="lead">OCA's mission is to praise, promote and protect St. Columba's School and its students, and to unite, inform and involve alumni and friends in fellowship and support of each other and the school.</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#/membership">Become a Member</a>
            <a className="btn btn-secondary" href="#events">Explore Events &amp; Connect</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-crest-frame">
            <svg className="hero-rings" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="180" cy="180" r="176" stroke="rgba(201,162,39,.35)" strokeWidth="1"/>
              <circle cx="180" cy="180" r="140" stroke="rgba(255,255,255,.12)" strokeWidth="1"/>
            </svg>
            <img 
              className="hero-crest-img" 
              src="/images/oca-crest.png" 
              alt="Old Columbans Association crest" 
            />
          </div>
        </div>
      </div>
      <div className="hero-ticker">
        <div className="wrap">
          <span className="tick-label">● LIVE</span>
          <div style={{ overflow: "hidden", flex: "1" }}>
            <div className="ticker-track">
              <span><strong>New notice:</strong> OCA – AGM 2025 Reminder &amp; Balance Sheet posted Nov 19, 2025</span>
              <span><strong>Sponsorship open:</strong> Brother Oman Memorial Cricket Tournament — ₹1.50 Lacs</span>
              <span><strong>Today:</strong> 4 Columbans celebrating their birthday — send your wishes</span>
              <span><strong>Fund update:</strong> Teachers Benevolent Fund now at 7% of goal</span>
              <span><strong>New notice:</strong> OCA – AGM 2025 Reminder &amp; Balance Sheet posted Nov 19, 2025</span>
              <span><strong>Sponsorship open:</strong> Brother Oman Memorial Cricket Tournament — ₹1.50 Lacs</span>
              <span><strong>Today:</strong> 4 Columbans celebrating their birthday — send your wishes</span>
              <span><strong>Fund update:</strong> Teachers Benevolent Fund now at 7% of goal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
