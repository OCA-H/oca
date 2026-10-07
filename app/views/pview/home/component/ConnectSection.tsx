import React from 'react';

export const ConnectSection: React.FC = () => {
  return (
    <section className="section" id="connect" style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">OCA Connect Programme</span>
          <h2>Stay involved, wherever you are</h2>
        </div>
        <div className="connect-grid">
          <div className="connect-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h4>News Makers</h4>
            <p>Profiles of Columbans' success and achievements.</p>
          </div>
          <div className="connect-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h4>Alumni Services</h4>
            <p>Support services available exclusively to members.</p>
          </div>
          <div className="connect-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h4>Careers &amp; Networking</h4>
            <p>Career opportunities and professional networking among Columbans.</p>
          </div>
          <div className="connect-card">
            <div className="qa-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.6"/></svg></div>
            <h4>OCA Internships Program</h4>
            <p>Apprenticeship &amp; internship placements — coming soon.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
