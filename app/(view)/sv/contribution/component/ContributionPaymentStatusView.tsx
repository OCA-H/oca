'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { PaymentStatusIcon } from '@/app/(view)/(pv)/membership/component/subcomponents/PaymentStatusIcon';
import { CONTRIBUTION_PAYMENT_STATUS_CONTENT } from '../content/contributionPaymentStatus.content';
import { useContributionPaymentStatusHandler } from '../handler/useContributionPaymentStatusHandler';
import type { ContributionResult } from '../services/contribution.service';

/** A heart, for a received contribution: thanks rather than a plain tick. */
const HeartIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.5 3.4 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4Z" />
  </svg>
);

interface ContributionPaymentStatusViewProps {
  result: ContributionResult | null;
  orderRef: string | null;
}

export const ContributionPaymentStatusView: React.FC<ContributionPaymentStatusViewProps> = ({ result, orderRef }) => {
  const { state, isPaid, receiptRows, lineLabel, amount, orderId, printReceipt } =
    useContributionPaymentStatusHandler(result, orderRef);
  const content = CONTRIBUTION_PAYMENT_STATUS_CONTENT;
  const copy = content.states[state];
  const helpSubject = encodeURIComponent(`Contribution${orderId ? ` – ${orderId}` : ''}`);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <Link href={ROUTES.DONATION}>Contribute</Link>
          <span className="sep">/</span>
          <span>Payment status</span>
        </div>
      </nav>

      {/* Hero: outcome at a glance */}
      <section className="page-hero cf-hero ps-hero">
        <div className="wrap">
          <div className="ps-hero-body" aria-live="polite">
            <span className={`ps-hero-icon ps-tone-${copy.tone}`}>
              {isPaid ? <HeartIcon /> : <PaymentStatusIcon state={state} />}
            </span>
            <div>
              <span className={`eyebrow ps-badge ps-tone-${copy.tone}`}>{copy.badge}</span>
              <h1>{copy.title}</h1>
              <p className="lead">{copy.lead}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Receipt + next steps */}
      <section className="content-section cf-section ps-section">
        <div className="wrap ps-layout">
          <article className={`ps-card ps-tone-${copy.tone}`} aria-labelledby="ps-receipt-title">
            <div className="ps-card-head">
              <div>
                <span className="ps-card-k">Old Columbans Association</span>
                <h2 id="ps-receipt-title">{content.receiptTitle}</h2>
              </div>
              <span className={`ps-chip ps-tone-${copy.tone}`}>
                <PaymentStatusIcon state={state} />
                {copy.receiptStatus}
              </span>
            </div>

            <div className="ps-card-body">
              {receiptRows.length > 0 && (
                <dl className="ps-rows">
                  {receiptRows.map((row) => (
                    <div key={row.label} className="ps-row">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {amount && lineLabel && (
                <div className="ms-bill ps-bill">
                  <div className="ms-bill-row">
                    <span>{lineLabel}</span>
                    <b>{amount}</b>
                  </div>
                  <div className="ms-bill-total">
                    <span>{isPaid ? content.totalLabel.paid : content.totalLabel.other}</span>
                    <strong>{amount}</strong>
                  </div>
                </div>
              )}

              <div className="ps-actions">
                <Link href={copy.primary.href} className="btn btn-primary">
                  {copy.primary.label}
                </Link>
                {isPaid ? (
                  <button type="button" className="btn btn-secondary" onClick={printReceipt}>
                    {content.printLabel}
                  </button>
                ) : (
                  <Link href={copy.secondary.href} className="btn btn-secondary">
                    {copy.secondary.label}
                  </Link>
                )}
              </div>

              <p className="ps-foot">
                Payments are processed securely by CCAvenue in Indian Rupees.
                {isPaid && ` ${content.emailNote} ${result?.wants80g ? content.taxNote.yes : content.taxNote.no}`}
              </p>
            </div>
          </article>

          <div className="ps-side">
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
              {isPaid && (
                <Link className="ps-side-link" href={copy.secondary.href}>
                  {copy.secondary.label} &rarr;
                </Link>
              )}
            </section>

            <aside className="ps-help">
              <h4>{content.help.title}</h4>
              <p>{content.help.desc}</p>
              <a href={`mailto:${content.help.email}?subject=${helpSubject}`}>{content.help.email}</a>
              <a href={`tel:${content.help.phone.replace(/-/g, '')}`}>{content.help.phone}</a>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContributionPaymentStatusView;
