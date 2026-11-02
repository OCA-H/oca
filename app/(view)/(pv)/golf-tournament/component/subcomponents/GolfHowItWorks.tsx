'use client';

import React from 'react';
import { GolfIcon } from './GolfIcon';

export const GolfHowItWorks: React.FC = () => {
  return (
    <section className="content-section tint-gold">
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">How it works</span>
          <h2>Three steps to the course</h2>
        </div>
        <div className="event-info-grid" style={{ marginTop: '28px' }}>
          <div className="qa-card">
            <div className="qa-icon">
              <GolfIcon name="ticket" />
            </div>
            <h3>Choose Single or Couple</h3>
            <p>Pick the pass that fits. The Couple pass is for you and your spouse.</p>
          </div>
          <div className="qa-card">
            <div className="qa-icon">
              <GolfIcon name="person" />
            </div>
            <h3>Sign in and buy</h3>
            <p>Passes are for signed-in members, and your details come from your member profile.</p>
          </div>
          <div className="qa-card">
            <div className="qa-icon">
              <GolfIcon name="flag" />
            </div>
            <h3>Play, then dine</h3>
            <p>Tee off from 11:30 am. Your pass also covers the Annual Dinner the same day.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GolfHowItWorks;
