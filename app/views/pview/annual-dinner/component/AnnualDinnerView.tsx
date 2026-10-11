'use client';

import React from 'react';
import { useAnnualDinnerHandler } from '../handler/useAnnualDinnerHandler';
import { ROUTES } from '@/app/views/common/helper/route';

export const AnnualDinnerView: React.FC = () => {
  const {
    selectedPass,
    setSelectedPass,
    teachers,
    setTeachers,
    spouseName,
    setSpouseName,
    under12,
    setUnder12,
    above12,
    setAbove12,
    currentTier,
    summaryLines,
    total,
    handleReset,
    handleSubmit,
  } = useAnnualDinnerHandler();

  const scrollToAnchor = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <a href={ROUTES.HOME}>Home</a>
          <span className="sep">/</span>
          <span>Events</span>
          <span className="sep">/</span>
          <span>Annual Dinner Get Together</span>
        </div>
      </nav>

      <section className="page-hero dn-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Save the date</span>
            <h1>OCA Annual Dinner</h1>
            <p className="lead">
              One evening, every batch. Come for the reunion, stay for the stories &mdash; the Columban family is
              gathering at the Qutub Golf Course.
            </p>
            <div className="page-hero-actions">
              <a className="btn btn-primary" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={scrollToAnchor('passes')}>
                Get your pass
              </a>
              <a className="btn btn-secondary" href={ROUTES.ANNUAL_DINNER_DETAILS} onClick={scrollToAnchor('details')}>
                See the details
              </a>
            </div>
          </div>
          <div className="page-hero-media">
            <figure className="dn-poster">
              <img
                src="/images/annual-dinner-poster.jpg"
                alt="Save the date: OCA Annual Dinner, 18th December, Qutub Golf Course. A poster with the OCA crest and an illustration of the St. Columba’s School building."
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Key facts ---------- */}
      <div className="wrap">
        <div className="fact-strip fact-strip--3" id="details">
          <div className="fact">
            <div className="fact-num">18 December</div>
            <div className="fact-lbl">Friday, 2026</div>
          </div>
          <div className="fact">
            <div className="fact-num fact-num--text">Qutub Golf Course</div>
            <div className="fact-lbl">New Delhi</div>
          </div>
          <div className="fact">
            <div className="fact-num">&#8377;2,500</div>
            <div className="fact-lbl">Passes from &mdash; limited numbers</div>
          </div>
        </div>
      </div>

      {/* ---------- About the dinner ---------- */}
      <section className="content-section">
        <div className="wrap split-2">
          <div>
            <div className="section-head stack" style={{ marginBottom: '20px' }}>
              <span className="eyebrow">A Columban tradition</span>
              <h2>One evening, every batch, one brotherhood</h2>
            </div>
            <div className="prose">
              <p>
                Once a year, the Old Columbans Association brings Columbans of every decade to the same table &mdash;
                the Class of &rsquo;68 and the Class of 2018 alike. This December, the evening belongs to us: the{' '}
                <strong>OCA Annual Dinner</strong>, at the Qutub Golf Course on Friday, 18 December.
              </p>
              <p>
                Bring the stories you still tell, and the friends who tell them back to you. Whether you left St.
                Columba&rsquo;s last year or last century, there is a seat at the table with your name on it.
              </p>
            </div>
          </div>
          <aside className="dn-glance" aria-label="Passes at a glance">
            <h3>Passes at a glance</h3>
            <ul>
              <li className="tier-yb">
                <span className="dn-g-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m12 4 10 5-10 5L2 9l10-5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <span className="dn-g-t">
                  <b>Younger Batches</b>
                  <small>Batch 2015&ndash;25 only</small>
                </span>
                <em>from &#8377;2,500</em>
              </li>
              <li className="tier-eb">
                <span className="dn-g-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="dn-g-t">
                  <b>Early Bird</b>
                  <small>All batches</small>
                </span>
                <em>from &#8377;3,500</em>
              </li>
              <li className="tier-reg">
                <span className="dn-g-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M12 7v5l3.2 2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="dn-g-t">
                  <b>Regular</b>
                  <small>All batches &middot; opens after Early Bird</small>
                </span>
                <em className="dn-muted">Opens later</em>
              </li>
              <li className="tier-gold">
                <span className="dn-g-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="dn-g-t">
                  <b>Golden Pass</b>
                  <small>All batches &middot; with spouse</small>
                </span>
                <em>&#8377;15,000</em>
              </li>
            </ul>
            <a className="btn btn-primary" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={scrollToAnchor('passes')}>
              Choose your pass
            </a>
          </aside>
        </div>
      </section>

      {/* ---------- Passes ---------- */}
      <section className="content-section tint-teal dn-passes" id="passes">
        <div className="wrap">
          <div
            className="section-head stack dn-passes-head"
            style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: 'none' }}
          >
            <span className="eyebrow">Passes</span>
            <h2>Choose your pass</h2>
            <p className="dn-lead">
              Passes are limited &mdash; the numbers show how many are left. Once the Early Bird passes are gone, Regular
              passes open.
            </p>
          </div>

          <form className="cf-form dn-form" id="dinnerForm" onSubmit={handleSubmit} autoComplete="on">
            <div className="cf-step">
              <span className="cf-num">1</span>
              <h3>Your pass</h3>
            </div>

            <fieldset className="dn-pick">
              <legend className="dn-sr">Pass option</legend>
              <div className="dn-tiers">
                {/* Younger Batches */}
                <div className={`dn-tier tier-yb ${selectedPass?.startsWith('yb') ? 'is-selected' : ''}`}>
                  <div className="dn-tier-head">
                    <span className="dn-tier-ico">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="m12 4 10 5-10 5L2 9l10-5Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <div>
                      <h4>Younger Batches</h4>
                      <span className="dn-tier-pill">Only for Batch 2015&ndash;25</span>
                    </div>
                  </div>
                  <label className={`dn-pass ${selectedPass === 'yb-single' ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="pass"
                      value="yb-single"
                      checked={selectedPass === 'yb-single'}
                      onChange={() => setSelectedPass('yb-single')}
                      required
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>Single</b>
                      <em className="dn-left">100 left</em>
                    </span>
                    <span className="dn-price">&#8377;2,500</span>
                  </label>
                  <label className={`dn-pass ${selectedPass === 'yb-spouse' ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="pass"
                      value="yb-spouse"
                      checked={selectedPass === 'yb-spouse'}
                      onChange={() => setSelectedPass('yb-spouse')}
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>With spouse</b>
                      <em className="dn-left">50 left</em>
                    </span>
                    <span className="dn-price">&#8377;4,000</span>
                  </label>
                </div>

                {/* Early Bird */}
                <div className={`dn-tier tier-eb ${selectedPass?.startsWith('eb') ? 'is-selected' : ''}`}>
                  <div className="dn-tier-head">
                    <span className="dn-tier-ico">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                        <path
                          d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <h4>Early Bird</h4>
                      <span className="dn-tier-pill">All batches</span>
                    </div>
                  </div>
                  <label className={`dn-pass ${selectedPass === 'eb-single' ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="pass"
                      value="eb-single"
                      checked={selectedPass === 'eb-single'}
                      onChange={() => setSelectedPass('eb-single')}
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>Single</b>
                      <em className="dn-left">99 left</em>
                    </span>
                    <span className="dn-price">&#8377;3,500</span>
                  </label>
                  <label className={`dn-pass ${selectedPass === 'eb-spouse' ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="pass"
                      value="eb-spouse"
                      checked={selectedPass === 'eb-spouse'}
                      onChange={() => setSelectedPass('eb-spouse')}
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>With spouse</b>
                      <em className="dn-left">50 left</em>
                    </span>
                    <span className="dn-price">&#8377;5,000</span>
                  </label>
                </div>

                {/* Regular (locked) */}
                <div className="dn-tier tier-reg is-locked">
                  <div className="dn-tier-head">
                    <span className="dn-tier-ico">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                        <path
                          d="M12 7v5l3.2 2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <h4>Regular</h4>
                      <span className="dn-tier-pill">All batches</span>
                    </div>
                  </div>
                  <div className="dn-locked">
                    <b>Opens after Early Bird</b>
                    <p>Regular passes open once every Early Bird pass has been taken. Pricing is shown when they open.</p>
                    <span className="dn-locked-tag">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                        <path
                          d="M12 7v5l3.2 2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Not open yet
                    </span>
                  </div>
                </div>

                {/* Golden Pass */}
                <div className={`dn-tier tier-gold ${selectedPass === 'golden' ? 'is-selected' : ''}`}>
                  <div className="dn-tier-head">
                    <span className="dn-tier-ico">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <h4>Golden Pass</h4>
                      <span className="dn-tier-pill">All batches</span>
                    </div>
                  </div>
                  <label className={`dn-pass ${selectedPass === 'golden' ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="pass"
                      value="golden"
                      checked={selectedPass === 'golden'}
                      onChange={() => setSelectedPass('golden')}
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>With spouse</b>
                    </span>
                    <span className="dn-price">&#8377;15,000</span>
                  </label>
                  <ul className="dn-perks">
                    <li>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="m5.5 12.5 4.2 4.2L18.5 8"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Add children, under or above 12
                    </li>
                  </ul>
                </div>
              </div>
            </fieldset>

            <div id="dn-step2" hidden={!currentTier}>
              <div className="cf-step">
                <span className="cf-num">2</span>
                <h3>Add-ons</h3>
              </div>

              <div className="dn-sponsor">
                <span className="dn-sponsor-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <div className="dn-sponsor-t">
                  <b>Sponsor a teacher</b>
                  <span>&#8377;5,000 per teacher &middot; available with every pass</span>
                </div>
                <div className="field">
                  <label htmlFor="ad-teachers" className="dn-sr">
                    Number of teachers to sponsor
                  </label>
                  <select
                    id="ad-teachers"
                    name="teachers"
                    value={teachers}
                    onChange={(e) => setTeachers(parseInt(e.target.value, 10))}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? 'None' : i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="dn-extras" id="dn-spouse" hidden={!(currentTier && currentTier.spouse)}>
                <div className="field">
                  <label htmlFor="ad-spouse">Spouse name</label>
                  <input
                    id="ad-spouse"
                    name="spouse"
                    type="text"
                    placeholder="Please enter name"
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="dn-extras dn-addons"
                id="dn-addons"
                hidden={!(currentTier && currentTier.group === 'golden')}
              >
                <h4>Golden Pass extras</h4>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="ad-under12">
                      Children under 12 <span className="dn-note">&#8377;2,500 per child</span>
                    </label>
                    <select
                      id="ad-under12"
                      name="under12"
                      value={under12}
                      onChange={(e) => setUnder12(parseInt(e.target.value, 10))}
                    >
                      {[...Array(7)].map((_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? 'None' : i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="ad-above12">
                      Children above 12 <span className="dn-note">&#8377;3,000 per child</span>
                    </label>
                    <select
                      id="ad-above12"
                      name="above12"
                      value={above12}
                      onChange={(e) => setAbove12(parseInt(e.target.value, 10))}
                    >
                      {[...Array(7)].map((_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? 'None' : i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="cf-submit">
              <div className="dn-login">
                <span className="dn-login-ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <p>
                  <b>Passes are for signed-in members.</b> <a href={ROUTES.MEMBER_SIGNIN}>Sign in</a> to buy your pass, or{' '}
                  <a href={ROUTES.MEMBERSHIP}>apply for membership</a> if you have not joined yet. Your details come from
                  your member profile.
                </p>
              </div>

              <div className="dn-summary" aria-live="polite">
                <div className="dn-lines" id="dn-lines">
                  {summaryLines.length === 0 ? (
                    <p className="dn-empty">Choose a pass above to see your total.</p>
                  ) : (
                    summaryLines.map((line, idx) => (
                      <div className="dn-line" key={idx}>
                        <span>{line.label}</span>
                        <b>&#8377;{line.amount.toLocaleString('en-IN')}</b>
                      </div>
                    ))
                  )}
                </div>
                <div className="dn-total">
                  <span>Total</span>
                  <strong id="dn-total">&#8377;{total.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="cf-actions">
                <button className="btn btn-primary" type="submit">
                  Buy pass
                </button>
                <button className="cf-reset" type="button" onClick={handleReset}>
                  Reset form
                </button>
              </div>

              <p className="form-note">
                Questions about passes? Write to <a href="mailto:info@oldcolumban.net">info@oldcolumban.net</a> or call
                011-23748666.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* ---------- Why come ---------- */}
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

      {/* ---------- CTA ---------- */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">Save your seat</span>
            <h2 className="one-line">Don&rsquo;t miss the Dinner</h2>
            <p>
              Friday, 18 December, at the Qutub Golf Course. Passes are limited &mdash; reserve yours before they&rsquo;re
              gone.
            </p>
          </div>
          <div className="cta-band-actions">
            <a className="btn btn-gold" href={ROUTES.ANNUAL_DINNER_PASSES} onClick={scrollToAnchor('passes')}>
              Get your pass
            </a>
            <a className="btn btn-secondary" href={ROUTES.ANNUAL_LUNCH}>
              See the Annual Lunch
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnnualDinnerView;
