'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { HomeCommitteeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { useExecutiveCommitteeHandler } from '../handler/useExecutiveCommitteeHandler';
import { withAdminOfficeBearers } from '../helper/executiveCommittee.helper';
import {
  ExecutiveCommitteeHero,
  CommitteeJumpNav,
  CurrentCommitteeSection,
  PastCommitteeSection,
  ExecutiveCommitteeCTA,
} from './subcomponents';

export const ExecutiveCommitteeView: React.FC<{ committee?: HomeCommitteeContent }> = ({ committee }) => {
  const { content, activeTermId, handleSelectTerm } = useExecutiveCommitteeHandler();
  const { breadcrumbs, hero, terms, cta } = content;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>{breadcrumbs.homeLabel}</Link>
          <span className="sep">/</span>
          <span>{breadcrumbs.parentLabel}</span>
          <span className="sep">/</span>
          <span>{breadcrumbs.currentLabel}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <ExecutiveCommitteeHero hero={hero} />

      {/* Term Jump Bar */}
      <CommitteeJumpNav
        terms={terms}
        activeTermId={activeTermId}
        onSelectTerm={handleSelectTerm}
      />

      {/* Committee Terms */}
      {terms.map((term) =>
        term.isCurrent ? (
          <CurrentCommitteeSection key={term.id} term={withAdminOfficeBearers(term, committee)} />
        ) : (
          <PastCommitteeSection key={term.id} term={term} />
        )
      )}

      {/* CTA Band */}
      <ExecutiveCommitteeCTA cta={cta} />
    </>
  );
};

export default ExecutiveCommitteeView;
