'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { donationContent } from '../content/donation.content';
import { formatCurrency, getHeadLabel, calculateSponsorAmount } from '../helper/donation.helper';

export interface DonationFormData {
  head: string;
  amount: number;
  teachers: string;
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

const initialFormData: DonationFormData = {
  head: 'tbf',
  amount: 5100,
  teachers: '1',
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

export function useDonationHandler() {
  const [formData, setFormData] = useState<DonationFormData>(initialFormData);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Pre-select fund if user clicks "Contribute to this fund" (data-fund="tbf")
  const preselectFund = useCallback((fundId: string) => {
    setFormData((prev) => ({
      ...prev,
      head: fundId,
      amount: prev.head === 'sponsor' ? 5100 : prev.amount,
    }));
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

  const handleHeadChange = useCallback((newHead: string) => {
    setFormData((prev) => {
      const wasSponsor = prev.head === 'sponsor';
      const isNowSponsor = newHead === 'sponsor';
      let nextAmount = prev.amount;
      if (wasSponsor && !isNowSponsor) {
        nextAmount = 5100;
      }
      return {
        ...prev,
        head: newHead,
        amount: nextAmount,
      };
    });
  }, []);

  const handleAmountChip = useCallback((val: number) => {
    setFormData((prev) => ({ ...prev, amount: val }));
  }, []);

  const handleAmountChange = useCallback((val: number) => {
    setFormData((prev) => ({ ...prev, amount: isNaN(val) ? 0 : val }));
  }, []);

  const handleTeachersChange = useCallback((teachers: string) => {
    setFormData((prev) => ({ ...prev, teachers }));
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
    setFormData(initialFormData);
    setShowResetModal(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitted(true);
      alert('Thank you for your generous contribution to the Old Columbans Association!');
    },
    []
  );

  const isSponsor = formData.head === 'sponsor';
  const effectiveAmount = useMemo(() => {
    if (isSponsor) {
      return calculateSponsorAmount(parseInt(formData.teachers, 10) || 1, donationContent.perTeacherAmount);
    }
    return formData.amount;
  }, [isSponsor, formData.teachers, formData.amount]);

  const formattedAmount = useMemo(() => formatCurrency(effectiveAmount), [effectiveAmount]);
  const currentHeadLabel = useMemo(() => getHeadLabel(formData.head), [formData.head]);

  return {
    content: donationContent,
    formData,
    isSponsor,
    effectiveAmount,
    formattedAmount,
    currentHeadLabel,
    showResetModal,
    isSubmitted,
    handleHeadChange,
    handleAmountChip,
    handleAmountChange,
    handleTeachersChange,
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

export default useDonationHandler;
