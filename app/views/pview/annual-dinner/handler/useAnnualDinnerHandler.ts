'use client';

import { useState, useEffect, useMemo } from 'react';
import { PASS_OPTIONS, TEACHER_PRICE, UNDER12_PRICE, ABOVE12_PRICE, PassTier } from '../content';
import { annualDinnerService, type ApiEventPass } from '../services/annualDinner.service';

export interface SummaryLine {
  label: string;
  amount: number;
}

export function useAnnualDinnerHandler() {
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<number>(0);
  const [spouseName, setSpouseName] = useState<string>('');
  const [under12, setUnder12] = useState<number>(0);
  const [above12, setAbove12] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [apiPasses, setApiPasses] = useState<ApiEventPass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    annualDinnerService.getPasses('annual-dinner').then((passes) => {
      if (isMounted) {
        if (passes.length > 0) {
          setApiPasses(passes);
        }
        setIsLoadingPasses(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Map API passes to PassTier record, falling back to static PASS_OPTIONS
  const passOptionsMap = useMemo<Record<string, PassTier>>(() => {
    if (apiPasses.length === 0) return PASS_OPTIONS;

    const map: Record<string, PassTier> = { ...PASS_OPTIONS };
    for (const p of apiPasses) {
      map[p.passId] = {
        id: p.passId as PassTier['id'],
        label: p.label,
        price: p.price,
        group: p.tierGroup as PassTier['group'],
        spouse: p.includesSpouse,
      };
    }
    return map;
  }, [apiPasses]);

  const passesById = useMemo(() => {
    const map: Record<string, ApiEventPass> = {};
    for (const p of apiPasses) {
      map[p.passId] = p;
    }
    return map;
  }, [apiPasses]);

  const currentTier: PassTier | null = selectedPass ? passOptionsMap[selectedPass] || PASS_OPTIONS[selectedPass] : null;

  const summaryLines: SummaryLine[] = [];
  let total = 0;

  if (currentTier) {
    summaryLines.push({ label: currentTier.label, amount: currentTier.price });
    total += currentTier.price;

    if (teachers > 0) {
      const amt = teachers * TEACHER_PRICE;
      summaryLines.push({
        label: `Sponsor ${teachers} teacher${teachers === 1 ? '' : 's'}`,
        amount: amt,
      });
      total += amt;
    }

    if (currentTier.group === 'golden') {
      if (under12 > 0) {
        const amt = under12 * UNDER12_PRICE;
        summaryLines.push({
          label: `${under12} child${under12 === 1 ? '' : 'ren'} under 12`,
          amount: amt,
        });
        total += amt;
      }
      if (above12 > 0) {
        const amt = above12 * ABOVE12_PRICE;
        summaryLines.push({
          label: `${above12} child${above12 === 1 ? '' : 'ren'} above 12`,
          amount: amt,
        });
        total += amt;
      }
    }
  }

  const handleReset = () => {
    setSelectedPass(null);
    setTeachers(0);
    setSpouseName('');
    setUnder12(0);
    setAbove12(0);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPass) return;
    setSubmitted(true);
  };

  return {
    selectedPass,
    setSelectedPass,
    teachers,
    setTeachers,
    spouseName,
    setSpouseName,
    under12,
    setUnder12,
    above12,
    setAbove12,
    currentTier,
    summaryLines,
    total,
    submitted,
    apiPasses,
    passesById,
    isLoadingPasses,
    handleReset,
    handleSubmit,
  };
}

export default useAnnualDinnerHandler;
