'use client';

import React from 'react';

export const AnnualDinnerWhyCome: React.FC = () => {
  return (
    <section className="content-section tint-gold">
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">Why come</span>
          <h2>What the evening is for</h2>
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
            <h3>Find your batch again</h3>
            <p>The faces you keep meaning to call, and the ones you never stopped missing.</p>
          </div>

          <div className="qa-card">
            <div className="qa-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <h3>Raise a toast to the School</h3>
            <p>To St. Columba&rsquo;s, to the teachers who shaped us, and to the motto we all grew up on.</p>
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
            <h3>Make it a family evening</h3>
            <p>Spouse passes are available at every level, and the Golden Pass lets you bring the children too.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnualDinnerWhyCome;
