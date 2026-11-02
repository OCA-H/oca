'use client';

import React from 'react';
import { GOLF_PASS_OPTIONS, golfTournamentContent } from '../../content';
import { GolfDinnerIncluded, GolfPassNote } from './GolfDinnerIncluded';
import { GolfIcon } from './GolfIcon';

/** The pass form as a signed-out visitor sees it: blurred under the sign-in card, and inert. */
export const GolfPassDummyPreview: React.FC = () => {
  return (
    <div className="dn-passes-content is-blurred" aria-hidden="true">
      <div className="cf-form dn-form gf-form dn-dummy-form">
        <div className="cf-step">
          <span className="cf-num">1</span>
          <h3>Your pass</h3>
        </div>

        <div className="dn-pick">
          <div className="dn-tiers">
            <div className="dn-tier tier-yb">
              <div className="dn-tier-head">
                <span className="dn-tier-ico">
                  <GolfIcon name="flag" />
                </span>
                <div>
                  <h4>{golfTournamentContent.tier.title}</h4>
                  <span className="dn-tier-pill">{golfTournamentContent.tier.pill}</span>
                </div>
              </div>
              {GOLF_PASS_OPTIONS.map((pass) => (
                <div className="dn-pass" key={pass.passId}>
                  <span className="dn-radio" aria-hidden="true"></span>
                  <span className="dn-pass-t">
                    <b>{pass.title}</b>
                    <em className="dn-left">{pass.note}</em>
                  </span>
                  <span className="dn-price">&#8377;{pass.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <GolfDinnerIncluded />
          </div>
        </div>

        <div className="cf-submit">
          <GolfPassNote />
          <div className="dn-login">
            <span className="dn-login-ico">
              <GolfIcon name="lock" />
            </span>
            <p>
              <b>Passes are for signed-in members.</b> Sign in to buy your pass, or apply for membership if you have not
              joined yet. Your details come from your member profile.
            </p>
          </div>
          <div className="dn-summary">
            <div className="dn-lines">
              <p className="dn-empty">{golfTournamentContent.emptyText}</p>
            </div>
            <div className="dn-total">
              <span>Total</span>
              <strong>&#8377;0</strong>
            </div>
          </div>
          <div className="cf-actions">
            <button className="btn btn-primary" type="button" tabIndex={-1}>
              Buy pass
            </button>
            <button className="cf-reset" type="button" tabIndex={-1}>
              Reset form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfPassDummyPreview;
