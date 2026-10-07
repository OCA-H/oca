'use client';

import React from 'react';
import { Header, Footer } from '@/app/views/common';
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

export const HomeView: React.FC = () => {
  const { activeRoute } = useHomeHandler();

  return (
    <>
      <Header />

      <main id="app">
        {/* Home Page View */}
        <div className={`page ${activeRoute === 'home' ? 'is-active' : ''}`} id="page-home">
          <HeroSection />
          <HighlightsSection />
          <OfferingsSection />
          <NoticeBoardSection />
          <HangoutSection />
          <BirthdaysSection />
          <EventsSection />
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
      </main>

      <Footer />
    </>
  );
};

export default HomeView;
