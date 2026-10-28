'use client';

import React from 'react';
import type { HomeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { Header, Footer, Lightbox } from '@/app/(view)/common';
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

/** `content` is what admins edit in the admin panel; see app/(view)/(pv)/page.tsx. */
export const HomeView: React.FC<{ content: HomeContent }> = ({ content }) => {
  useHomeHandler();

  return (
    <>
      <Header activeRoute="home" />

      <main id="app">
        <div className="page is-active" id="page-home">
          <HeroSection />
          <EventsSection content={content.events} />
          <HighlightsSection />
          <OfferingsSection content={content.notices} />
          <NoticeBoardSection content={content.spotlight} />
          <HangoutSection content={content.hangout} />
          <BirthdaysSection />
          <SocialConscienceSection content={content.social} />
          <BenefitsSection />
          <ConnectSection />
          <MissionSection />
          <GallerySection />
          <CommitteeSection content={content.committee} />
          <ContactSection />
        </div>
      </main>

      <Footer />
      <Lightbox />
    </>
  );
};

export default HomeView;
