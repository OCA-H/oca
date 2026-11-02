'use client';

import React from 'react';
import type { EventGolfContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { useGolfTournamentHandler } from '../handler/useGolfTournamentHandler';
import type { GolfGlancePrice } from '../helper/golfTournament.helper';
import {
  GolfTournamentHero,
  GolfTournamentAbout,
  GolfPassSection,
  GolfHowItWorks,
  GolfTournamentCTA,
} from './subcomponents';

interface GolfTournamentViewProps {
  content: EventGolfContent;
  /** Single and Couple as priced in the admin panel. */
  prices: Record<'single' | 'couple', GolfGlancePrice>;
}

export const GolfTournamentView: React.FC<GolfTournamentViewProps> = ({ content, prices }) => {
  const handler = useGolfTournamentHandler();

  const scrollToAnchor = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Hero & Key Facts Strip */}
      <GolfTournamentHero content={content} onScrollToAnchor={scrollToAnchor} />

      {/* About the Tournament & Pass at a Glance */}
      <GolfTournamentAbout prices={prices} onScrollToAnchor={scrollToAnchor} />

      {/* Choose Your Pass (Driven by DB API data, with blurred preview when unauthenticated) */}
      <GolfPassSection
        heading={{ eyebrow: content.passesEyebrow, title: content.passesTitle, intro: content.passesIntro }}
        tier={handler.tier}
        passes={handler.passes}
        selectedPass={handler.selectedPass}
        setSelectedPass={handler.setSelectedPass}
        currentPass={handler.currentPass}
        spouseName={handler.spouseName}
        setSpouseName={handler.setSpouseName}
        summaryLines={handler.summaryLines}
        total={handler.total}
        isSubmitting={handler.isSubmitting}
        checkoutError={handler.checkoutError}
        user={handler.user}
        isAuthenticated={handler.isAuthenticated}
        handleReset={handler.handleReset}
        handleSubmit={handler.handleSubmit}
      />

      {/* How It Works */}
      <GolfHowItWorks />

      {/* Call to Action Band */}
      <GolfTournamentCTA onScrollToAnchor={scrollToAnchor} />
    </>
  );
};

export default GolfTournamentView;
