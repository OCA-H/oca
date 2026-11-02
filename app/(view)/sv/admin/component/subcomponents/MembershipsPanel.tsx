'use client';

import React, { useCallback, useState } from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { useConfirmPayment, useRecordList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminMembership } from '../../services';
import { AdminIcon } from './AdminIcon';
import { ConfirmPaymentDialog, PaymentNotice } from './ConfirmPaymentDialog';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.memberships;
const pay = adminContent.payments;

const STATUS_TONE: Record<string, string> = { paid: 'ok', pending: 'warn', failed: 'bad', cancelled: 'muted' };

const matches = (m: AdminMembership, query: string) =>
  [m.fullName, m.batchYear, m.email, m.mobile, m.orderId].some((value) => value.toLowerCase().includes(query));

interface MembershipsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** Every membership application, newest first, filtered by payment status and a search. */
export const MembershipsPanel: React.FC<MembershipsPanelProps> = ({ isActive, onBack }) => {
  const { items: memberships, setItems, error, isLoading, reload } = useRecordList(adminService.listMemberships, isActive);
  const replace = useCallback(
    (updated: AdminMembership) => setItems((list) => list?.map((m) => (m.orderId === updated.orderId ? updated : m)) ?? null),
    [setItems]
  );
  const confirmation = useConfirmPayment(adminService.confirmMembership, replace);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  const all = memberships ?? [];
  const paid = all.filter((m) => m.status === 'paid');
  const q = query.trim().toLowerCase();
  const shown = all.filter((m) => (!status || m.status === status) && (!q || matches(m, q)));

  return (
    <RecordPanelFrame
      panel="memberships"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={memberships !== null}
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
            <dd>{adminHelper.formatRupees(paid.reduce((total, m) => total + m.amount, 0))}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.pending}</dt>
            <dd>{all.filter((m) => m.status === 'pending').length}</dd>
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
                <span className="ad-pill-n">{filter.value ? all.filter((m) => m.status === filter.value).length : all.length}</span>
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
            {shown.map((m) => (
              <li key={m.id} className={`ad-booking${m.status === 'paid' && !m.hasAccount ? ' is-flagged' : ''}`}>
                <div className="ad-booking-who">
                  <b>{m.fullName}</b>
                  <span>{text.batch(m.batchYear)}</span>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                  {m.mobile && <a href={`tel:${m.mobile.replace(/\s+/g, '')}`}>{m.mobile}</a>}
                </div>
                <div className="ad-booking-pass">
                  <b>{m.membershipType}</b>
                  <span>{[m.city, m.country].filter(Boolean).join(', ')}</span>
                </div>
                <div className="ad-booking-pay">
                  <b>{adminHelper.formatRupees(m.amount)}</b>
                  <span className={`ad-badge ad-badge--${STATUS_TONE[m.status] ?? 'muted'}`}>{m.status}</span>
                  {m.status !== 'paid' && (
                    <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => confirmation.open(m)}>
                      <AdminIcon name="check" />
                      {pay.confirm}
                    </button>
                  )}
                </div>
                <p className="ad-booking-foot">
                  <span className="ad-mono">{m.orderId}</span>
                  <span>
                    {text.applied} {adminHelper.formatSaved(m.createdAt)}
                  </span>
                  {m.paidAt && (
                    <span>
                      {text.paidOn} {adminHelper.formatSaved(m.paidAt)}
                      {m.paymentMode && ` · ${m.paymentMode}`}
                    </span>
                  )}
                  {adminHelper.gatewayValue(m.trackingId) && <span>{pay.reference(m.trackingId!)}</span>}
                  {m.status === 'paid' && <span className={m.emailSent ? undefined : 'ad-cell-bad'}>{m.emailSent ? pay.emailSent : pay.emailPending}</span>}
                  {m.status !== 'paid' && adminHelper.gatewayValue(m.gatewayMessage) && <span>{m.gatewayMessage}</span>}
                  {m.status === 'paid' && !m.hasAccount && <span className="ad-cell-bad">{text.noAccount}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmPaymentDialog confirmation={confirmation} name={confirmation.target?.fullName ?? ''} />
    </RecordPanelFrame>
  );
};

export default MembershipsPanel;
