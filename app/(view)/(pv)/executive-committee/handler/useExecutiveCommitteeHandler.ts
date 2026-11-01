'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { executiveCommitteeContent, CommitteeTerm } from '../content/executiveCommittee.content';
import { DropdownOption } from '@/app/(view)/common';

export function useExecutiveCommitteeHandler(terms: CommitteeTerm[]) {
  const [activeTermId, setActiveTermId] = useState<string>(terms[0]?.id ?? '');

  // Sync active term with hash
  useEffect(() => {
    const handleHash = () => {
      const id = window.location.hash.slice(1);
      if (terms.some((term) => term.id === id)) {
        setActiveTermId(id);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [terms]);

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
        window.history.pushState(null, '', `#${termId}`);
      }
    },
    [scrollToTerm]
  );

  // Dropdown options formatted for CustomDropdown
  const termDropdownOptions: DropdownOption[] = useMemo(() => {
    return terms.map((term: CommitteeTerm) => ({
      label: term.isCurrent ? `${term.jumpLabel} (Current)` : term.jumpLabel,
      value: term.id,
    }));
  }, [terms]);

  return {
    content: executiveCommitteeContent,
    activeTermId,
    termDropdownOptions,
    scrollToTerm,
    handleSelectTerm,
  };
}

export default useExecutiveCommitteeHandler;
