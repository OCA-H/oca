'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** One line of the dialog's list: a field and its value before and after. */
export interface ConfirmChange {
  label: string;
  from: string;
  to: string;
}

interface AdminConfirmDialogProps {
  title: string;
  body?: string;
  /** What will change, shown as "Label: before → after". */
  changes?: ConfirmChange[];
  confirmLabel: string;
  busyLabel: string;
  isBusy: boolean;
  /** Red confirm button, for deleting. */
  danger?: boolean;
  /** Shown inside the dialog when the action failed, so it can be tried again. */
  error?: string | null;
  /** Anything the admin must fill in first, shown above the error. */
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

/** The last check before anything is written to the database: says what will change, then asks. */
export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  title,
  body,
  changes,
  confirmLabel,
  busyLabel,
  isBusy,
  danger,
  error,
  children,
  onCancel,
  onConfirm,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  // A dialog with something to fill in puts focus there instead (autoFocus on its first field).
  const hasFields = Boolean(children);

  useEffect(() => {
    if (!hasFields) confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isBusy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasFields, isBusy, onCancel]);

  // Into <body>: the panels animate with a transform, which would hold a fixed overlay inside them.
  return createPortal(
    <div className="mp-backdrop ad-backdrop" onClick={() => !isBusy && onCancel()}>
      <div className="confirm-dialog ad-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ad-confirm-title">
        <h3 id="ad-confirm-title">{title}</h3>
        {body && <p>{body}</p>}
        {changes && changes.length > 0 && (
          <ul className="ad-changes">
            {changes.map((change) => (
              <li key={change.label}>
                <span className="ad-change-label">{change.label}</span>
                <span className="ad-change-values">
                  <s>{change.from || 'Empty'}</s>
                  <span aria-hidden="true">→</span>
                  <b>{change.to || 'Empty'}</b>
                </span>
              </li>
            ))}
          </ul>
        )}
        {children}
        {error && (
          <p className="ms-error ad-dialog-error" role="alert">
            {error}
          </p>
        )}
        <div className="cd-actions">
          <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={isBusy}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            className={`btn btn-primary${danger ? ' ad-danger' : ''}`}
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            aria-busy={isBusy}
          >
            {isBusy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminConfirmDialog;
