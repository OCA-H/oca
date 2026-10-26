import React from 'react';
import type { MembershipPaymentState } from '../../handler/useMembershipPaymentStatusHandler';

const PATHS: Record<MembershipPaymentState, React.ReactNode> = {
  paid: <path d="M20 6L9 17l-5-5" />,
  failed: <path d="M18 6L6 18M6 6l12 12" />,
  cancelled: <path d="M5 12h14" />,
  pending: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  unknown: <path d="M12 7v6m0 4h.01" />,
};

interface PaymentStatusIconProps {
  state: MembershipPaymentState;
}

export const PaymentStatusIcon: React.FC<PaymentStatusIconProps> = ({ state }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[state]}
  </svg>
);

export default PaymentStatusIcon;
