'use client';

import React from 'react';
import type { AuthUser } from '@/app/(view)/common/helper/useAuth';
import type { SummaryLine } from '../../handler/useAnnualDinnerHandler';

interface PassSubmitSectionProps {
  user: AuthUser | null;
  summaryLines: SummaryLine[];
  total: number;
  selectedPass: string | null;
  isSubmitting: boolean;
  error: string | null;
  onReset: () => void;
}

export const PassSubmitSection: React.FC<PassSubmitSectionProps> = ({
  user,
  summaryLines,
  total,
  selectedPass,
  isSubmitting,
  error,
  onReset,
}) => {
  return (
    <div className="cf-submit">
      {user && (
        <div className="dn-member-card">
          <div className="dn-member-avatar" aria-hidden="true">
            {user.fullName ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'OC'}
          </div>
          <div className="dn-member-details">
            <div className="dn-member-row1">
              <b className="dn-member-name">{user.fullName || 'Columban Member'}</b>
              <span className="dn-member-verified-badge">
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified Member
              </span>
            </div>
            <div className="dn-member-meta">
              <span>Member ID: <strong>{user.memberId}</strong></span>
              {user.batchYear && <span className="dn-member-dot">&bull;</span>}
              {user.batchYear && <span>Batch: <strong>{user.batchYear}</strong></span>}
              {user.membershipType && <span className="dn-member-dot">&bull;</span>}
              {user.membershipType && <span>{user.membershipType}</span>}
            </div>
          </div>
        </div>
      )}

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

      {error && (
        <p className="ms-error" role="alert">
          {error}
        </p>
      )}

      <div className="cf-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!selectedPass || isSubmitting}
        >
          {isSubmitting ? 'Redirecting to payment…' : 'Buy pass'}
        </button>
        <button className="cf-reset" type="button" onClick={onReset} disabled={isSubmitting}>
          Reset form
        </button>
      </div>

      <p className="form-note">
        Payments are processed securely by CCAvenue. Questions about passes? Write to <a href="mailto:info@oldcolumban.net">info@oldcolumban.net</a> or call
        011-23748666.
      </p>
    </div>
  );
};

export default PassSubmitSection;
