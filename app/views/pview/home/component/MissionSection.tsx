import React from 'react';

export const MissionSection: React.FC = () => {
  return (
    <section className="mission-band" id="about">
      <div className="wrap mission-grid">
        <div>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>Our Mission</span>
          <h2>Praise, promote and protect St. Columba's School</h2>
          <p className="body">OCA's mission is to praise, promote and protect St. Columba's School and its students, and to unite, inform and involve alumni and friends in fellowship and support of each other and the school.</p>
          <a className="btn btn-secondary" style={{ marginTop: "20px", color: "#fff", borderColor: "rgba(255,255,255,.4)" }} href="#/vision-mission">Learn More</a>
        </div>
        <div className="objects-grid">
          <div className="object-card"><h4>Community Centres</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div>
          <div className="object-card"><h4>Data-Driven Approach</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div>
          <div className="object-card"><h4>Focused Support</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
