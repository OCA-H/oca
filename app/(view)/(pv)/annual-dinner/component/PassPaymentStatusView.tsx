'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { PaymentStatusIcon } from '@/app/(view)/(pv)/membership/component/subcomponents/PaymentStatusIcon';
import { PASS_PAYMENT_STATUS_CONTENT } from '../content/passPaymentStatus.content';
import { formatRupees } from '../helper/annualDinner.helper';
import { usePassPaymentStatusHandler } from '../handler/usePassPaymentStatusHandler';

export const PassPaymentStatusView: React.FC = () => {
  const { orderId, order, loading, state, isPaid, receiptRows, refresh, printReceipt } =
    usePassPaymentStatusHandler();
  const content = PASS_PAYMENT_STATUS_CONTENT;
  const copy = content.states[state];
  const helpSubject = encodeURIComponent(`Annual Dinner pass${order?.orderId ?? orderId ? ` – ${order?.orderId ?? orderId}` : ''}`);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <Link href={ROUTES.ANNUAL_DINNER}>Annual Dinner</Link>
          <span className="sep">/</span>
          <span>Payment status</span>
        </div>
      </nav>

      {/* Hero: outcome at a glance */}
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
                <h1>{copy.title.replace('{name}', order?.firstName ?? 'Columban')}</h1>
                <p className="lead">{copy.lead}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Receipt + next steps */}
      <section className="content-section cf-section ps-section">
        <div className="wrap ps-layout">
          {loading ? (
            <article className="ps-card" aria-busy="true">
              <div className="ps-card-head">
                <span className="ps-skel ps-skel-title" />
              </div>
              <div className="ps-card-body">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="ps-skel ps-skel-row" />
                ))}
              </div>
            </article>
          ) : (
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

                {order && (
                  <div className="ms-bill ps-bill">
                    {order.lineItems.map((item) => (
                      <div key={item.label} className="ms-bill-row">
                        <span>{item.label}</span>
                        <b>{formatRupees(item.amount)}</b>
                      </div>
                    ))}
                    <div className="ms-bill-total">
                      <span>{isPaid ? content.totalLabel.paid : content.totalLabel.other}</span>
                      <strong>{formatRupees(order.amount)}</strong>
                    </div>
                  </div>
                )}

                <div className="ps-actions">
                  {state === 'pending' ? (
                    <button type="button" className="btn btn-primary" onClick={refresh}>
                      {copy.primary.label}
                    </button>
                  ) : (
                    <Link href={copy.primary.href} className="btn btn-primary">
                      {copy.primary.label}
                    </Link>
                  )}
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
                  {isPaid && ' This page is your payment receipt; please keep the order reference for your records.'}
                </p>
              </div>
            </article>
          )}

          {!loading && (
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
              </section>

              <aside className="ps-help">
                <h4>{content.help.title}</h4>
                <p>{content.help.desc}</p>
                <a href={`mailto:${content.help.email}?subject=${helpSubject}`}>{content.help.email}</a>
                <a href={`tel:${content.help.phone.replace(/-/g, '')}`}>{content.help.phone}</a>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PassPaymentStatusView;
