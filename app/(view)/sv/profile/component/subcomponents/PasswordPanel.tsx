'use client';

import React from 'react';
import { profileContent } from '../../content';
import { usePasswordForm } from '../../handler';
import { FieldError, PanelHead, PanelSuccess } from './PanelHead';

const FIELDS = [
  { name: 'current', id: 'mpp-cur', label: 'Current password *', autoComplete: 'current-password' },
  { name: 'new', id: 'mpp-new', label: 'New password *', autoComplete: 'new-password' },
  { name: 'confirm', id: 'mpp-conf', label: 'Confirm new password *', autoComplete: 'new-password' },
] as const;

export const PasswordPanel: React.FC<{ hidden: boolean; onBack: () => void }> = ({ hidden, onBack }) => {
  const { password } = profileContent;
  const { values, setValue, visible, toggleVisible, isMismatch, isComplete, fieldErrors, error, isSaving, isSaved, handleSubmit } =
    usePasswordForm();

  return (
    <section className="mp-panel" id="mp-password" aria-labelledby="mp-t-password" hidden={hidden}>
      <PanelHead panel="password" title={password.title} lead={password.lead} onBack={onBack} />
      <PanelSuccess id="mp-password-ok" show={isSaved}>
        <b>{password.success}</b> {password.successNote}
      </PanelSuccess>
      {error && (
        <p className="ms-error mp-fade" role="alert">
          {error}
        </p>
      )}

      <form className="cf-form mp-form mp-form--narrow" id="mp-password-form" autoComplete="off" onSubmit={handleSubmit} aria-busy={isSaving}>
        {FIELDS.map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.id}>{field.label}</label>
            <div className="mb-pass">
              <input
                id={field.id}
                name={field.name}
                type={visible[field.name] ? 'text' : 'password'}
                required
                minLength={field.name === 'current' ? undefined : 8}
                maxLength={128}
                autoComplete={field.autoComplete}
                value={values[field.name]}
                onChange={(e) => setValue(field.name, e.target.value)}
              />
              <button
                className="mb-eye"
                type="button"
                aria-pressed={visible[field.name]}
                aria-controls={field.id}
                onClick={() => toggleVisible(field.name)}
              >
                {visible[field.name] ? 'Hide' : 'Show'}
              </button>
            </div>
            {field.name === 'confirm' && isMismatch ? (
              <p className="mp-hint mp-hint--bad">{password.mismatch}</p>
            ) : (
              <FieldError message={fieldErrors[field.name]} />
            )}
          </div>
        ))}
        <div className="mp-actions">
          <button className={`btn btn-primary mp-save${isSaving ? ' is-saving' : ''}`} type="submit" disabled={isSaving || isMismatch || !isComplete}>
            <span className="mp-spinner" aria-hidden="true" />
            <span>{isSaving ? 'Updating…' : 'Update password'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default PasswordPanel;
