'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { formatDateOfBirth } from '@/app/(view)/common/helper/common.helper';
import { membershipService, MembershipCheckoutError } from '../services/membership.service';

export interface MembershipFormData {
  // Step 1
  mtype: string;
  title: string;
  batch: string;
  first_name: string;
  middle_name: string;
  /** "1985-03-24" */
  dob: string;
  email: string;
  password: string;
  country_code: string;
  mobile: string;
  agree_rules: boolean;
  share_email: boolean;
  // Step 2
  addr1: string;
  addr2: string;
  addr3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const INITIAL_FORM_DATA: MembershipFormData = {
  mtype: 'life',
  title: '',
  batch: '',
  first_name: '',
  middle_name: '',
  dob: '',
  email: '',
  password: '',
  country_code: '+91',
  mobile: '',
  agree_rules: false,
  share_email: false,
  addr1: '',
  addr2: '',
  addr3: '',
  city: '',
  state: '',
  zip: '',
  country: 'India',
};

/** Fields on the address step, so a server error on one of them can send the member back there. */
const ADDRESS_FIELDS = ['addr1', 'addr2', 'addr3', 'city', 'state', 'zip', 'country'];

export function useMembershipHandler() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<MembershipFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetTargetStep, setResetTargetStep] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const scrollFormIntoView = useCallback(() => {
    if (formRef.current) {
      const top = formRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleDropdownChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const validateStep = useCallback(
    (stepNum: number): boolean => {
      if (!formRef.current) return true;
      const currentPanel = formRef.current.querySelector(
        `#ms-p${stepNum}`
      ) as HTMLElement | null;
      if (!currentPanel) return true;

      const elements = currentPanel.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('input, select, textarea');

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.hasAttribute('required') && !el.value) {
          const customDropdown = el.closest('.c-dropdown');
          if (customDropdown) {
            const trigger = customDropdown.querySelector<HTMLButtonElement>('.c-dropdown-trigger');
            if (trigger) trigger.focus();
          } else {
            try {
              el.reportValidity();
            } catch (_) {
              el.focus();
            }
          }
          return false;
        }
        if (!el.checkValidity()) {
          try {
            el.reportValidity();
          } catch (_) {
            el.focus();
          }
          return false;
        }
      }
      return true;
    },
    []
  );

  const goToNextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
      scrollFormIntoView();
    }
  }, [step, validateStep, scrollFormIntoView]);

  const goToPrevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
    scrollFormIntoView();
  }, [scrollFormIntoView]);

  const openResetModal = useCallback((targetStep: number) => {
    setResetTargetStep(targetStep);
    setShowResetModal(true);
  }, []);

  const closeResetModal = useCallback(() => {
    setShowResetModal(false);
    setResetTargetStep(null);
  }, []);

  const confirmReset = useCallback(() => {
    if (resetTargetStep === 1) {
      setFormData((prev) => ({
        ...prev,
        title: '',
        batch: '',
        first_name: '',
        middle_name: '',
        dob: '',
        email: '',
        password: '',
        country_code: '+91',
        mobile: '',
        agree_rules: false,
        share_email: false,
      }));
    } else if (resetTargetStep === 2) {
      setFormData((prev) => ({
        ...prev,
        addr1: '',
        addr2: '',
        addr3: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
      }));
    }
    closeResetModal();
  }, [resetTargetStep, closeResetModal]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (
        e.key === 'Enter' &&
        step < 3 &&
        e.target instanceof HTMLInputElement &&
        e.target.type !== 'checkbox'
      ) {
        e.preventDefault();
        goToNextStep();
      }
    },
    [step, goToNextStep]
  );

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
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (step < 3) {
        goToNextStep();
        return;
      }
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const checkout = await membershipService.checkout(formData);
        membershipService.redirectToGateway(checkout);
      } catch (error) {
        setIsSubmitting(false);
        if (error instanceof MembershipCheckoutError && error.fields) {
          const [firstField, firstMessage] = Object.entries(error.fields)[0] ?? [];
          if (firstField) setStep(ADDRESS_FIELDS.includes(firstField) ? 2 : 1);
          setSubmitError(firstMessage || error.message);
          return;
        }
        setSubmitError(error instanceof Error ? error.message : 'We could not start the payment. Please try again.');
      }
    },
    [step, goToNextStep, isSubmitting, formData]
  );

  const reviewItems = [
    {
      label: 'Name',
      value: [
        formData.title,
        formData.first_name,
        formData.middle_name,
      ]
        .filter(Boolean)
        .join(' '),
    },
    { label: 'Batch', value: formData.batch },
    { label: 'Date of birth', value: formatDateOfBirth(formData.dob) },
    { label: 'Email', value: formData.email },
    {
      label: 'Mobile',
      value: [formData.country_code, formData.mobile].filter(Boolean).join(' '),
    },
    {
      label: 'Address',
      value: [
        formData.addr1,
        formData.addr2,
        formData.addr3,
        [formData.city, formData.state].filter(Boolean).join(', ') +
          (formData.zip ? ' ' + formData.zip : ''),
        formData.country,
      ]
        .filter(Boolean)
        .join(', '),
    },
  ];

  return {
    step,
    formData,
    showPassword,
    showResetModal,
    isSubmitting,
    submitError,
    formRef,
    reviewItems,
    handleChange,
    handleDropdownChange,
    togglePasswordVisibility,
    goToNextStep,
    goToPrevStep,
    openResetModal,
    closeResetModal,
    confirmReset,
    handleKeyDown,
    handleSubmit,
  };
}

export default useMembershipHandler;
