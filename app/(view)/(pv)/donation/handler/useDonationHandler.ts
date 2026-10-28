'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { donationContent } from '../content/donation.content';
import { formatCurrency, calculateAmount } from '../helper/donation.helper';
import { donationService, type ContributionFund } from '../services/donation.service';
import { ApiError } from '@/app/(view)/common/services/api.service';
import { useAuth, type AuthUser } from '@/app/(view)/common/helper/useAuth';

export interface DonationFormData {
  /** Code of the chosen fund. */
  fund: string;
  amount: number;
  /** Units on a per-unit fund (teachers sponsored). */
  units: string;
  name: string;
  batch: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  g80: 'yes' | 'no';
  pan: string;
  panFile: File | null;
  addressDoc: string;
  addressFile: File | null;
  pay: string;
}

const DEFAULT_FUND = 'tbf';
const DEFAULT_AMOUNT = 5100;

/** A fresh form, with the member's name, email and batch from their account. */
const initialFormData = (user: AuthUser | null): DonationFormData => ({
  fund: DEFAULT_FUND,
  amount: DEFAULT_AMOUNT,
  units: '1',
  name: user?.fullName ?? '',
  batch: user?.batchYear ?? '',
  email: user?.email ?? '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  g80: 'yes',
  pan: '',
  panFile: null,
  addressDoc: '',
  addressFile: null,
  pay: 'upi',
});

export function useDonationHandler() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<DonationFormData>(() => initialFormData(null));
  const [funds, setFunds] = useState<ContributionFund[]>([]);
  const [fundsError, setFundsError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Funds are only loaded for a signed-in member; visitors see the locked preview instead.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    donationService
      .getFunds()
      .then((list) => {
        if (!active) return;
        setFunds(list);
        setFundsError(null);
        // Keep the chosen fund if it can be paid into, else fall back to the first that can.
        setFormData((prev) =>
          list.some((f) => f.code === prev.fund && !f.suspended)
            ? prev
            : { ...prev, fund: list.find((f) => !f.suspended)?.code ?? '' }
        );
      })
      .catch((error) => {
        if (active) setFundsError(error instanceof Error ? error.message : 'We could not load the funds.');
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Fill in who is giving once the member is known, without overwriting anything they typed.
  // Done while rendering (React's pattern for state that follows a changing value), once per member.
  const [prefilledFor, setPrefilledFor] = useState<number | null>(null);
  if (user && prefilledFor !== user.id) {
    setPrefilledFor(user.id);
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.fullName,
      email: prev.email || user.email,
      batch: prev.batch || (user.batchYear ?? ''),
    }));
  }

  // Pre-select fund if user clicks "Contribute to this fund" (data-fund="tbf")
  const preselectFund = useCallback((fundCode: string) => {
    setFormData((prev) => ({ ...prev, fund: fundCode }));
    const el = document.getElementById('give-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Listen for hash or fund link clicks
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const fundAnchor = target?.closest('a[data-fund]') as HTMLAnchorElement | null;
      if (fundAnchor) {
        const fund = fundAnchor.getAttribute('data-fund');
        if (fund) {
          preselectFund(fund);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [preselectFund]);

  const handleFundChange = useCallback((code: string) => {
    setFormData((prev) => ({ ...prev, fund: code }));
  }, []);

  const handleAmountChip = useCallback((val: number) => {
    setFormData((prev) => ({ ...prev, amount: val }));
  }, []);

  const handleAmountChange = useCallback((val: number) => {
    setFormData((prev) => ({ ...prev, amount: isNaN(val) ? 0 : val }));
  }, []);

  const handleUnitsChange = useCallback((units: string) => {
    setFormData((prev) => ({ ...prev, units }));
  }, []);

  const handleDropdownChange = useCallback((field: keyof DonationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      const checked = (e.target as HTMLInputElement).checked;
      if (checked) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleFileChange = useCallback(
    (field: 'panFile' | 'addressFile', file: File | null) => {
      setFormData((prev) => ({ ...prev, [field]: file }));
    },
    []
  );

  const openResetModal = useCallback(() => setShowResetModal(true), []);
  const closeResetModal = useCallback(() => setShowResetModal(false), []);

  const confirmReset = useCallback(() => {
    setFormData(initialFormData(user));
    setShowResetModal(false);
  }, [user]);

  // Returning from CCAvenue with the browser's back button restores this page from the
  // back/forward cache, still showing "Redirecting…".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsSubmitting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      const form = new FormData();
      const { panFile, addressFile, addressDoc, ...fields } = formData;
      for (const [key, value] of Object.entries(fields)) form.append(key, String(value));
      if (formData.g80 === 'yes') {
        form.append('address_doc', addressDoc);
        if (panFile) form.append('pan_file', panFile);
        if (addressFile) form.append('address_file', addressFile);
      }

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const checkout = await donationService.checkout(form);
        donationService.redirectToGateway(checkout);
      } catch (error) {
        setIsSubmitting(false);
        const fieldMessage = error instanceof ApiError ? Object.values(error.fields)[0] : undefined;
        setSubmitError(
          fieldMessage ||
            (error instanceof Error ? error.message : 'We could not start the payment. Please try again.')
        );
      }
    },
    [isSubmitting, formData]
  );

  const currentFund = useMemo(() => funds.find((f) => f.code === formData.fund) ?? null, [funds, formData.fund]);
  const isPerUnit = Boolean(currentFund?.unitAmount);
  const effectiveAmount = useMemo(
    () => calculateAmount(currentFund, formData.amount, parseInt(formData.units, 10)),
    [currentFund, formData.amount, formData.units]
  );

  const formattedAmount = useMemo(() => formatCurrency(effectiveAmount), [effectiveAmount]);

  return {
    content: donationContent,
    user,
    isAuthenticated,
    funds,
    fundsError,
    currentFund,
    formData,
    isPerUnit,
    effectiveAmount,
    formattedAmount,
    showResetModal,
    isSubmitting,
    submitError,
    handleFundChange,
    handleAmountChip,
    handleAmountChange,
    handleUnitsChange,
    handleDropdownChange,
    handleChange,
    handleFileChange,
    openResetModal,
    closeResetModal,
    confirmReset,
    handleSubmit,
    preselectFund,
  };
}

export type DonationHandler = ReturnType<typeof useDonationHandler>;

export default useDonationHandler;
