import React from 'react';

export const MembershipView: React.FC = () => {
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
            <div className="wrap">
              <a href="#/home">Home</a>
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
                  <a className="btn btn-secondary" href="#/vision-mission">Learn about our mission</a>
                </div>
              </div>
              <div className="page-hero-media">
                <div className="photo-tile duo-teal"><img /><div className="tile-caption"><div className="t">Columbans, many batches</div></div></div>
                <div className="page-hero-crest"><img /></div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section">
            <div className="wrap benefit-split">
              <div>
                <span className="eyebrow">Why join</span>
                <h2 style={{ fontSize: "30px", lineHeight: "1.25", marginTop: "8px" }}>You left the School. You never left the community.</h2>
                <div className="prose" style={{ marginTop: "20px" }}>
                  <p>Membership of the Old Columbans Association is for life. It puts you back on the roll, keeps you in touch with your batch, and makes you part of the body that looks after the School and the people who taught in it.</p>
                </div>
                <div className="patron-strip" style={{ marginTop: "28px" }}>
                  <div className="mono" aria-hidden="true">&ldquo;</div>
                  <div>
                    <p style={{ fontFamily: "var(--serif)", fontSize: "16px", color: "var(--brand-deep)", fontStyle: "italic", marginTop: "0" }}>Sapere aude sincere et constanter &mdash; dare to be wise, sincere and constant.</p>
                    <div className="role" style={{ marginTop: "8px" }}>THE SCHOOL MOTTO</div>
                  </div>
                </div>
              </div>
              <div className="benefit-list">
                  <div className="benefit">
                    <div className="bn">01</div>
                    <div><h4>Stay connected with alumni</h4><p>Your name goes on the roll and into the directory, so batchmates can find you and you can find them &mdash; in Delhi and through chapters worldwide.</p></div>
                  </div>
                  <div className="benefit">
                    <div className="bn">02</div>
                    <div><h4>Participate in events</h4><p>The Annual Lunch Get Together, memorial cricket tournaments, sports days and batch reunions, with notice sent to members first.</p></div>
                  </div>
                  <div className="benefit">
                    <div className="bn">03</div>
                    <div><h4>Access the alumni network</h4><p>Careers, networking and introductions passed between Columbans, plus the OCA Internships Programme for younger members.</p></div>
                  </div>
                  <div className="benefit">
                    <div className="bn">04</div>
                    <div><h4>Support initiatives that matter</h4><p>Members carry the Teachers Benevolent Fund, the Secretariat, and the School causes the Association takes on each year.</p></div>
                  </div>
                  <div className="benefit">
                    <div className="bn">05</div>
                    <div><h4>Contribute to school development</h4><p>Funds, amenities and inputs from the alumni go directly to St. Columba&rsquo;s School, its staff and its students.</p></div>
                  </div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section tint-teal" id="join">
            <div className="wrap form-section">
              <div className="form-aside">
                <span className="eyebrow">Membership application</span>
                <h2>Join the Columban community</h2>
                <p>Fill this in and the Secretariat will be in touch to confirm your batch and complete your enrolment. It takes a few minutes, and it lasts a lifetime.</p>
                <div className="aside-quote">
                  <p>Every name on the roll is one more Columban a batchmate can find again.</p>
                  <div className="who">The OCA Secretariat</div>
                </div>
                <div className="aside-links">
                  <a href="#/vision-mission">Learn about our mission &rarr;</a>
                  <a href="#/executive-committee">Meet the Executive Committee &rarr;</a>
                  <a href="#/donation">Support OCA instead &rarr;</a>
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
                <a className="btn btn-gold" href="https://www.oldcolumban.net/members-2/">Sign In</a>
                <a className="btn btn-secondary" href="#/donation">Support OCA</a>
              </div>
            </div>
          </section>
    </>
  );
};

export default MembershipView;
