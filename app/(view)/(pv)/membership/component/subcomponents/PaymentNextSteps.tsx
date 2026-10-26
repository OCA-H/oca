import React from 'react';
import Link from 'next/link';
import { MEMBERSHIP_CONTENT } from '../../content/membership.content';
import type { MembershipPaymentState } from '../../handler/useMembershipPaymentStatusHandler';

interface PaymentNextStepsProps {
  state: MembershipPaymentState;
}

export const PaymentNextSteps: React.FC<PaymentNextStepsProps> = ({ state }) => {
  const copy = MEMBERSHIP_CONTENT.paymentStatus.states[state];

  return (
    <section className={`ps-side-card ps-tone-${copy.tone}`} aria-labelledby="ps-next-title">
      <span className="eyebrow">{copy.badge}</span>
      <h3 id="ps-next-title">{copy.nextTitle}</h3>
      <ol className="ps-steps">
        {copy.nextSteps.map((step, i) => (
          <li key={step.title}>
            <span className="ps-step-num">{i + 1}</span>
            <div>
              <b>{step.title}</b>
              <p>{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
      {state === 'paid' && (
        <Link className="ps-side-link" href={copy.secondary.href}>
          {copy.secondary.label} &rarr;
        </Link>
      )}
    </section>
  );
};

export default PaymentNextSteps;
