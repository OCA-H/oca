'use client';

import React from 'react';

/**
 * A blurred stand-in for the contribution form, shown to visitors who are not signed in. It is
 * placeholder data only: no funds, amounts or member details are loaded until they sign in.
 */
export const ContributionDummyPreview: React.FC = () => {
  const placeholderFunds = ['Fund ••••••••', 'Fund ••••••', 'Fund •••••••••', 'Fund •••••'];

  return (
    <div className="dn-passes-content is-blurred" aria-hidden="true">
      <div className="cf-form">
        <div className="cf-step">
          <span className="cf-num">1</span>
          <h3>Your contribution</h3>
        </div>

        <div className="cf-group">
          <div className="cf-heads">
            {placeholderFunds.map((label, i) => (
              <div key={label} className="cf-opt">
                <input type="radio" tabIndex={-1} readOnly checked={i === 0} />
                <span>
                  <b>{label}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-free">
          <div className="field">
            <label>Amount (&#8377;)</label>
            <div className="amount-row">
              {['•,•••', '•,•••', '••,•••', '••,•••'].map((amount, i) => (
                <span key={i} className={`amount-chip ${i === 1 ? 'active' : ''}`}>
                  &#8377;{amount}
                </span>
              ))}
            </div>
            <input type="text" tabIndex={-1} readOnly value="₹ •,•••" />
          </div>
        </div>

        <div className="cf-step">
          <span className="cf-num">2</span>
          <h3>About you</h3>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Name</label>
            <input type="text" tabIndex={-1} readOnly value="•••••• ••••••" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="text" tabIndex={-1} readOnly value="••••••@•••••.•••" />
          </div>
        </div>

        <div className="cf-step">
          <span className="cf-num">3</span>
          <h3>Tax benefit</h3>
        </div>
        <div className="field">
          <label>PAN number</label>
          <input type="text" tabIndex={-1} readOnly value="•••••••••• " />
        </div>

        <div className="cf-submit">
          <div className="cf-summary">
            <span>
              You are giving <strong>&#8377;•,•••</strong> to <em>•••••• ••••</em>
            </span>
          </div>
          <div className="cf-actions">
            <button className="btn btn-primary" type="button" tabIndex={-1}>
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionDummyPreview;
