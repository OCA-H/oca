'use client';

import React from 'react';
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

export const HomeView: React.FC = () => {
  useHomeHandler();

  return (
    <>
      <Header activeRoute="home" />

      <main id="app">
        <div className="page is-active" id="page-home">
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
      </main>

      <Footer />
      <Lightbox />
    </>
  );
};

export default HomeView;
