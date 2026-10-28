'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { MemberProfile } from '../services';
import { useMembershipCard, useProfileHandler } from '../handler';
import {
  AccountPanel,
  BirthdaysPanel,
  CardPanel,
  DashboardPanel,
  DonorPanel,
  HelpCard,
  PasswordPanel,
  ProfileHero,
  ProfileSidebar,
  ProfileSkeleton,
  SuggestionPanel,
} from './subcomponents';

export const ProfileView: React.FC = () => {
  const {
    profile,
    setProfile,
    isLoading,
    error,
    panel,
    showPanel,
    photoSrc,
    photoMsg,
    handlePhotoChange,
    sentWishes,
    sendWish,
    handleSignOut,
    isSigningOut,
    sessionKey,
  } = useProfileHandler();
  // Starts with the profile when the card is the panel being opened, instead of after it.
  const membershipCard = useMembershipCard(panel === 'card', sessionKey);
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
            <DonorPanel hidden={panel !== 'donor'} onBack={back} />
            <BirthdaysPanel hidden={panel !== 'birthdays'} onBack={back} sentWishes={sentWishes} onWish={sendWish} />
            <SuggestionPanel hidden={panel !== 'suggest'} onBack={back} />
            <PasswordPanel hidden={panel !== 'password'} onBack={back} />
            <HelpCard />
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProfileView;
