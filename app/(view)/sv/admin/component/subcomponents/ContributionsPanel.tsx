'use client';

import React, { useCallback, useState } from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { useConfirmPayment, useRecordList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminContribution } from '../../services';
import { AdminIcon } from './AdminIcon';
import { ConfirmPaymentDialog, PaymentNotice } from './ConfirmPaymentDialog';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.contributions;
const pay = adminContent.payments;

const STATUS_TONE: Record<string, string> = { paid: 'ok', pending: 'warn', failed: 'bad', cancelled: 'muted' };

const matches = (c: AdminContribution, query: string) =>
  [c.donorName, c.email, c.mobile, c.fundLabel, c.orderId, c.batch ?? ''].some((value) => value.toLowerCase().includes(query));

interface ContributionsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** Every contribution, newest first, filtered by payment status and a search. */
export const ContributionsPanel: React.FC<ContributionsPanelProps> = ({ isActive, onBack }) => {
  const { items: contributions, setItems, error, isLoading, reload } = useRecordList(adminService.listContributions, isActive);
  const replace = useCallback(
    (updated: AdminContribution) => setItems((list) => list?.map((c) => (c.orderId === updated.orderId ? updated : c)) ?? null),
    [setItems]
  );
  const confirmation = useConfirmPayment(adminService.confirmContribution, replace);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  const all = contributions ?? [];
  const paid = all.filter((c) => c.status === 'paid');
  const q = query.trim().toLowerCase();
  const shown = all.filter((c) => (!status || c.status === status) && (!q || matches(c, q)));

  return (
    <RecordPanelFrame
      panel="contributions"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={contributions !== null}
      error={error}
      onReload={reload}
    >
      <div className="mp-fade">
        <dl className="ad-stats">
          <div className="ad-stat">
            <dt>{text.stats.paid}</dt>
            <dd>{paid.length}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.revenue}</dt>
            <dd>{adminHelper.formatRupees(paid.reduce((total, c) => total + c.amount, 0))}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.pending}</dt>
            <dd>{all.filter((c) => c.status === 'pending').length}</dd>
          </div>
        </dl>

        <PaymentNotice notice={confirmation.notice} />
        <input className="ad-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text.search} aria-label={text.search} />
        <div className="ad-toolbar">
          <div className="ad-pills" role="group" aria-label="Payment status">
            {pay.filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`ad-pill${status === filter.value ? ' is-active' : ''}`}
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
                <span className="ad-pill-n">{filter.value ? all.filter((c) => c.status === filter.value).length : all.length}</span>
              </button>
            ))}
          </div>
          <p className="ad-tally" aria-live="polite">
            {text.shown(shown.length, all.length)}
          </p>
        </div>

        {shown.length === 0 ? (
          <p className="ad-empty">{all.length === 0 ? adminContent.records.empty : text.none}</p>
        ) : (
          <ul className="ad-bookings">
            {shown.map((c) => (
              <li key={c.id} className="ad-booking">
                <div className="ad-booking-who">
                  <b>{c.donorName}</b>
                  {c.batch && <span>Batch {c.batch}</span>}
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                  {c.mobile && <a href={`tel:${c.mobile}`}>{c.mobile}</a>}
                </div>
                <div className="ad-booking-pass">
                  <b>{c.fundLabel}</b>
                  <span>{[c.units && text.units(c.units, c.unitLabel), c.wants80g && text.wants80g].filter(Boolean).join(' · ')}</span>
                </div>
                <div className="ad-booking-pay">
                  <b>{adminHelper.formatRupees(c.amount)}</b>
                  <span className={`ad-badge ad-badge--${STATUS_TONE[c.status] ?? 'muted'}`}>{c.status}</span>
                  {c.status !== 'paid' && (
                    <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => confirmation.open(c)}>
                      <AdminIcon name="check" />
                      {pay.confirm}
                    </button>
                  )}
                </div>
                <p className="ad-booking-foot">
                  <span className="ad-mono">{c.orderId}</span>
                  <span>
                    {text.given} {adminHelper.formatSaved(c.createdAt)}
                  </span>
                  {c.paidAt && (
                    <span>
                      {text.paidOn} {adminHelper.formatSaved(c.paidAt)}
                      {c.paymentMode && ` · ${c.paymentMode}`}
                    </span>
                  )}
                  {adminHelper.gatewayValue(c.trackingId) && <span>{pay.reference(c.trackingId!)}</span>}
                  {c.status === 'paid' && <span className={c.emailSent ? undefined : 'ad-cell-bad'}>{c.emailSent ? pay.emailSent : pay.emailPending}</span>}
                  {c.status !== 'paid' && adminHelper.gatewayValue(c.gatewayMessage) && <span>{c.gatewayMessage}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmPaymentDialog confirmation={confirmation} name={confirmation.target?.donorName ?? ''} />
    </RecordPanelFrame>
  );
};

export default ContributionsPanel;
