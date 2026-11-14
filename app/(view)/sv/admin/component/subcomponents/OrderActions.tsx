'use client';

import React from 'react';
import { adminContent } from '../../content';
import type { OrderActions } from '../../handler/useOrderActions';
import { adminHelper } from '../../helper';
import { AdminConfirmDialog } from './AdminConfirmDialog';
import { AdminIcon } from './AdminIcon';

const text = adminContent.payments;

/** What every payable record in the bookings, memberships and contributions lists has. */
interface PayableRecord {
  orderId: string;
  amount: number;
  email: string;
  status: string;
}

interface OrderActionButtonsProps<T extends PayableRecord> {
  record: T;
  actions: OrderActions<T>;
  /** Opens the Confirm payment dialog. */
  onConfirm: (record: T) => void;
}

/**
 * The buttons under an order's amount: a paid order's email can be sent again; an unpaid one can be
 * confirmed (after finding it in CCAvenue) or rejected. A rejected order can still be confirmed.
 */
export function OrderActionButtons<T extends PayableRecord>({ record, actions, onConfirm }: OrderActionButtonsProps<T>) {
  if (record.status === 'paid') {
    return (
      <div className="ad-order-acts">
        <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => actions.open('resend', record)}>
          <AdminIcon name="mail" />
          {text.resend}
        </button>
      </div>
    );
  }
  return (
    <div className="ad-order-acts">
      <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => onConfirm(record)}>
        <AdminIcon name="check" />
        {text.confirm}
      </button>
      {record.status !== 'rejected' && (
        <button className="mp-photo-btn ad-pay-btn ad-pay-btn--danger" type="button" onClick={() => actions.open('reject', record)}>
          <AdminIcon name="ban" />
          {text.reject}
        </button>
      )}
    </div>
  );
}

interface OrderActionDialogProps<T extends PayableRecord> {
  actions: OrderActions<T>;
  /** Who the order is for, as the dialog names them. */
  nameOf: (record: T) => string;
  /** What the confirmation email carries: "their pass", "the welcome email", "the thank-you and receipt". */
  emailCarries: string;
}

/** The dialog for the order action in progress: resending its email, or rejecting it with a reason. */
export function OrderActionDialog<T extends PayableRecord>({ actions, nameOf, emailCarries }: OrderActionDialogProps<T>) {
  const { target, reason, changeReason, isBusy, error, reasonError, cancel, submit } = actions;
  if (!target) return null;
  const { action, record } = target;

  if (action === 'resend') {
    return (
      <AdminConfirmDialog
        title={text.resendDialog.title}
        body={text.resendDialog.body(nameOf(record), emailCarries, record.email)}
        confirmLabel={text.resendDialog.confirm}
        busyLabel={text.resendDialog.busy}
        isBusy={isBusy}
        error={error}
        onCancel={cancel}
        onConfirm={submit}
      />
    );
  }

  return (
    <AdminConfirmDialog
      title={text.rejectDialog.title}
      body={text.rejectDialog.body(nameOf(record), adminHelper.formatRupees(record.amount), record.orderId)}
      confirmLabel={text.rejectDialog.confirm}
      busyLabel={text.rejectDialog.busy}
      isBusy={isBusy}
      danger
      error={error}
      onCancel={cancel}
      onConfirm={submit}
    >
      <div className="field ad-field ad-confirm-ref">
        <label htmlFor="ad-reject-reason" className="ad-label">
          <span>{text.rejectDialog.reasonLabel}</span>
        </label>
        <textarea
          id="ad-reject-reason"
          rows={2}
          autoFocus
          maxLength={200}
          value={reason}
          onChange={(e) => changeReason(e.target.value)}
          aria-invalid={Boolean(reasonError) || undefined}
          aria-describedby="ad-reject-reason-hint"
        />
        <p className={`mp-hint${reasonError ? ' mp-hint--bad' : ''}`} id="ad-reject-reason-hint">
          {reasonError ?? text.rejectDialog.reasonHint}
        </p>
      </div>
    </AdminConfirmDialog>
  );
}
