import React from 'react';

export const DonationView: React.FC = () => {
  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
            <div className="wrap">
              <a href="#/home">Home</a>
              <span className="sep">/</span>
              <span>Donation</span>
            </div>
          </nav>
          
          
          <section className="page-hero">
            <div className="wrap">
              <div>
                <span className="eyebrow">Support OCA</span>
                <h1>Support the future of St. Columba&rsquo;s</h1>
                <p className="lead">Your contribution helps strengthen opportunities for students and preserve the Columban legacy.</p>
                <div className="page-hero-actions">
                  <a className="btn btn-primary" href="#give-form">Make a contribution</a>
                  <a className="btn btn-secondary" href="#/vision-mission">Know more about OCA</a>
                </div>
              </div>
              <div className="page-hero-media">
                <div className="photo-tile duo-gold"><img /><div className="tile-caption"><div className="t">Your help is very important</div></div></div>
                <div className="page-hero-crest"><img /></div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section">
            <div className="wrap">
              <div className="section-head stack">
                <span className="eyebrow">Our Social Conscience</span>
                <h2>Every contribution creates possibilities</h2>
                <p>The Association&rsquo;s prime objective is assisting the School with funds, amenities and inputs from the alumni. Here is where that goes.</p>
              </div>
          
              <div className="impact-band">
                <div className="impact-cell">
                  <div className="fig">01</div>
                  <h4>Education</h4>
                  <p>Teaching resources, the School magazine and the academic programmes the Association helps underwrite.</p>
                </div>
                <div className="impact-cell">
                  <div className="fig">02</div>
                  <h4>Student support</h4>
                  <p>Help for students who need it, and the sponsorship programmes the Association is preparing.</p>
                </div>
                <div className="impact-cell">
                  <div className="fig">03</div>
                  <h4>School development</h4>
                  <p>Amenities and infrastructure at Ashoka Place, including the OCA Centre and Secretariat renovation.</p>
                </div>
                <div className="impact-cell">
                  <div className="fig">04</div>
                  <h4>Community initiatives</h4>
                  <p>Memorial cricket tournaments, sports, reunions and the events that keep Columbans in contact.</p>
                </div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section tint-gold">
            <div className="wrap split-2 media-left">
              <div className="split-media">
                <div className="photo-tile duo-teal"><img /></div>
                <p className="split-caption">The Teachers Benevolent Fund stands behind the staff who spent their careers at the School.</p>
              </div>
              <div>
                <span className="eyebrow">Featured cause</span>
                <h2 style={{ fontSize: "30px", lineHeight: "1.25", marginTop: "8px" }}>The Teachers Benevolent Fund</h2>
                <div className="prose" style={{ marginTop: "18px" }}>
                  <p>The teachers who taught us are still ours to look after. This fund is the Association&rsquo;s standing commitment to the staff of St. Columba&rsquo;s School, and it is the first place a general contribution goes.</p>
                </div>
                <div className="progress-track" style={{ marginTop: "26px" }}><div className="progress-fill" style={{ width: "7%" }}></div></div>
                <div className="fund-meta"><span>7% donated</span><span><strong>&#8377;15,68,928</strong> / &#8377;2,00,00,000</span></div>
          
                <div className="ask-ribbon" style={{ marginTop: "28px" }}>
                  <div className="ask-item">
                    <div className="ask-item-top">
                      <div className="ask-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6"/></svg></div>
                      <div><h5>OCA Centre &amp; Secretariat renovation</h5><p>Budget &#8377;20 lacs sponsorship solicited</p></div>
                    </div>
                  </div>
                  <div className="ask-item">
                    <div className="ask-item-top">
                      <div className="ask-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 5H5v1a3 3 0 0 0 3 3M16 5h3v1a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 12v3M9 19h6M10 15h4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2Z" stroke="currentColor" strokeWidth="1.6"/></svg></div>
                      <div><h5>Brother Oman Memorial Cricket Tournament</h5><p>&#8377;1.50 lacs sponsorship solicited</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          
          <section className="content-section" id="give-form" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
            <div className="wrap form-section">
              <div className="form-aside">
                <span className="eyebrow">Why contribute</span>
                <h2>A school gave you a start. This is how it gets paid forward.</h2>
                <p>Columbans have carried this Association since 1941 &mdash; not through endowments, but through old boys deciding, one at a time, that the School was worth standing behind.</p>
                <div className="aside-quote">
                  <p>Our prime objective is assisting the School with funds, amenities and inputs from the alumni.</p>
                  <div className="who">From the objects of the Association</div>
                </div>
                <div className="aside-links">
                  <a href="#/vision-mission">Know more about OCA &rarr;</a>
                  <a href="#/membership">Become a member &rarr;</a>
                  <a href="#/executive-committee">Who administers the funds &rarr;</a>
                </div>
              </div>
          
              <form className="form-panel-lg">
                <span className="legend">Your contribution</span>
                <div className="field">
                  <label htmlFor="d-amount">Amount (&#8377;) *</label>
                  <div className="amount-row" data-target="d-amount">
                    <button type="button" className="amount-chip" data-value="1100">&#8377;1,100</button>
                    <button type="button" className="amount-chip active" data-value="5100">&#8377;5,100</button>
                    <button type="button" className="amount-chip" data-value="11000">&#8377;11,000</button>
                    <button type="button" className="amount-chip" data-value="51000">&#8377;51,000</button>
                  </div>
                  <input />
                </div>
          
                <div className="field">
                  <label htmlFor="d-purpose">Purpose</label>
                  <select id="d-purpose">
                    <option>Teachers Benevolent Fund</option>
                    <option>OCA Centre &amp; Secretariat renovation</option>
                    <option>Brother Oman Memorial Cricket Tournament</option>
                    <option>Bro Foley Memorial Cricket Tournament</option>
                    <option>General &mdash; wherever it is most needed</option>
                  </select>
                </div>
          
                <span className="legend">Your details</span>
                <div className="field-row">
                  <div className="field"><label htmlFor="d-name">Name *</label><input /></div>
                  <div className="field"><label htmlFor="d-batch">Batch Year</label><input /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label htmlFor="d-email">Email *</label><input /></div>
                  <div className="field"><label htmlFor="d-phone">Phone *</label><input /></div>
                </div>
          
                <span className="legend">Payment option</span>
                <div className="choice-row">
                  <label className="choice">
                    <input />
                    <span><span className="t">UPI</span><span className="s">Instant, from any Indian bank app.</span></span>
                  </label>
                  <label className="choice">
                    <input />
                    <span><span className="t">Card</span><span className="s">Debit or credit, Indian and international.</span></span>
                  </label>
                  <label className="choice">
                    <input />
                    <span><span className="t">Net banking</span><span className="s">Direct from your bank account.</span></span>
                  </label>
                  <label className="choice">
                    <input />
                    <span><span className="t">Bank transfer</span><span className="s">We&rsquo;ll send account details by email.</span></span>
                  </label>
                </div>
          
                <button className="btn btn-primary" type="submit" style={{ marginTop: "20px" }}>Donate</button>
                <p className="form-note">A receipt is issued by the Secretariat for every contribution received.</p>
              </form>
            </div>
          </section>
          
          
          <section className="content-section tight tint-navy-soft">
            <div className="wrap">
              <div className="section-head stack">
                <span className="eyebrow">Before you give</span>
                <h2>What happens to your contribution</h2>
              </div>
              <div className="trust-row" style={{ marginTop: "0", borderTop: "none" }}>
                <div className="trust-cell">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <h5>Secure payment</h5>
                  <p>Payments are processed through the Association&rsquo;s payment gateway. OCA does not store your card or banking details.</p>
                </div>
                <div className="trust-cell">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  <h5>Accounted for, openly</h5>
                  <p>Funds are held by the Treasurer and presented in the audited balance sheet at each Annual General Meeting, circulated to all members.</p>
                </div>
                <div className="trust-cell">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.6"/></svg>
                  <h5>Talk to us first</h5>
                  <p>Call the Secretariat on 011-23748666 or write to <a href="mailto:info@oldcolumban.net">info@oldcolumban.net</a>. St. Columba&rsquo;s School, Ashoka Place, New Delhi &ndash; 110 001.</p>
                </div>
              </div>
            </div>
          </section>
          
          
          <section className="cta-band">
            <div className="wrap">
              <div>
                <span className="eyebrow">Another way to help</span>
                <h2>Membership is the longest contribution of all</h2>
                <p>Lifetime members carry the Association year after year, not just once.</p>
              </div>
              <div className="cta-band-actions">
                <a className="btn btn-gold" href="#/membership">Become a Member</a>
                <a className="btn btn-secondary" href="#/vision-mission">Know more about OCA</a>
              </div>
            </div>
          </section>
          
            </>
  );
};

export default DonationView;
