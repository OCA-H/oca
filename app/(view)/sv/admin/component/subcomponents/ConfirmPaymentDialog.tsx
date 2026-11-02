'use client';

import React from 'react';
import { adminContent } from '../../content';
import { adminHelper } from '../../helper';
import { AdminConfirmDialog } from './AdminConfirmDialog';
import { AdminIcon } from './AdminIcon';

const text = adminContent.payments;

interface ConfirmPaymentDialogProps {
  confirmation: {
    target: { orderId: string; amount: number } | null;
    reference: string;
    changeReference: (value: string) => void;
    isBusy: boolean;
    error: string | null;
    referenceError: string | null;
    cancel: () => void;
    submit: () => void;
  };
  /** Who will be marked paid, as the dialog names them. */
  name: string;
}

/** Asks for the CCAvenue reference of a payment found in the dashboard, then confirms it. */
export const ConfirmPaymentDialog: React.FC<ConfirmPaymentDialogProps> = ({ confirmation, name }) => {
  const { target, reference, changeReference, isBusy, error, referenceError, cancel, submit } = confirmation;
  if (!target) return null;

  return (
    <AdminConfirmDialog
      title={text.dialog.title}
      body={text.dialog.body(name, adminHelper.formatRupees(target.amount), target.orderId)}
      confirmLabel={text.dialog.confirm}
      busyLabel={text.dialog.busy}
      isBusy={isBusy}
      error={error}
      onCancel={cancel}
      onConfirm={submit}
    >
      <div className="field ad-field ad-confirm-ref">
        <label htmlFor="ad-confirm-reference" className="ad-label">
          <span>{text.dialog.referenceLabel} *</span>
        </label>
        <input
          id="ad-confirm-reference"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          spellCheck={false}
          maxLength={50}
          value={reference}
          onChange={(e) => changeReference(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isBusy) submit();
          }}
          aria-invalid={Boolean(referenceError) || undefined}
          aria-describedby="ad-confirm-reference-hint"
        />
        <p className={`mp-hint${referenceError ? ' mp-hint--bad' : ''}`} id="ad-confirm-reference-hint">
          {referenceError ?? text.dialog.referenceHint}
        </p>
      </div>
    </AdminConfirmDialog>
  );
};

/** The note a list shows after a confirmation: the server's word on the payment and its email. */
export const PaymentNotice: React.FC<{ notice: string | null }> = ({ notice }) =>
  notice ? (
    <div className="mp-ok" role="status">
      <AdminIcon name="check" />
      <p>{notice}</p>
    </div>
  ) : null;

export default ConfirmPaymentDialog;
