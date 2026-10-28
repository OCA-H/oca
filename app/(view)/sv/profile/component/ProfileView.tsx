'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { MemberProfile } from '../services';
import { useMembershipCard, useProfileHandler, useProfilePhoto } from '../handler';
import {
  AccountPanel,
  CardPanel,
  ComingSoonPanel,
  DashboardPanel,
  HelpCard,
  PasswordPanel,
  ProfileHero,
  ProfileSidebar,
  ProfileSkeleton,
} from './subcomponents';
import { SOON_PANELS, profileContent } from '../content';

export const ProfileView: React.FC = () => {
  const {
    profile,
    setProfile,
    isLoading,
    error,
    panel,
    showPanel,
    handleSignOut,
    isSigningOut,
    sessionKey,
  } = useProfileHandler();
  // Starts with the profile when the card is the panel being opened, instead of after it.
  const membershipCard = useMembershipCard(panel === 'card', sessionKey);
  const { photoSrc, photoMsg, isPhotoLoading, isPhotoUploading, handlePhotoChange } = useProfilePhoto(profile, setProfile, sessionKey);
  const saveProfile = (saved: MemberProfile) => {
    setProfile(saved);
    membershipCard.refresh();
  };

  if (isLoading) return <ProfileSkeleton panel={panel} />;

  if (!profile) {
    return (
      <section className="mp-shell mp-fade" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '32px' }}>
          <p className="ms-error" role="alert">
            {error || 'Your session could not be verified.'}
          </p>
          <Link href={ROUTES.MEMBER_SIGNIN} className="btn btn-primary" style={{ marginTop: '16px' }}>
            Go to Member Sign In
          </Link>
        </div>
      </section>
    );
  }

  const back = () => showPanel('dashboard');

  return (
    <div className={`mp-loaded${isSigningOut ? ' is-leaving' : ''}`}>
      <ProfileHero firstName={profile.firstName || profile.fullName} membershipType={profile.membershipType} batchYear={profile.batchYear} />

      <section className="mp-shell">
        <div className="wrap mp-layout">
          <ProfileSidebar
            profile={profile}
            panel={panel}
            onShowPanel={showPanel}
            photoSrc={photoSrc}
            isPhotoLoading={isPhotoLoading}
            isPhotoUploading={isPhotoUploading}
            photoMsg={photoMsg}
            onPhotoChange={handlePhotoChange}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
          />

          <main className="mp-main">
            <DashboardPanel profile={profile} hidden={panel !== 'dashboard'} onShowPanel={showPanel} />
            <AccountPanel profile={profile} hidden={panel !== 'account'} onBack={back} onSaved={saveProfile} />
            <CardPanel
              card={membershipCard.card}
              isLoading={membershipCard.isLoading}
              error={membershipCard.error}
              onRetry={membershipCard.retry}
              hidden={panel !== 'card'}
              onBack={back}
            />
            {/* Sections not built yet still have an address; opening it shows Coming soon. */}
            {profileContent.nav
              .flatMap(({ items }) => items)
              .filter((item) => item.panel && SOON_PANELS.has(item.panel))
              .map((item) => (
                <ComingSoonPanel key={item.panel} panel={item.panel!} label={item.label} hidden={panel !== item.panel} onBack={back} />
              ))}
            <PasswordPanel hidden={panel !== 'password'} onBack={back} />
            <HelpCard />
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProfileView;
