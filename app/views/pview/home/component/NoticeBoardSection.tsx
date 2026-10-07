import React from 'react';

export const NoticeBoardSection: React.FC = () => {
  return (
    <section className="section" style={{ background: "#fff" }}>
      <div className="wrap">
        <div className="spotlight">
          <div className="spotlight-poster">
            <img src="/images/chandrachud-spotlight.png" alt="Justice D. Y. Chandrachud - News Maker" />
          </div>
          <div className="spotlight-body">
            <div className="spotlight-top-row">
              <span className="pill">News Makers · Achievers</span>
              <div className="donor-strip" title="Columbans who've taken their donor pass">
                <div className="donor-chip">SK</div>
                <div className="donor-chip">AA</div>
                <div className="donor-chip">KU</div>
                <div className="donor-chip">+42</div>
                <span className="donor-strip-label">taken their donor pass</span>
              </div>
            </div>
            <h3>Congratulating Columban Justice D. Y. Chandrachud</h3>
            <p>OCA proudly celebrates fellow Columban Justice Dhananjaya Y. Chandrachud on his tenure as Chief Justice of India — one of many Columbans making the school proud across public life, business and the arts.</p>
            <a className="qa-link" style={{ marginTop: "14px", display: "inline-block" }} href="https://www.oldcolumban.net/columbans-profiles-of-success-achievements/">See more News Makers →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoardSection;
