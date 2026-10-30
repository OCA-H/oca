'use client';

import React from 'react';
import type { HomeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import type { BirthdayMember } from '@/app/api/(features)/(pview)/birthday/schema';
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

/**
 * `content` is what admins edit in the admin panel, and `birthdays` the members whose date of
 * birth is today; see app/(view)/(pv)/page.tsx.
 */
export const HomeView: React.FC<{ content: HomeContent; birthdays: BirthdayMember[] }> = ({ content, birthdays }) => {
  useHomeHandler();

  return (
    <>
      <Header activeRoute="home" />

      <main id="app">
        <div className="page is-active" id="page-home">
          <HeroSection ticker={content.ticker} birthdayCount={birthdays.length} />
          <EventsSection content={content.events} />
          <HighlightsSection />
          <OfferingsSection content={content.notices} />
          <NoticeBoardSection content={content.spotlight} />
          <HangoutSection content={content.hangout} />
          <BirthdaysSection birthdays={birthdays} />
          <SocialConscienceSection content={content.social} />
          <BenefitsSection />
          <ConnectSection />
          <MissionSection />
          <GallerySection content={content.gallery} />
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
