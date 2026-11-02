'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';

const DINNER_PERKS = ['Early bird tier pricing', 'Spouse & family add-on passes', 'Sponsor revered Columban teachers'];

interface PassLockOverlayProps {
  /** Who the passes are for, under the heading. */
  description?: string;
  /** Where sign-in brings the member back to. */
  redirect?: string;
  perks?: string[];
}

/** Over the blurred pass form while signed out. Defaults to the Annual Dinner's wording. */
export const PassLockOverlay: React.FC<PassLockOverlayProps> = ({
  description = 'Become a member or sign in to buy the pass. Passes for the OCA Annual Dinner are reserved exclusively for Old Columbans and their guests.',
  redirect = ROUTES.ANNUAL_DINNER_PASSES,
  perks = DINNER_PERKS,
}) => {
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
        <span className="dn-passes-lock-badge">Members Only</span>
        <h3 className="dn-passes-lock-title">Choose your pass</h3>
        <p className="dn-passes-lock-desc">{description}</p>
        <div className="dn-passes-lock-actions">
          <Link
            href={`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(redirect)}`}
            className="btn btn-primary"
          >
            Sign in to buy pass
          </Link>
          <Link href={ROUTES.MEMBERSHIP} className="btn btn-secondary">
            Become a member
          </Link>
        </div>
        <div className="dn-passes-lock-perks">
          {perks.map((perk) => (
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

export default PassLockOverlay;
