'use client';

import React from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { useConfirmPayment, usePagedList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService } from '../../services';
import { AdminIcon } from './AdminIcon';
import { AdminPager } from './AdminPager';
import { ConfirmPaymentDialog, PaymentNotice } from './ConfirmPaymentDialog';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.memberships;
const pay = adminContent.payments;

const STATUS_TONE: Record<string, string> = { paid: 'ok', pending: 'warn', failed: 'bad', cancelled: 'muted' };

interface MembershipsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** Membership applications, a page at a time, newest first, filtered by payment status and a search. */
export const MembershipsPanel: React.FC<MembershipsPanelProps> = ({ isActive, onBack }) => {
  const { list, error, isLoading, setPage, status, setStatus, search, setSearch, reload } = usePagedList(adminService.listMemberships, isActive);
  // A confirmed payment moves between the status counts (and may leave a Pending list), so fetch the page again.
  const confirmation = useConfirmPayment(adminService.confirmMembership, reload);

  const shown = list?.data ?? [];
  const summary = list?.summary;
  const from = list ? (list.page - 1) * list.pageSize + 1 : 0;

  return (
    <RecordPanelFrame
      panel="memberships"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={list !== null}
      error={error}
      onReload={reload}
    >
      <div className="mp-fade">
        <dl className="ad-stats">
          <div className="ad-stat">
            <dt>{text.stats.paid}</dt>
            <dd>{summary?.counts.paid ?? 0}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.revenue}</dt>
            <dd>{adminHelper.formatRupees(summary?.paidAmount ?? 0)}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.pending}</dt>
            <dd>{summary?.counts.pending ?? 0}</dd>
          </div>
        </dl>

        <PaymentNotice notice={confirmation.notice} />
        <input className="ad-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={text.search} aria-label={text.search} />
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
                <span className="ad-pill-n">{filter.value ? (summary?.counts[filter.value as keyof typeof summary.counts] ?? 0) : (summary?.all ?? 0)}</span>
              </button>
            ))}
          </div>
          <p className="ad-tally" aria-live="polite">
            {list && list.total > 0 && text.shown(from, from + shown.length - 1, list.total)}
          </p>
        </div>

        {shown.length === 0 ? (
          <p className="ad-empty">{summary?.all === 0 ? adminContent.records.empty : text.none}</p>
        ) : (
          <ul className={`ad-bookings${isLoading ? ' is-loading' : ''}`} aria-busy={isLoading}>
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
        {list && <AdminPager page={list.page} pageSize={list.pageSize} total={list.total} isLoading={isLoading} onPage={setPage} />}
      </div>
      <ConfirmPaymentDialog confirmation={confirmation} name={confirmation.target?.fullName ?? ''} />
    </RecordPanelFrame>
  );
};

export default MembershipsPanel;
