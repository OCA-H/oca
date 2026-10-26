'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useMembershipPaymentStatusHandler } from '../handler/useMembershipPaymentStatusHandler';
import {
  PaymentStatusHero,
  PaymentReceiptCard,
  PaymentNextSteps,
  PaymentHelpCard,
} from './subcomponents';

export const MembershipPaymentStatusView: React.FC = () => {
  const { orderId, order, loading, state, receiptRows, amount, refresh, printReceipt } =
    useMembershipPaymentStatusHandler();

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <Link href={ROUTES.MEMBERSHIP}>Membership</Link>
          <span className="sep">/</span>
          <span>Payment status</span>
        </div>
      </nav>

      {/* Hero: outcome at a glance */}
      <PaymentStatusHero state={state} firstName={order?.firstName ?? null} loading={loading} />

      {/* Receipt + next steps */}
      <section className="content-section cf-section ps-section">
        <div className="wrap ps-layout">
          <PaymentReceiptCard
            state={state}
            rows={receiptRows}
            amount={amount}
            loading={loading}
            onPrint={printReceipt}
            onRefresh={refresh}
          />
          {!loading && (
            <div className="ps-side">
              <PaymentNextSteps state={state} />
              <PaymentHelpCard orderId={order?.orderId ?? orderId} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MembershipPaymentStatusView;
