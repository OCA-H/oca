'use client';

import React from 'react';
import { newslettersContent as text } from '../../content';
import { useNewslettersHandler } from '../../handler';

/** Asks the Secretariat to send notices to a new address. */
export const EmailUpdateForm: React.FC = () => {
  const { form, setField, fieldErrors, error, sentMessage, isSending, handleSubmit } = useNewslettersHandler();
  const { form: labels } = text;
  const hint = (key: 'name' | 'email' | 'batch') =>
    fieldErrors[key] && (
      <p className="mp-hint mp-hint--bad" id={`nl-${key}-err`}>
        {fieldErrors[key]}
      </p>
    );

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSending}>
      <div className="field">
        <label htmlFor="nl-name">{labels.name.label}</label>
        <input id="nl-name" type="text" autoComplete="name" required placeholder={labels.name.placeholder} value={form.name} onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(fieldErrors.name) || undefined} aria-describedby={fieldErrors.name ? 'nl-name-err' : undefined} />
        {hint('name')}
      </div>
      <div className="field">
        <label htmlFor="nl-email">{labels.email.label}</label>
        <input id="nl-email" type="email" autoComplete="email" required placeholder={labels.email.placeholder} value={form.email} onChange={(e) => setField('email', e.target.value)} aria-invalid={Boolean(fieldErrors.email) || undefined} aria-describedby={fieldErrors.email ? 'nl-email-err' : undefined} />
        {hint('email')}
      </div>
      <div className="field">
        <label htmlFor="nl-batch">{labels.batch.label}</label>
        <input id="nl-batch" type="text" inputMode="numeric" placeholder={labels.batch.placeholder} value={form.batch} onChange={(e) => setField('batch', e.target.value)} aria-invalid={Boolean(fieldErrors.batch) || undefined} aria-describedby={fieldErrors.batch ? 'nl-batch-err' : undefined} />
        {hint('batch')}
      </div>
      {/* Only bots fill this in; the server then sends nothing. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} value={form.website} onChange={(e) => setField('website', e.target.value)} />
      <button className="btn btn-primary" type="submit" disabled={isSending}>
        {isSending ? labels.sending : labels.submit}
      </button>
      <p className="form-note">{labels.note}</p>
      {sentMessage && (
        <p className="nl-form-msg is-ok" role="status">
          {sentMessage}
        </p>
      )}
      {error && !sentMessage && (
        <p className="nl-form-msg is-bad" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default EmailUpdateForm;
