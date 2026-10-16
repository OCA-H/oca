'use client';

import React from 'react';
import type { AuthUser } from '@/app/(view)/common/helper/useAuth';
import type { ApiEventPass } from '../../services/annualDinner.service';
import type { PassTier } from '../../content';
import type { SummaryLine, PassBookingResult } from '../../handler/useAnnualDinnerHandler';
import { PassLockOverlay } from './PassLockOverlay';
import { PassDummyPreview } from './PassDummyPreview';
import { PassTierGrid } from './PassTierGrid';
import { PassAddons } from './PassAddons';
import { PassSubmitSection } from './PassSubmitSection';
import { PassBookingSuccess } from './PassBookingSuccess';

interface ChoosePassSectionProps {
  apiPasses: ApiEventPass[];
  selectedPass: string | null;
  setSelectedPass: (passId: string) => void;
  currentTier: PassTier | null;
  teachers: number;
  setTeachers: (num: number) => void;
  spouseName: string;
  setSpouseName: (name: string) => void;
  under12: number;
  setUnder12: (num: number) => void;
  above12: number;
  setAbove12: (num: number) => void;
  summaryLines: SummaryLine[];
  total: number;
  submitted: boolean;
  isSubmitting: boolean;
  bookingResult: PassBookingResult | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  handleReset: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ChoosePassSection: React.FC<ChoosePassSectionProps> = ({
  apiPasses,
  selectedPass,
  setSelectedPass,
  currentTier,
  teachers,
  setTeachers,
  spouseName,
  setSpouseName,
  under12,
  setUnder12,
  above12,
  setAbove12,
  summaryLines,
  total,
  submitted,
  isSubmitting,
  bookingResult,
  user,
  isAuthenticated,
  handleReset,
  handleSubmit,
}) => {
  return (
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

        {submitted && bookingResult ? (
          <PassBookingSuccess bookingResult={bookingResult} onReset={handleReset} />
        ) : (
          <div className="dn-passes-wrap">
            {!isAuthenticated && <PassLockOverlay />}

            {!isAuthenticated ? (
              <PassDummyPreview />
            ) : (
              <div className="dn-passes-content">
                <form className="cf-form dn-form" id="dinnerForm" onSubmit={handleSubmit} autoComplete="on">
                  <div className="cf-step">
                    <span className="cf-num">1</span>
                    <h3>Your pass</h3>
                  </div>

                  {/* Dynamically grouped tiers & pass options loaded from DB API */}
                  <PassTierGrid
                    passes={apiPasses}
                    selectedPass={selectedPass}
                    onSelectPass={setSelectedPass}
                  />

                  {/* Add-ons */}
                  <PassAddons
                    currentTier={currentTier}
                    teachers={teachers}
                    setTeachers={setTeachers}
                    spouseName={spouseName}
                    setSpouseName={setSpouseName}
                    under12={under12}
                    setUnder12={setUnder12}
                    above12={above12}
                    setAbove12={setAbove12}
                  />

                  {/* Member Badge, Order Summary, & Actions */}
                  <PassSubmitSection
                    user={user}
                    summaryLines={summaryLines}
                    total={total}
                    selectedPass={selectedPass}
                    isSubmitting={isSubmitting}
                    onReset={handleReset}
                  />
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChoosePassSection;
