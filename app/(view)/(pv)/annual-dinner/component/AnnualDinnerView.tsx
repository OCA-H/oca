'use client';

import React from 'react';
import { useAnnualDinnerHandler } from '../handler/useAnnualDinnerHandler';
import {
  AnnualDinnerHero,
  AnnualDinnerAbout,
  ChoosePassSection,
  AnnualDinnerWhyCome,
  AnnualDinnerCTA,
} from './subcomponents';

export const AnnualDinnerView: React.FC = () => {
  const handler = useAnnualDinnerHandler();

  const scrollToAnchor = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Hero & Key Facts Strip */}
      <AnnualDinnerHero onScrollToAnchor={scrollToAnchor} />

      {/* About the Dinner & Passes at a Glance */}
      <AnnualDinnerAbout onScrollToAnchor={scrollToAnchor} />

      {/* Choose Your Pass (Driven by DB API data, with dummy background when unauthenticated) */}
      <ChoosePassSection
        apiPasses={handler.apiPasses}
        selectedPass={handler.selectedPass}
        setSelectedPass={handler.setSelectedPass}
        currentTier={handler.currentTier}
        teachers={handler.teachers}
        setTeachers={handler.setTeachers}
        spouseName={handler.spouseName}
        setSpouseName={handler.setSpouseName}
        under12={handler.under12}
        setUnder12={handler.setUnder12}
        above12={handler.above12}
        setAbove12={handler.setAbove12}
        summaryLines={handler.summaryLines}
        total={handler.total}
        submitted={handler.submitted}
        isSubmitting={handler.isSubmitting}
        bookingResult={handler.bookingResult}
        user={handler.user}
        isAuthenticated={handler.isAuthenticated}
        handleReset={handler.handleReset}
        handleSubmit={handler.handleSubmit}
      />

      {/* Why Come Section */}
      <AnnualDinnerWhyCome />

      {/* Call to Action Band */}
      <AnnualDinnerCTA onScrollToAnchor={scrollToAnchor} />
    </>
  );
};

export default AnnualDinnerView;
