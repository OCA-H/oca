'use client';

import React, { useCallback } from 'react';
import { adminContent, type AdminPanel, type PassEvent } from '../../content';
import { useConfirmPayment, usePagedList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type ListQuery } from '../../services';
import { ConfirmPaymentDialog, PaymentNotice } from './ConfirmPaymentDialog';
import { AdminIcon } from './AdminIcon';
import { AdminPager } from './AdminPager';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.bookings;
const pay = adminContent.payments;

const STATUS_TONE: Record<string, string> = { paid: 'ok', pending: 'warn', failed: 'bad', cancelled: 'muted' };

interface EventBookingsPanelProps {
  passEvent: PassEvent;
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** One event's pass bookings, a page at a time, newest first, filtered by payment status and a search. */
export const EventBookingsPanel: React.FC<EventBookingsPanelProps> = ({ passEvent, isActive, onBack }) => {
  const load = useCallback((query: ListQuery) => adminService.listBookings(passEvent.event, query), [passEvent.event]);
  const { list, error, isLoading, setPage, status, setStatus, search, setSearch, reload } = usePagedList(load, isActive);
  // A confirmed booking moves between the status counts (and may leave a Pending list), so fetch the page again.
  const confirmation = useConfirmPayment(adminService.confirmBooking, reload);

  const shown = list?.data ?? [];
  const summary = list?.summary;
  const from = list ? (list.page - 1) * list.pageSize + 1 : 0;

  return (
    <RecordPanelFrame
      panel={passEvent.bookings}
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
            <dt>{text.stats.oversold}</dt>
            <dd>{summary?.oversold ?? 0}</dd>
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
            {shown.map((b) => (
              <li key={b.id} className={`ad-booking${b.oversold ? ' is-flagged' : ''}`}>
                <div className="ad-booking-who">
                  <b>{b.fullName}</b>
                  <span>{b.memberId}</span>
                  <a href={`mailto:${b.email}`}>{b.email}</a>
                  {b.mobile && <a href={`tel:${b.mobile}`}>{b.mobile}</a>}
                </div>
                <div className="ad-booking-pass">
                  <b>{b.passLabel}</b>
                  <span>{text.guests(b)}</span>
                </div>
                <div className="ad-booking-pay">
                  <b>{adminHelper.formatRupees(b.amount)}</b>
                  <span className={`ad-badge ad-badge--${STATUS_TONE[b.status] ?? 'muted'}`}>{b.status}</span>
                  {b.status !== 'paid' && (
                    <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => confirmation.open(b)}>
                      <AdminIcon name="check" />
                      {pay.confirm}
                    </button>
                  )}
                </div>
                <p className="ad-booking-foot">
                  <span className="ad-mono">{b.orderId}</span>
                  <span>
                    {text.booked} {adminHelper.formatSaved(b.createdAt)}
                  </span>
                  {b.paidAt && (
                    <span>
                      {text.paidOn} {adminHelper.formatSaved(b.paidAt)}
                      {b.paymentMode && ` · ${b.paymentMode}`}
                    </span>
                  )}
                  {adminHelper.gatewayValue(b.trackingId) && <span>{pay.reference(b.trackingId!)}</span>}
                  {b.status === 'paid' && <span className={b.emailSent ? undefined : 'ad-cell-bad'}>{b.emailSent ? pay.emailSent : pay.emailPending}</span>}
                  {b.status !== 'paid' && adminHelper.gatewayValue(b.gatewayMessage) && <span>{b.gatewayMessage}</span>}
                  {b.oversold && <span className="ad-cell-bad">{text.oversold}</span>}
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

export default EventBookingsPanel;
