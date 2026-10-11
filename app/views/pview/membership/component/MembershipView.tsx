import React from 'react';
import { ROUTES } from '@/app/views/common/helper/route';

export const MembershipView: React.FC = () => {
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
            <div className="wrap">
              <a href={ROUTES.HOME}>Home</a>
              <span className="sep">/</span>
              <span>Membership</span>
            </div>
          </nav>
          
          
          <section className="page-hero">
            <div className="wrap">
              <div>
                <span className="eyebrow">Membership</span>
                <h1>Become a Member of OCA</h1>
                <p className="lead">Stay connected with generations of Columbans and contribute to the future of our alma mater.</p>
                <div className="page-hero-actions">
                  <a className="btn btn-primary" href="#join">Start your application</a>
                  <a className="btn btn-secondary" href={ROUTES.VISION_MISSION}>Learn about our mission</a>
                </div>
              </div>
              <div className="page-hero-media">
                <div className="photo-tile duo-teal"><img /><div className="tile-caption"><div className="t">Columbans, many batches</div></div></div>
                <div className="page-hero-crest"><img /></div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section" id="join">
            <div className="wrap split-layout">
              <div className="aside-card">
                <span className="eyebrow">Why join</span>
                <h2>Join the Columban community</h2>
                <p>Fill this in and the Secretariat will be in touch to confirm your batch and complete your enrolment. It takes a few minutes, and it lasts a lifetime.</p>
                <div className="aside-quote">
                  <p>Every name on the roll is one more Columban a batchmate can find again.</p>
                  <div className="who">The OCA Secretariat</div>
                </div>
                <div className="aside-links">
                  <a href={ROUTES.VISION_MISSION}>Learn about our mission &rarr;</a>
                  <a href={ROUTES.EXECUTIVE_COMMITTEE}>Meet the Executive Committee &rarr;</a>
                  <a href={ROUTES.DONATION}>Support OCA instead &rarr;</a>
                </div>
              </div>
          
              <form className="form-panel-lg">
                <span className="legend">Your details</span>
                <div className="field-row">
                  <div className="field"><label htmlFor="m-name">Full Name *</label><input /></div>
                  <div className="field"><label htmlFor="m-batch">Batch Year *</label><input /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label htmlFor="m-email">Email *</label><input /></div>
                  <div className="field"><label htmlFor="m-phone">Phone *</label><input /></div>
                </div>
                <div className="field"><label htmlFor="m-address">Address</label><textarea id="m-address" placeholder="Where we should post your membership confirmation"></textarea></div>
                <div className="field"><label htmlFor="m-profession">Profession</label><input /></div>
          
                <span className="legend">Membership type</span>
                <div className="choice-row">
                  <label className="choice">
                    <input />
                    <span><span className="t">Lifetime Membership</span><span className="s">One payment. On the roll for good.</span></span>
                  </label>
                  <label className="choice">
                    <input />
                    <span><span className="t">Associate Membership</span><span className="s">For friends of the School and the Association.</span></span>
                  </label>
                </div>
          
                <button className="btn btn-primary" type="submit" style={{ marginTop: "20px" }}>Submit application</button>
                <p className="form-note">The Secretariat verifies each application against School records before enrolment. Questions? Write to <a href="mailto:info@oldcolumban.net">info@oldcolumban.net</a> or call 011-23748666.</p>
              </form>
            </div>
          </section>
          
          
          <section className="cta-band">
            <div className="wrap">
              <div>
                <span className="eyebrow">Already a member?</span>
                <h2>Keep your details current</h2>
                <p>Sign in to update your batch, address and profession so the directory stays accurate for everyone.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-gold" href={ROUTES.PORTAL_LOGIN}>Sign In</a>
                <a className="btn btn-secondary" href={ROUTES.DONATION}>Support OCA</a>
              </div>
            </div>
          </section>
    </>
  );
};

export default MembershipView;
