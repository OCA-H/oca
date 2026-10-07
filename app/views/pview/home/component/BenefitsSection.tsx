import React from 'react';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="section tint-navy-soft">
      <div className="wrap">
        <div className="section-head stack">
          <span className="eyebrow">Member Benefits</span>
          <h2>Exclusive Offers for Members</h2>
          <p>Preferred rates and privileges, arranged through the Association for members with a donor pass. Click through for details.</p>
        </div>
        <div className="offer-grid">
          <div className="offer-card">
            <div className="offer-logo-plate"><img /></div>
            <div className="offer-body">
              <h4>MakeMyTrip</h4>
              <p>Preferred fares on flights and hotel bookings for OCA members.</p>
              <a href="#">Click for detail →</a>
            </div>
          </div>
          <div className="offer-card">
            <div className="offer-logo-plate"><img /></div>
            <div className="offer-body">
              <h4>SpiceJet</h4>
              <p>Exclusive fare codes for Columbans travelling with SpiceJet.</p>
              <a href="#">Click for detail →</a>
            </div>
          </div>
          <div className="offer-card">
            <div className="offer-logo-plate"><img /></div>
            <div className="offer-body">
              <h4>Samsung</h4>
              <p>Preferred pricing on Samsung devices for OCA members.</p>
              <a href="#">Click for detail →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
