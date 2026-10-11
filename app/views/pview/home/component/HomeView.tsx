'use client';

import React from 'react';
import { Header, Footer, Lightbox } from '@/app/views/common';
import { useHomeHandler } from '../handler/useHomeHandler';
import {
  HeroSection,
  HighlightsSection,
  OfferingsSection,
  NoticeBoardSection,
  HangoutSection,
  BirthdaysSection,
  EventsSection,
  SocialConscienceSection,
  BenefitsSection,
  ConnectSection,
  MissionSection,
  GallerySection,
  CommitteeSection,
  ContactSection,
} from '.';

import { VisionMissionView } from '../../vision-mission';
import { ExecutiveCommitteeView } from '../../executive-committee';
import { MembershipView } from '../../membership';
import { DonationView } from '../../donation';
import { AnnualDinnerView } from '../../annual-dinner';
import { SportsView } from '../../sports';
import { AnnualLunchView } from '../../annual-lunch';
import { MemberSignInView } from '../../member-signin';
import { PartnerOrganizationView } from '../../partner-organization';

export const HomeView: React.FC = () => {
  const { activeRoute } = useHomeHandler();

  return (
    <>
      <Header />

      <main id="app">
        {/* Home Page View */}
        <div className={`page ${activeRoute === 'home' ? 'is-active' : ''}`} id="page-home">
          <HeroSection />
          <EventsSection />
          <HighlightsSection />
          <OfferingsSection />
          <NoticeBoardSection />
          <HangoutSection />
          <BirthdaysSection />
          <SocialConscienceSection />
          <BenefitsSection />
          <ConnectSection />
          <MissionSection />
          <GallerySection />
          <CommitteeSection />
          <ContactSection />
        </div>

        {/* Vision & Mission Subpage */}
        <div className={`page ${activeRoute === 'vision-mission' ? 'is-active' : ''}`} id="page-vision-mission">
          <VisionMissionView />
        </div>

        {/* Executive Committee Subpage */}
        <div className={`page ${activeRoute === 'executive-committee' ? 'is-active' : ''}`} id="page-executive-committee">
          <ExecutiveCommitteeView />
        </div>

        {/* Membership Subpage */}
        <div className={`page ${activeRoute === 'membership' ? 'is-active' : ''}`} id="page-membership">
          <MembershipView />
        </div>

        {/* Donation Subpage */}
        <div className={`page ${activeRoute === 'donation' ? 'is-active' : ''}`} id="page-donation">
          <DonationView />
        </div>

        {/* Annual Dinner Subpage */}
        <div className={`page ${activeRoute === 'annual-dinner' ? 'is-active' : ''}`} id="page-annual-dinner">
          <AnnualDinnerView />
        </div>

        {/* OCA Sports Subpage */}
        <div className={`page ${activeRoute === 'sports' ? 'is-active' : ''}`} id="page-sports">
          <SportsView />
        </div>

        {/* Annual Lunch Subpage */}
        <div className={`page ${activeRoute === 'annual-lunch' ? 'is-active' : ''}`} id="page-annual-lunch">
          <AnnualLunchView />
        </div>

        {/* Member Sign In Subpage */}
        <div className={`page ${activeRoute === 'member-signin' ? 'is-active' : ''}`} id="page-member-signin">
          <MemberSignInView />
        </div>

        {/* Partner Organization Subpage */}
        <div className={`page ${activeRoute === 'partner-organization' ? 'is-active' : ''}`} id="page-partner-organization">
          <PartnerOrganizationView />
        </div>
      </main>

      <Footer />
      <Lightbox />
    </>
  );
};

export default HomeView;
