'use client';

import { useState, useEffect, useMemo } from 'react';
import { PASS_OPTIONS, TEACHER_PRICE, UNDER12_PRICE, ABOVE12_PRICE, PassTier } from '../content';
import { annualDinnerService, PassCheckoutError, type ApiEventPass } from '../services/annualDinner.service';
import { useAuth, type AuthUser } from '@/app/(view)/common/helper/useAuth';

export interface SummaryLine {
  label: string;
  amount: number;
}

export function useAnnualDinnerHandler() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<number>(0);
  const [spouseName, setSpouseName] = useState<string>('');
  const [under12, setUnder12] = useState<number>(0);
  const [above12, setAbove12] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
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

  // Coming back from CCAvenue with the browser's Back button restores this page as it was left
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsSubmitting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
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

  // Add-on prices come from the pass's metadata, as the server charges them
  const selectedMeta = selectedPass ? passesById[selectedPass]?.metadata : null;
  const metaPrice = (key: string, fallback: number) => {
    const value = selectedMeta?.[key];
    return typeof value === 'number' ? value : fallback;
  };
  const teacherPrice = metaPrice('teacherSponsorPrice', TEACHER_PRICE);
  const under12Price = metaPrice('childUnder12Price', UNDER12_PRICE);
  const above12Price = metaPrice('childAbove12Price', ABOVE12_PRICE);

  const summaryLines: SummaryLine[] = [];
  let total = 0;

  if (currentTier) {
    summaryLines.push({ label: currentTier.label, amount: currentTier.price });
    total += currentTier.price;

    if (teachers > 0) {
      const amt = teachers * teacherPrice;
      summaryLines.push({
        label: `Sponsor ${teachers} teacher${teachers === 1 ? '' : 's'}`,
        amount: amt,
      });
      total += amt;
    }

    if (currentTier.group === 'golden') {
      if (under12 > 0) {
        const amt = under12 * under12Price;
        summaryLines.push({
          label: `${under12} child${under12 === 1 ? '' : 'ren'} under 12`,
          amount: amt,
        });
        total += amt;
      }
      if (above12 > 0) {
        const amt = above12 * above12Price;
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
    setCheckoutError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedPass || !currentTier) return;

    setIsSubmitting(true);
    setCheckoutError(null);
    try {
      // The server prices the booking from the pass table; the total shown here is only a preview
      const checkout = await annualDinnerService.checkout({
        eventName: 'annual-dinner',
        passId: selectedPass,
        teachers,
        spouseName: currentTier.spouse ? spouseName.trim() : undefined,
        under12: currentTier.group === 'golden' ? under12 : 0,
        above12: currentTier.group === 'golden' ? above12 : 0,
      });
      annualDinnerService.redirectToGateway(checkout);
    } catch (error) {
      setIsSubmitting(false);
      setCheckoutError(
        error instanceof PassCheckoutError ? error.message : 'We could not start the payment. Please try again.'
      );
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
    isSubmitting,
    checkoutError,
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

