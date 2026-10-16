'use client';

import React from 'react';

export const PassDummyPreview: React.FC = () => {
  return (
    <div className="dn-passes-content is-blurred" aria-hidden="true">
      <div className="cf-form dn-form dn-dummy-form">
        <div className="cf-step">
          <span className="cf-num">1</span>
          <h3>Your pass</h3>
        </div>

        <div className="dn-pick">
          <div className="dn-tiers">
            {/* Dummy Younger Batches */}
            <div className="dn-tier tier-yb">
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
                  <span className="dn-tier-pill">Batch Tier &bull;&bull;&bull;&bull;</span>
                </div>
              </div>
              <div className="dn-pass">
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>Single Entry</b>
                  <em className="dn-left">&bull;&bull;&bull; passes left</em>
                </span>
                <span className="dn-price">&#8377;&bull;,&bull;&bull;&bull;</span>
              </div>
              <div className="dn-pass">
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>With Spouse</b>
                  <em className="dn-left">&bull;&bull; passes left</em>
                </span>
                <span className="dn-price">&#8377;&bull;,&bull;&bull;&bull;</span>
              </div>
            </div>

            {/* Dummy Early Bird */}
            <div className="dn-tier tier-eb">
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
                  <span className="dn-tier-pill">All Batches</span>
                </div>
              </div>
              <div className="dn-pass">
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>Single Entry</b>
                  <em className="dn-left">&bull;&bull;&bull; passes left</em>
                </span>
                <span className="dn-price">&#8377;&bull;,&bull;&bull;&bull;</span>
              </div>
              <div className="dn-pass">
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>With Spouse</b>
                  <em className="dn-left">&bull;&bull; passes left</em>
                </span>
                <span className="dn-price">&#8377;&bull;,&bull;&bull;&bull;</span>
              </div>
            </div>

            {/* Dummy Regular */}
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
                  <h4>Regular Pass</h4>
                  <span className="dn-tier-pill">All Batches</span>
                </div>
              </div>
              <div className="dn-locked">
                <b>Opens after Early Bird</b>
                <p>Regular tickets open upon conclusion of Early Bird allocation.</p>
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

            {/* Dummy Golden Pass */}
            <div className="dn-tier tier-gold">
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
                  <span className="dn-tier-pill">All Batches</span>
                </div>
              </div>
              <div className="dn-pass">
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>With Spouse</b>
                </span>
                <span className="dn-price">&#8377;&bull;&bull;,&bull;&bull;&bull;</span>
              </div>
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
                  Add children privileges
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dn-sponsor" style={{ marginTop: '20px' }}>
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
            <span>&#8377;&bull;,&bull;&bull;&bull; per teacher &middot; available with every pass</span>
          </div>
        </div>

        <div className="cf-submit" style={{ marginTop: '20px' }}>
          <div className="dn-summary">
            <div className="dn-line">
              <span>Pass Option</span>
              <b>&#8377;&bull;,&bull;&bull;&bull;</b>
            </div>
            <div className="dn-total">
              <span>Estimated Total</span>
              <strong>&#8377;&bull;&bull;,&bull;&bull;&bull;</strong>
            </div>
          </div>

          <div className="cf-actions">
            <button className="btn btn-primary" type="button" tabIndex={-1}>
              Buy pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassDummyPreview;
