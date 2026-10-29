'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { donationContent } from '../content/donation.content';
import { formatCurrency, calculateAmount, amountError } from '../helper/donation.helper';
import { donationService, type ContributionFund } from '../services/donation.service';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { useAuth } from '@/app/(view)/common/helper/useAuth';
import { profileService, type MemberProfile } from '@/app/(view)/sv/profile/services/profile.service';

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

/** The "About you" fields that can be filled in from the member's profile. */
type ProfileFields = Pick<
  DonationFormData,
  'name' | 'batch' | 'email' | 'mobile' | 'address' | 'city' | 'state' | 'pincode' | 'country'
>;

/** The member's saved details, as the form's fields. Empty where the profile has nothing. */
const profileFields = (profile: MemberProfile): ProfileFields => ({
  name: profile.fullName,
  batch: profile.batchYear ?? '',
  email: profile.email,
  mobile: profile.mobile,
  address: [profile.address.line1, profile.address.line2, profile.address.line3].filter(Boolean).join(', '),
  city: profile.address.city,
  state: profile.address.state,
  pincode: profile.address.zip,
  country: profile.address.country || 'India',
});

/**
 * Autofills from the profile. With `overwrite`, every field the profile has a value for is
 * replaced ("Use my profile details"); otherwise only fields the member has left empty are.
 * The email always comes from the account: it cannot be changed on this form.
 */
const fillFromProfile = (prev: DonationFormData, profile: MemberProfile, overwrite: boolean): DonationFormData => {
  const next = { ...prev };
  for (const [key, value] of Object.entries(profileFields(profile)) as [keyof ProfileFields, string][]) {
    if (value && (overwrite || !prev[key])) next[key] = value;
  }
  next.email = profile.email;
  return next;
};

/** A fresh form, with the member's details from their profile once it has loaded. */
const initialFormData = (profile: MemberProfile | null): DonationFormData => {
  const blank: DonationFormData = {
    fund: DEFAULT_FUND,
    amount: DEFAULT_AMOUNT,
    units: '1',
    name: '',
    batch: '',
    email: '',
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
  };
  return profile ? fillFromProfile(blank, profile, true) : blank;
};

export function useDonationHandler() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<DonationFormData>(() => initialFormData(null));
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [funds, setFunds] = useState<ContributionFund[]>([]);
  const [fundsError, setFundsError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Errors the server sent back for particular fields, shown beside them until the field changes. */
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  const clearFieldError = useCallback((...keys: string[]) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => key in prev)) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  }, []);

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

  // Autofill "About you" from the member's profile, without overwriting anything already typed.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    profileService
      .getProfile()
      .then((loaded) => {
        if (!active) return;
        setProfile(loaded);
        setFormData((prev) => fillFromProfile(prev, loaded, false));
      })
      .catch(() => {
        // The member can still fill the form in by hand; the email is set from the account on the server.
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  /** "Use my profile details": refills every field the profile has a value for. */
  const applyProfile = useCallback(() => {
    if (profile) setFormData((prev) => fillFromProfile(prev, profile, true));
  }, [profile]);

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

  const handleFundChange = useCallback(
    (code: string) => {
      setFormData((prev) => ({ ...prev, fund: code }));
      clearFieldError('fund', 'amount', 'units');
    },
    [clearFieldError]
  );

  const handleAmountChip = useCallback(
    (val: number) => {
      setFormData((prev) => ({ ...prev, amount: val }));
      clearFieldError('amount');
    },
    [clearFieldError]
  );

  const handleAmountChange = useCallback(
    (val: number) => {
      setFormData((prev) => ({ ...prev, amount: isNaN(val) ? 0 : val }));
      clearFieldError('amount');
    },
    [clearFieldError]
  );

  const handleUnitsChange = useCallback(
    (units: string) => {
      setFormData((prev) => ({ ...prev, units }));
      clearFieldError('units');
    },
    [clearFieldError]
  );

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
    setFormData(initialFormData(profile));
    setFieldErrors({});
    setSubmitError(null);
    setShowResetModal(false);
  }, [profile]);

  // Returning from CCAvenue with the browser's back button restores this page from the
  // back/forward cache, still showing "Redirecting…".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsSubmitting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const currentFund = useMemo(() => funds.find((f) => f.code === formData.fund) ?? null, [funds, formData.fund]);
  const isPerUnit = Boolean(currentFund?.unitAmount);
  const effectiveAmount = useMemo(
    () => calculateAmount(currentFund, formData.amount, parseInt(formData.units, 10)),
    [currentFund, formData.amount, formData.units]
  );

  /** What is wrong with the "Your contribution" step, checked as the member types; null when it can be paid. */
  const contributionErrors = useMemo(
    () => ({
      fund: fieldErrors.fund ?? (currentFund?.suspended ? `${currentFund.label} is not accepting contributions right now.` : undefined),
      amount: currentFund && !isPerUnit ? (amountError(currentFund, formData.amount) ?? fieldErrors.amount) : undefined,
      units: isPerUnit ? fieldErrors.units : undefined,
    }),
    [fieldErrors, currentFund, isPerUnit, formData.amount]
  );
  const contributionError = contributionErrors.fund ?? contributionErrors.amount ?? contributionErrors.units ?? null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;
      if (contributionError) {
        document.getElementById(isPerUnit ? 'd-units' : 'd-amount')?.focus();
        return;
      }

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
      setFieldErrors({});
      try {
        const checkout = await donationService.checkout(form);
        donationService.redirectToGateway(checkout);
      } catch (error) {
        setIsSubmitting(false);
        if (error instanceof ApiError) setFieldErrors(error.fields);
        const fieldMessage = error instanceof ApiError ? Object.values(error.fields)[0] : undefined;
        setSubmitError(
          fieldMessage ||
            (error instanceof Error ? error.message : 'We could not start the payment. Please try again.')
        );
      }
    },
    [isSubmitting, formData, contributionError, isPerUnit]
  );

  const formattedAmount = useMemo(() => formatCurrency(effectiveAmount), [effectiveAmount]);

  return {
    content: donationContent,
    user,
    isAuthenticated,
    hasProfile: profile !== null,
    applyProfile,
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
    contributionErrors,
    contributionError,
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
