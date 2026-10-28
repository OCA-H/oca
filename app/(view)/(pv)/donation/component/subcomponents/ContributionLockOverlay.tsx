'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { donationContent } from '../../content/donation.content';

/** Shown over the blurred preview to visitors who are not signed in. */
export const ContributionLockOverlay: React.FC = () => {
  const { lock } = donationContent;

  return (
    <div className="dn-passes-lock-overlay" aria-live="polite">
      <div className="dn-passes-lock-card">
        <div className="dn-passes-lock-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <span className="dn-passes-lock-badge">{lock.badge}</span>
        <h3 className="dn-passes-lock-title">{lock.title}</h3>
        <p className="dn-passes-lock-desc">{lock.description}</p>
        <div className="dn-passes-lock-actions">
          <Link
            href={`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(ROUTES.DONATION_GIVE_FORM)}`}
            className="btn btn-primary"
          >
            {lock.signInLabel}
          </Link>
          <Link href={ROUTES.MEMBERSHIP} className="btn btn-secondary">
            {lock.joinLabel}
          </Link>
        </div>
        <div className="dn-passes-lock-perks">
          {lock.perks.map((perk) => (
            <span key={perk}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {perk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionLockOverlay;
