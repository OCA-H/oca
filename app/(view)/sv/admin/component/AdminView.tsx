'use client';

import React from 'react';
import { SECTION_SPECS } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { PASS_EVENTS } from '../content';
import { useAdminHandler } from '../handler';
import {
  AdminDashboardPanel,
  AdminDenied,
  AdminHero,
  AdminSidebar,
  AdminSkeleton,
  ContributionHeadsPanel,
  ContributionsPanel,
  EventBookingsPanel,
  EventPassesPanel,
  MembershipsPanel,
  SectionEditorPanel,
} from './subcomponents';

export const AdminView: React.FC = () => {
  const { admin, sections, isLoading, error, isDenied, panel, showPanel, markSaved, handleSignOut, isSigningOut } = useAdminHandler();

  if (isLoading) return <AdminSkeleton panel={panel} />;
  if (isDenied || !admin) return <AdminDenied message={isDenied ? null : error} />;

  const back = () => showPanel('dashboard');

  return (
    <div className={`mp-loaded${isSigningOut ? ' is-leaving' : ''}`}>
      <AdminHero />

      <section className="mp-shell">
        <div className="wrap mp-layout">
          <AdminSidebar admin={admin} panel={panel} onShowPanel={showPanel} onSignOut={handleSignOut} isSigningOut={isSigningOut} />

          <main className="mp-main">
            <AdminDashboardPanel sections={sections} hidden={panel !== 'dashboard'} onShowPanel={showPanel} />
            {/* Every editor stays mounted, so unsaved edits survive a visit to another panel. */}
            {SECTION_SPECS.map((spec) => (
              <SectionEditorPanel key={spec.key} spec={spec} isActive={panel === spec.key} onBack={back} onSaved={markSaved} />
            ))}
            {PASS_EVENTS.map((passEvent) => (
              <React.Fragment key={passEvent.event}>
                <EventPassesPanel passEvent={passEvent} isActive={panel === passEvent.passes} onBack={back} />
                <EventBookingsPanel passEvent={passEvent} isActive={panel === passEvent.bookings} onBack={back} />
              </React.Fragment>
            ))}
            <MembershipsPanel isActive={panel === 'memberships'} onBack={back} />
            <ContributionHeadsPanel isActive={panel === 'funds'} onBack={back} />
            <ContributionsPanel isActive={panel === 'contributions'} onBack={back} />
          </main>
        </div>
      </section>
    </div>
  );
};

export default AdminView;
