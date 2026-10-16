'use client';

import { useState, useEffect, useMemo } from 'react';
import { PASS_OPTIONS, TEACHER_PRICE, UNDER12_PRICE, ABOVE12_PRICE, PassTier } from '../content';
import { annualDinnerService, type ApiEventPass } from '../services/annualDinner.service';
import { useAuth, type AuthUser } from '@/app/(view)/common/helper/useAuth';

export interface SummaryLine {
  label: string;
  amount: number;
}

export interface PassBookingResult {
  bookingRef: string;
  passId: string;
  passTitle: string;
  total: number;
  userName: string;
  userEmail: string;
  memberId: string;
  createdAt: string;
  spouseName?: string;
  teachers?: number;
  under12?: number;
  above12?: number;
}

export function useAnnualDinnerHandler() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<number>(0);
  const [spouseName, setSpouseName] = useState<string>('');
  const [under12, setUnder12] = useState<number>(0);
  const [above12, setAbove12] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<PassBookingResult | null>(null);
  const [apiPasses, setApiPasses] = useState<ApiEventPass[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState<boolean>(false);

  // Fetch passes directly from database API when the user is authenticated
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      setIsLoadingPasses(true);
      annualDinnerService
        .getPasses('annual-dinner')
        .then((passes) => {
          if (isMounted) {
            if (passes && passes.length > 0) {
              setApiPasses(passes);
            }
            setIsLoadingPasses(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingPasses(false);
        });
    } else {
      setIsLoadingPasses(false);
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
    setBookingResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedPass || !currentTier) return;

    setIsSubmitting(true);
    try {
      const refCode = `OCA-AD26-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        bookingRef: refCode,
        eventName: 'annual-dinner',
        passId: selectedPass,
        passTitle: currentTier.label,
        total,
        teachers: teachers > 0 ? teachers : undefined,
        spouseName: currentTier.spouse ? spouseName.trim() : undefined,
        under12: currentTier.group === 'golden' && under12 > 0 ? under12 : undefined,
        above12: currentTier.group === 'golden' && above12 > 0 ? above12 : undefined,
        memberId: user?.memberId || '',
        userName: user?.fullName || 'Columban Member',
        userEmail: user?.email || '',
      };

      await annualDinnerService.submitPassBooking(payload);

      setBookingResult({
        bookingRef: refCode,
        passId: selectedPass,
        passTitle: currentTier.label,
        total,
        userName: user?.fullName || 'Columban Member',
        userEmail: user?.email || '',
        memberId: user?.memberId || '',
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        spouseName: currentTier.spouse && spouseName ? spouseName.trim() : undefined,
        teachers: teachers > 0 ? teachers : undefined,
        under12: currentTier.group === 'golden' && under12 > 0 ? under12 : undefined,
        above12: currentTier.group === 'golden' && above12 > 0 ? above12 : undefined,
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    bookingResult,
    apiPasses,
    passesById,
    isLoadingPasses,
    user,
    isAuthenticated,
    isAuthLoading,
    handleReset,
    handleSubmit,
  };
}

export default useAnnualDinnerHandler;

