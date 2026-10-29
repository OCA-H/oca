import React from 'react';
import Link from 'next/link';
import { MEMBERSHIP_CONTENT } from '../../content/membership.content';
import type { MembershipPaymentState, ReceiptRow } from '../../handler/useMembershipPaymentStatusHandler';
import { formatPaymentDate } from '../../helper/membership.helper';
import { PaymentStatusIcon } from './PaymentStatusIcon';

interface PaymentReceiptCardProps {
  state: MembershipPaymentState;
  rows: ReceiptRow[];
  amount: string | null;
  loading: boolean;
  onPrint: () => void;
  onRefresh: () => void;
}

export const PaymentReceiptCard: React.FC<PaymentReceiptCardProps> = ({
  state,
  rows,
  amount,
  loading,
  onPrint,
  onRefresh,
}) => {
  const content = MEMBERSHIP_CONTENT.paymentStatus;
  const copy = content.states[state];
  const isPaid = state === 'paid';

  if (loading) {
    return (
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
    );
  }

  return (
    <article className={`ps-card ps-tone-${copy.tone}`} aria-labelledby="ps-receipt-title">
      {/* Letterhead: shown only when the receipt is printed or saved as PDF. */}
      <div className="ps-print-head" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- printed letterhead; next/image adds nothing here */}
        <img src="/images/oca-crest.png" alt="" width={56} height={56} />
        <div>
          <b>{content.print.org}</b>
          <span>{content.print.address}</span>
        </div>
        <div className="ps-print-meta">
          <b>{content.print.title}</b>
          <span>
            {content.print.printedOn} {formatPaymentDate(new Date().toISOString())}
          </span>
        </div>
      </div>

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
        {rows.length > 0 && (
          <dl className="ps-rows">
            {rows.map((row) => (
              <div key={row.label} className="ps-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {amount && (
          <div className="ms-bill ps-bill">
            <div className="ms-bill-row">
              <span>
                Life Membership <small>one-time</small>
              </span>
              <b>{amount}</b>
            </div>
            <div className="ms-bill-total">
              <span>{isPaid ? content.totalLabel.paid : content.totalLabel.other}</span>
              <strong>{amount}</strong>
            </div>
          </div>
        )}

        <div className="ps-actions">
          {state === 'pending' ? (
            <button type="button" className="btn btn-primary" onClick={onRefresh}>
              {copy.primary.label}
            </button>
          ) : (
            <Link href={copy.primary.href} className="btn btn-primary">
              {copy.primary.label}
            </Link>
          )}
          {isPaid ? (
            <button type="button" className="btn btn-secondary" onClick={onPrint}>
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

        <div className="ps-print-foot" aria-hidden="true">
          <p>{content.print.note}</p>
          <p>{content.print.contact}</p>
        </div>
      </div>
    </article>
  );
};

export default PaymentReceiptCard;
