'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/route';
import type { PassBookingResult } from '../../handler/useAnnualDinnerHandler';

interface PassBookingSuccessProps {
  bookingResult: PassBookingResult;
  onReset: () => void;
}

export const PassBookingSuccess: React.FC<PassBookingSuccessProps> = ({ bookingResult, onReset }) => {
  return (
    <div className="dn-booking-success" aria-live="polite">
      <div className="dn-success-card">
        <div className="dn-success-badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="dn-success-eyebrow">Pass Confirmed</span>
        <h3>Booking Reference: {bookingResult.bookingRef}</h3>
        <p className="dn-success-lead">
          Thank you, <strong>{bookingResult.userName}</strong>. Your pass reservation for the OCA Annual Dinner 2026 has been recorded.
        </p>

        <div className="dn-success-details">
          <div className="dn-success-row">
            <span>Selected Pass</span>
            <b>{bookingResult.passTitle}</b>
          </div>
          {bookingResult.spouseName && (
            <div className="dn-success-row">
              <span>Spouse</span>
              <b>{bookingResult.spouseName}</b>
            </div>
          )}
          {bookingResult.teachers && bookingResult.teachers > 0 && (
            <div className="dn-success-row">
              <span>Teacher Sponsorship</span>
              <b>
                {bookingResult.teachers} Teacher{bookingResult.teachers > 1 ? 's' : ''} (&#8377;
                {(bookingResult.teachers * 5000).toLocaleString('en-IN')})
              </b>
            </div>
          )}
          {bookingResult.under12 && bookingResult.under12 > 0 && (
            <div className="dn-success-row">
              <span>Children under 12</span>
              <b>{bookingResult.under12}</b>
            </div>
          )}
          {bookingResult.above12 && bookingResult.above12 > 0 && (
            <div className="dn-success-row">
              <span>Children above 12</span>
              <b>{bookingResult.above12}</b>
            </div>
          )}
          <div className="dn-success-row dn-success-total">
            <span>Total Amount</span>
            <strong>&#8377;{bookingResult.total.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="dn-success-actions">
          <Link href={ROUTES.MEMBER_PORTAL} className="btn btn-primary">
            Go to Member Portal
          </Link>
          <button type="button" className="btn btn-secondary" onClick={onReset}>
            Book another pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassBookingSuccess;
