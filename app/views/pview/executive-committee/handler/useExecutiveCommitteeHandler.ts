'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { executiveCommitteeContent, CommitteeTerm } from '../content/executiveCommittee.content';
import { DropdownOption } from '@/app/views/common';

export function useExecutiveCommitteeHandler() {
  const [activeTermId, setActiveTermId] = useState<string>('ec-2023-25');

  // Sync active term with hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/ec-\d{4}-\d{2}/);
      if (match && match[0]) {
        setActiveTermId(match[0]);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Smooth scroll to a specific committee term
  const scrollToTerm = useCallback((termId: string) => {
    setActiveTermId(termId);
    const element = document.getElementById(termId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectTerm = useCallback(
    (termId: string) => {
      scrollToTerm(termId);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `#/executive-committee!${termId}`);
      }
    },
    [scrollToTerm]
  );

  // Dropdown options formatted for CustomDropdown
  const termDropdownOptions: DropdownOption[] = useMemo(() => {
    return executiveCommitteeContent.terms.map((term: CommitteeTerm) => ({
      label: term.isCurrent ? `${term.jumpLabel} (Current)` : term.jumpLabel,
      value: term.id,
    }));
  }, []);

  return {
    content: executiveCommitteeContent,
    activeTermId,
    termDropdownOptions,
    scrollToTerm,
    handleSelectTerm,
  };
}

export default useExecutiveCommitteeHandler;
