'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { adminContent } from '@/app/(view)/sv/admin/content';
import { useConfirmPayment, useOrderActions, usePagedList } from '@/app/(view)/sv/admin/handler';
import { adminHelper } from '@/app/(view)/sv/admin/helper';
import {
  adminService,
  type AdminBooking,
  type AdminContribution,
  type AdminMembership,
  type Confirmed,
  type ListQuery,
  type PagedList,
  type PaymentSummary,
} from '@/app/(view)/sv/admin/services';
import { DataTable, Ff, money, PageHead, Pager, plural, TableSkeleton, type Column } from './OaUi';
import { OaIcon } from './OaIcon';
import type { OaContext } from './oaContext';

// The Super Admin panel's order lists (contributions, dinner and golf bookings, memberships) in the
// console's own look. They use the same APIs and hooks, so a payment confirmed, an email resent or
// an order rejected here is exactly what the Super Admin panel does.

const pay = adminContent.payments;

const STATUS_LABEL: Record<string, string> = { paid: 'label-success', pending: 'label-gold', failed: 'label-bad', rejected: 'label-bad', cancelled: 'label-muted' };

/** What every order in these lists has. */
interface Order {
  id: number;
  orderId: string;
  email: string;
  mobile: string | null;
  amount: number;
  status: string;
  paymentMode: string | null;
  trackingId: string | null;
  gatewayMessage: string | null;
  paidAt: string | null;
  emailSent: boolean;
  createdAt: string;
}

interface OrdersPageProps<T extends Order> {
  ctx: OaContext;
  title: string;
  /** "booking" / "bookings", for the counts. */
  one: string;
  many: string;
  load: (query: ListQuery) => Promise<PagedList<T, PaymentSummary>>;
  confirm: (orderId: string, reference: string) => Promise<Confirmed<T>>;
  resend: (orderId: string) => Promise<Confirmed<T>>;
  reject: (orderId: string, reason: string) => Promise<Confirmed<T>>;
  nameOf: (order: T) => string;
  /** What the confirmation email carries: "their pass", "the welcome email", "the thank-you and receipt". */
  emailCarries: string;
  /** The column(s) about what was bought, between the person and the amount. */
  detailCols: Column<T>[];
  /** A warning under an order's payment details (oversold, no account yet). */
  flag?: (order: T) => string | null;
}

function OrdersPage<T extends Order>(p: OrdersPageProps<T>) {
  const { ctx } = p;
  const { list, error, isLoading, setPage, status, setStatus, search, setSearch, reload } = usePagedList(p.load, true);
  // Both move an order between the status counts, so the page is fetched again afterwards.
  const confirmation = useConfirmPayment(p.confirm, reload);
  const actions = useOrderActions(p.resend, p.reject, reload);

  // What the server said about the change goes in the console's message line.
  const { msg } = ctx;
  useEffect(() => {
    if (confirmation.notice) msg(confirmation.notice);
  }, [confirmation.notice, msg]);
  useEffect(() => {
    if (actions.notice) msg(actions.notice);
  }, [actions.notice, msg]);

  const rows = list?.data ?? [];
  const summary = list?.summary;
  const pages = list ? Math.max(1, Math.ceil(list.total / list.pageSize)) : 1;
  const from = list && list.total ? (list.page - 1) * list.pageSize + 1 : 0;
  const to = list ? Math.min(list.total, list.page * list.pageSize) : 0;

  const cols: Column<T>[] = [
    {
      label: 'Name',
      primary: true,
      wrap: true,
      cell: (o) => (
        <span className="ord-who">
          <b>{p.nameOf(o)}</b>
          <a href={`mailto:${o.email}`}>{o.email}</a>
          {o.mobile && <a href={`tel:${o.mobile.replace(/\s+/g, '')}`}>{o.mobile}</a>}
        </span>
      ),
    },
    ...p.detailCols,
    { label: 'Amount', cell: (o) => <b>{money(o.amount)}</b> },
    {
      label: 'Status',
      cell: (o) => <span className={STATUS_LABEL[o.status] ?? 'label-muted'}>{o.status}</span>,
    },
    {
      label: 'Order',
      wrap: true,
      cell: (o) => {
        const flag = p.flag?.(o);
        return (
          <span className="ord-meta">
            <span className="ord-mono">{o.orderId}</span>
            <span>Placed {adminHelper.formatSaved(o.createdAt)}</span>
            {o.paidAt && <span>Paid {adminHelper.formatSaved(o.paidAt)}{o.paymentMode && ` · ${o.paymentMode}`}</span>}
            {adminHelper.gatewayValue(o.trackingId) && <span>{pay.reference(o.trackingId!)}</span>}
            {o.status === 'paid' && <span className={o.emailSent ? undefined : 'text-danger'}>{o.emailSent ? pay.emailSent : pay.emailPending}</span>}
            {o.status !== 'paid' && adminHelper.gatewayValue(o.gatewayMessage) && <span>{o.gatewayMessage}</span>}
            {flag && <span className="text-danger">{flag}</span>}
          </span>
        );
      },
    },
    {
      label: 'Actions',
      cell: (o) =>
        o.status === 'paid' ? (
          <span className="ord-acts">
            <button type="button" className="btn btn-default btn-sm" onClick={() => actions.open('resend', o)}>
              {pay.resend}
            </button>
          </span>
        ) : (
          <span className="ord-acts">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => confirmation.open(o)}>
              {pay.confirm}
            </button>
            {o.status !== 'rejected' && (
              <button type="button" className="btn btn-default btn-sm text-danger" onClick={() => actions.open('reject', o)}>
                {pay.reject}
              </button>
            )}
          </span>
        ),
    },
  ];

  return (
    <>
      <PageHead title={p.title}>
        <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
          <Ff label="Search" grow>
            <span className="ord-search">
              <span className="sbox">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name, email, mobile or order ID"
                  data-k="q"
                  value={search}
                  autoComplete="off"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className="sclear" aria-label="Clear the search" onClick={() => setSearch('')}>
                  ×
                </button>
              </span>
              <StatusFilter value={status} onChange={setStatus} summary={summary} />
            </span>
          </Ff>
        </form>
      </PageHead>

      {summary && (
        <div className="ord-stats">
          <span>
            <b>{summary.counts.paid}</b> paid
          </span>
          <span>
            <b>{money(summary.paidAmount)}</b> received
          </span>
          <span>
            <b>{summary.counts.pending}</b> pending
          </span>
          <span>
            <b>{summary.counts.failed + summary.counts.cancelled + summary.counts.rejected}</b> failed, cancelled or rejected
          </span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <div>
            {error}{' '}
            <button type="button" className="linkbtn" onClick={reload}>
              Try again
            </button>
          </div>
        </div>
      )}

      {!list && !error ? (
        <TableSkeleton cols={6} />
      ) : list && list.total === 0 ? (
        <div className="empty">{search.trim() || status ? `No ${p.many} match these filters.` : `There are no ${p.many} yet.`}</div>
      ) : list ? (
        <>
          <div className="lbar">
            <p className="count" role="status">
              {isLoading ? 'Loading…' : `Showing ${from}–${to} of ${plural(list.total, p.one, p.many)}${status ? ` · ${statusLabel(status)}` : ''}`}
            </p>
          </div>
          <div style={{ opacity: isLoading ? 0.55 : 1, transition: 'opacity .15s' }}>
            <DataTable cols={cols} rows={rows} rowKey={(o) => o.id} />
          </div>
          <div className="lbar" style={{ marginTop: 14 }}>
            <span />
            <Pager page={list.page} pages={pages} onPage={setPage} />
          </div>
        </>
      ) : null}

      {confirmation.target && (
        <OrderDialog
          title={pay.dialog.title}
          body={pay.dialog.body(p.nameOf(confirmation.target), money(confirmation.target.amount), confirmation.target.orderId)}
          okLabel={pay.dialog.confirm}
          busyLabel={pay.dialog.busy}
          isBusy={confirmation.isBusy}
          error={confirmation.error}
          onCancel={confirmation.cancel}
          onOk={confirmation.submit}
        >
          {(id) => (
            <Field id={id} label={`${pay.dialog.referenceLabel} *`} hint={pay.dialog.referenceHint} error={confirmation.referenceError}>
              <input
                id={id}
                type="text"
                className="form-control"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                maxLength={50}
                autoFocus
                value={confirmation.reference}
                onChange={(e) => confirmation.changeReference(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !confirmation.isBusy) confirmation.submit();
                }}
                aria-invalid={Boolean(confirmation.referenceError) || undefined}
                aria-describedby={`${id}-hint`}
              />
            </Field>
          )}
        </OrderDialog>
      )}

      {actions.target?.action === 'resend' && (
        <OrderDialog
          title={pay.resendDialog.title}
          body={pay.resendDialog.body(p.nameOf(actions.target.record), p.emailCarries, actions.target.record.email)}
          okLabel={pay.resendDialog.confirm}
          busyLabel={pay.resendDialog.busy}
          isBusy={actions.isBusy}
          error={actions.error}
          onCancel={actions.cancel}
          onOk={actions.submit}
        />
      )}

      {actions.target?.action === 'reject' && (
        <OrderDialog
          title={pay.rejectDialog.title}
          body={pay.rejectDialog.body(p.nameOf(actions.target.record), money(actions.target.record.amount), actions.target.record.orderId)}
          okLabel={pay.rejectDialog.confirm}
          busyLabel={pay.rejectDialog.busy}
          isBusy={actions.isBusy}
          error={actions.error}
          danger
          onCancel={actions.cancel}
          onOk={actions.submit}
        >
          {(id) => (
            <Field id={id} label={pay.rejectDialog.reasonLabel} hint={pay.rejectDialog.reasonHint} error={actions.reasonError}>
              <textarea
                id={id}
                className="form-control"
                rows={2}
                maxLength={200}
                autoFocus
                value={actions.reason}
                onChange={(e) => actions.changeReason(e.target.value)}
                aria-invalid={Boolean(actions.reasonError) || undefined}
                aria-describedby={`${id}-hint`}
              />
            </Field>
          )}
        </OrderDialog>
      )}
    </>
  );
}

/* -------------------------------- filter -------------------------------- */

const statusLabel = (value: string) => pay.filters.find((f) => f.value === value)?.label ?? value;

/**
 * The filter icon beside the search: a small menu of payment statuses, each with its count. A dot on
 * the icon shows a status is chosen. Closes on a choice, a click outside, or Esc.
 */
const StatusFilter: React.FC<{ value: string; onChange: (value: string) => void; summary: PaymentSummary | undefined }> = ({ value, onChange, summary }) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
    button.current?.focus();
  };

  return (
    <span
      className="ord-filter"
      ref={root}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        className={`ord-filter-btn${value ? ' is-on' : ''}`}
        aria-label={value ? `Filter by payment status: ${statusLabel(value)}` : 'Filter by payment status'}
        title="Filter by payment status"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <OaIcon name="filter" />
        {value && <span className="ord-filter-dot" aria-hidden="true" />}
      </button>
      {open && (
        <div className="oa-select-pop ord-filter-pop" id={menuId}>
          <p className="ord-filter-h">Payment status</p>
          <ul className="oa-select-list">
            {pay.filters.map((f) => {
              const on = f.value === value;
              const n = summary ? (f.value ? summary.counts[f.value as keyof typeof summary.counts] ?? 0 : summary.all) : null;
              return (
                <li key={f.value || 'all'}>
                  <button type="button" className={`oa-select-opt ord-filter-opt${on ? ' is-on' : ''}`} aria-pressed={on} autoFocus={on} onClick={() => pick(f.value)}>
                    <span className="oa-select-lbl">{f.label}</span>
                    {n !== null && <span className="ord-filter-n">{n}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </span>
  );
};

/* -------------------------------- dialog -------------------------------- */

const Field: React.FC<{ id: string; label: string; hint: string; error: string | null; children: React.ReactNode }> = ({ id, label, hint, error, children }) => (
  <div className="ord-field">
    <label htmlFor={id}>{label}</label>
    {children}
    <p id={`${id}-hint`} className={`small ${error ? 'text-danger' : 'text-muted'}`}>
      {error ?? hint}
    </p>
  </div>
);

/**
 * The console's modal, but staying open until the server answers, so a wrong reference or a mail
 * error shows inside it (the shell's Dialog closes on OK).
 */
const OrderDialog: React.FC<{
  title: string;
  body: string;
  okLabel: string;
  busyLabel: string;
  isBusy: boolean;
  error: string | null;
  danger?: boolean;
  onCancel: () => void;
  onOk: () => void;
  children?: (fieldId: string) => React.ReactNode;
}> = ({ title, body, okLabel, busyLabel, isBusy, error, danger, onCancel, onOk, children }) => {
  const id = useId();
  const [titleId, fieldId] = [`${id}-t`, `${id}-f`];
  return (
    <>
      <div className="scrim" onClick={() => !isBusy && onCancel()} />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !isBusy) onCancel();
        }}
      >
        <div className="modal-content">
          <h2 className="modal-title" id={titleId}>
            {title}
          </h2>
          <div className="modal-body">
            <p>{body}</p>
            {children?.(fieldId)}
            {error && (
              <div className="alert alert-danger" role="alert" style={{ marginTop: 14, marginBottom: 0 }}>
                <div>{error}</div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onCancel} disabled={isBusy} autoFocus={!children}>
              Cancel
            </button>
            <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onOk} disabled={isBusy}>
              {isBusy ? busyLabel : okLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* --------------------------------- pages --------------------------------- */

// Module-level, so each list's loader keeps one identity and the hook does not refetch on render.
const loadDinner = (query: ListQuery) => adminService.listBookings('annual-dinner', query);
const loadGolf = (query: ListQuery) => adminService.listBookings('golf-tournament', query);

const bookingCols: Column<AdminBooking>[] = [
  {
    label: 'Pass',
    wrap: true,
    cell: (b) => (
      <span className="ord-meta">
        <b>{b.passLabel}</b>
        {b.memberId && <span>{b.memberId}</span>}
        <span>{adminContent.bookings.guests(b)}</span>
      </span>
    ),
  },
];

const BookingsPage: React.FC<{ ctx: OaContext; title: string; load: typeof loadDinner }> = ({ ctx, title, load }) => (
  <OrdersPage<AdminBooking>
    ctx={ctx}
    title={title}
    one="booking"
    many="bookings"
    load={load}
    confirm={adminService.confirmBooking}
    resend={adminService.resendBookingEmail}
    reject={adminService.rejectBooking}
    nameOf={(b) => b.fullName}
    emailCarries="their pass"
    detailCols={bookingCols}
    flag={(b) => (b.oversold ? adminContent.bookings.oversold : null)}
  />
);

export const DinnerBookingsPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => <BookingsPage ctx={ctx} title="Dinner Bookings" load={loadDinner} />;

export const GolfBookingsPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => <BookingsPage ctx={ctx} title="Golf Bookings" load={loadGolf} />;

export const MembershipsPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => (
  <OrdersPage<AdminMembership>
    ctx={ctx}
    title="Membership Payments"
    one="application"
    many="applications"
    load={adminService.listMemberships}
    confirm={adminService.confirmMembership}
    resend={adminService.resendMembershipEmail}
    reject={adminService.rejectMembership}
    nameOf={(m) => m.fullName}
    emailCarries="the welcome email"
    detailCols={[
      {
        label: 'Membership',
        wrap: true,
        cell: (m) => (
          <span className="ord-meta">
            <b>{m.membershipType}</b>
            <span>{adminContent.memberships.batch(m.batchYear)}</span>
            {(m.city || m.country) && <span>{[m.city, m.country].filter(Boolean).join(', ')}</span>}
          </span>
        ),
      },
    ]}
    flag={(m) => (m.status === 'paid' && !m.hasAccount ? adminContent.memberships.noAccount : null)}
  />
);

export const ContributionsPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => (
  <OrdersPage<AdminContribution>
    ctx={ctx}
    title="Contributions"
    one="contribution"
    many="contributions"
    load={adminService.listContributions}
    confirm={adminService.confirmContribution}
    resend={adminService.resendContributionEmail}
    reject={adminService.rejectContribution}
    nameOf={(c) => c.donorName}
    emailCarries="the thank-you and receipt"
    detailCols={[
      {
        label: 'Contribution',
        wrap: true,
        cell: (c) => (
          <span className="ord-meta">
            <b>{c.fundLabel}</b>
            {c.batch && <span>Batch {c.batch}</span>}
            {(c.units || c.wants80g) && (
              <span>{[c.units && adminContent.contributions.units(c.units, c.unitLabel), c.wants80g && adminContent.contributions.wants80g].filter(Boolean).join(' · ')}</span>
            )}
          </span>
        ),
      },
    ]}
  />
);
