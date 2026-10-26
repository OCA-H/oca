import React from 'react';
import { MEMBERSHIP_CONTENT } from '../../content/membership.content';
import type { MembershipPaymentState } from '../../handler/useMembershipPaymentStatusHandler';
import { PaymentStatusIcon } from './PaymentStatusIcon';

interface PaymentStatusHeroProps {
  state: MembershipPaymentState;
  firstName: string | null;
  loading: boolean;
}

export const PaymentStatusHero: React.FC<PaymentStatusHeroProps> = ({ state, firstName, loading }) => {
  const content = MEMBERSHIP_CONTENT.paymentStatus;
  const copy = content.states[state];

  return (
    <section className="page-hero cf-hero ps-hero">
      <div className="wrap">
        {loading ? (
          <div className="ps-hero-body" aria-live="polite">
            <span className="ps-hero-icon ps-spin" aria-hidden="true" />
            <div>
              <span className="eyebrow">Payment status</span>
              <h1>{content.loading}</h1>
            </div>
          </div>
        ) : (
          <div className="ps-hero-body" aria-live="polite">
            <span className={`ps-hero-icon ps-tone-${copy.tone}`}>
              <PaymentStatusIcon state={state} />
            </span>
            <div>
              <span className={`eyebrow ps-badge ps-tone-${copy.tone}`}>{copy.badge}</span>
              <h1>{copy.title.replace('{name}', firstName ?? 'Columban')}</h1>
              <p className="lead">{copy.lead}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentStatusHero;
