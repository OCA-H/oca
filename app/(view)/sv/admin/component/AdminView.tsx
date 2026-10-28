'use client';

import React from 'react';
import { SECTION_SPECS } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { useAdminHandler } from '../handler';
import { AdminDashboardPanel, AdminDenied, AdminHero, AdminSidebar, AdminSkeleton, SectionEditorPanel } from './subcomponents';

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
          </main>
        </div>
      </section>
    </div>
  );
};

export default AdminView;
