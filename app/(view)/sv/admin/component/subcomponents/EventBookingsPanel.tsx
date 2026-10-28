'use client';

import React, { useState } from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { useRecordList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminBooking } from '../../services';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.bookings;

const STATUS_TONE: Record<string, string> = { paid: 'ok', pending: 'warn', failed: 'bad', cancelled: 'muted' };

const matches = (booking: AdminBooking, query: string) =>
  [booking.fullName, booking.memberId, booking.email, booking.orderId, booking.mobile ?? '']
    .some((value) => value.toLowerCase().includes(query));

interface EventBookingsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** Every pass booking, newest first, filtered by payment status and a search. */
export const EventBookingsPanel: React.FC<EventBookingsPanelProps> = ({ isActive, onBack }) => {
  const { items: bookings, error, isLoading, reload } = useRecordList(adminService.listBookings, isActive);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');

  const all = bookings ?? [];
  const paid = all.filter((b) => b.status === 'paid');
  const q = query.trim().toLowerCase();
  const shown = all.filter((b) => (!status || b.status === status) && (!q || matches(b, q)));

  return (
    <RecordPanelFrame
      panel="bookings"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={bookings !== null}
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
            <dd>{adminHelper.formatRupees(paid.reduce((total, b) => total + b.amount, 0))}</dd>
          </div>
          <div className="ad-stat">
            <dt>{text.stats.oversold}</dt>
            <dd>{paid.filter((b) => b.oversold).length}</dd>
          </div>
        </dl>

        <input className="ad-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={text.search} aria-label={text.search} />
        <div className="ad-toolbar">
          <div className="ad-pills" role="group" aria-label="Payment status">
            {text.filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`ad-pill${status === filter.value ? ' is-active' : ''}`}
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
                <span className="ad-pill-n">{filter.value ? all.filter((b) => b.status === filter.value).length : all.length}</span>
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
                  {b.status !== 'paid' && b.gatewayMessage && <span>{b.gatewayMessage}</span>}
                  {b.oversold && <span className="ad-cell-bad">{text.oversold}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RecordPanelFrame>
  );
};

export default EventBookingsPanel;
