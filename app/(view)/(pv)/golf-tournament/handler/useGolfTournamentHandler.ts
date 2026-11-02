'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/(view)/common/helper/useAuth';
import type { SummaryLine } from '@/app/(view)/(pv)/annual-dinner/handler/useAnnualDinnerHandler';
import type { ApiEventPass } from '@/app/(view)/(pv)/annual-dinner/services/annualDinner.service';
import { GOLF_PASS_OPTIONS, golfTournamentContent, type GolfPassOption } from '../content';
import { toGolfPassOption } from '../helper';
import { golfTournamentService, PassCheckoutError } from '../services';

export function useGolfTournamentHandler() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [spouseName, setSpouseName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [apiPasses, setApiPasses] = useState<ApiEventPass[]>([]);

  // The passes, with their prices and seats, come from the database once the member is signed in
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    golfTournamentService.getPasses().then((passes) => {
      if (isMounted && passes.length > 0) setApiPasses(passes);
    });
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

  const passes = useMemo<GolfPassOption[]>(
    () =>
      apiPasses.length > 0
        ? [...apiPasses].sort((a, b) => a.displayOrder - b.displayOrder).map(toGolfPassOption)
        : GOLF_PASS_OPTIONS,
    [apiPasses]
  );

  // The tier's title and date pill are the same on every golf pass
  const tier = apiPasses[0]
    ? { title: apiPasses[0].tierTitle, pill: apiPasses[0].batchEligibility ?? golfTournamentContent.tier.pill }
    : golfTournamentContent.tier;

  const currentPass = passes.find((p) => p.passId === selectedPass) ?? null;

  // A preview only: the server prices the booking from the pass table
  const summaryLines: SummaryLine[] = currentPass
    ? [
        { label: currentPass.label, amount: currentPass.price },
        { label: golfTournamentContent.dinner.line, amount: 0, included: true },
      ]
    : [];
  const total = currentPass?.price ?? 0;

  const handleReset = () => {
    setSelectedPass(null);
    setSpouseName('');
    setCheckoutError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentPass) return;

    setIsSubmitting(true);
    setCheckoutError(null);
    try {
      const checkout = await golfTournamentService.checkout(
        currentPass.passId,
        currentPass.spouse ? spouseName.trim() : undefined
      );
      golfTournamentService.redirectToGateway(checkout);
    } catch (error) {
      setIsSubmitting(false);
      setCheckoutError(
        error instanceof PassCheckoutError ? error.message : 'We could not start the payment. Please try again.'
      );
    }
  };

  return {
    tier,
    passes,
    selectedPass,
    setSelectedPass,
    currentPass,
    spouseName,
    setSpouseName,
    summaryLines,
    total,
    isSubmitting,
    checkoutError,
    user,
    isAuthenticated,
    isAuthLoading,
    handleReset,
    handleSubmit,
  };
}

export default useGolfTournamentHandler;
