'use client';

import React from 'react';
import type { AuthUser } from '@/app/(view)/common/helper/useAuth';
import { PassLockOverlay } from '@/app/(view)/(pv)/annual-dinner/component/subcomponents/PassLockOverlay';
import { PassSubmitSection } from '@/app/(view)/(pv)/annual-dinner/component/subcomponents/PassSubmitSection';
import type { SummaryLine } from '@/app/(view)/(pv)/annual-dinner/handler/useAnnualDinnerHandler';
import { golfTournamentContent, type GolfPassOption } from '../../content';
import { GolfPassNote } from './GolfDinnerIncluded';
import { GolfPassDummyPreview } from './GolfPassDummyPreview';
import { GolfPassGrid } from './GolfPassGrid';

interface GolfPassSectionProps {
  /** Edited in the admin panel; the passes and prices themselves come from the event-pass API. */
  heading: { eyebrow: string; title: string; intro: string };
  tier: { title: string; pill: string };
  passes: GolfPassOption[];
  selectedPass: string | null;
  setSelectedPass: (passId: string) => void;
  currentPass: GolfPassOption | null;
  spouseName: string;
  setSpouseName: (name: string) => void;
  summaryLines: SummaryLine[];
  total: number;
  isSubmitting: boolean;
  checkoutError: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  handleReset: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const GolfPassSection: React.FC<GolfPassSectionProps> = ({
  heading,
  tier,
  passes,
  selectedPass,
  setSelectedPass,
  currentPass,
  spouseName,
  setSpouseName,
  summaryLines,
  total,
  isSubmitting,
  checkoutError,
  user,
  isAuthenticated,
  handleReset,
  handleSubmit,
}) => {
  const lock = golfTournamentContent.lock;

  return (
    <section className="content-section tint-teal dn-passes" id="passes">
      <div className="wrap">
        <div
          className="section-head stack dn-passes-head"
          style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: 'none' }}
        >
          {heading.eyebrow && <span className="eyebrow">{heading.eyebrow}</span>}
          <h2>{heading.title}</h2>
          {heading.intro && <p className="dn-lead">{heading.intro}</p>}
        </div>

        <div className="dn-passes-wrap">
          {!isAuthenticated && <PassLockOverlay description={lock.description} redirect={lock.redirect} perks={lock.perks} />}

          {!isAuthenticated ? (
            <GolfPassDummyPreview />
          ) : (
            <div className="dn-passes-content">
              <form className="cf-form dn-form gf-form" id="golfForm" onSubmit={handleSubmit} autoComplete="off">
                <div className="cf-step">
                  <span className="cf-num">1</span>
                  <h3>Your pass</h3>
                </div>

                <GolfPassGrid tier={tier} passes={passes} selectedPass={selectedPass} onSelectPass={setSelectedPass} />

                <div className="dn-extras" id="gf-extra" hidden={!currentPass?.spouse}>
                  <div className="field">
                    <label htmlFor="gf-spouse">Spouse name</label>
                    <input
                      id="gf-spouse"
                      name="spouse"
                      type="text"
                      placeholder="Please enter name"
                      maxLength={150}
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                    />
                  </div>
                </div>

                <PassSubmitSection
                  notice={<GolfPassNote />}
                  emptyText={golfTournamentContent.emptyText}
                  user={user}
                  summaryLines={summaryLines}
                  total={total}
                  selectedPass={currentPass?.passId ?? null}
                  isSubmitting={isSubmitting}
                  error={checkoutError}
                  onReset={handleReset}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GolfPassSection;
