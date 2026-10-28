'use client';

import React from 'react';
import { CustomDropdown } from '@/app/(view)/common/component/CustomDropdown';
import { profileContent } from '../../content';
import { useAccountForm } from '../../handler';
import type { MemberProfile, ProfileAddress } from '../../services';
import { FieldError, PanelHead, PanelSuccess } from './PanelHead';
import { DiscardDialog } from './DiscardDialog';

interface AccountPanelProps {
  profile: MemberProfile;
  hidden: boolean;
  onBack: () => void;
  onSaved: (profile: MemberProfile) => void;
}

export const AccountPanel: React.FC<AccountPanelProps> = ({ profile, hidden, onBack, onSaved }) => {
  const { account } = profileContent;
  const {
    form,
    setField,
    setAddress,
    fieldErrors,
    error,
    isSaving,
    isSaved,
    handleSubmit,
    isDiscardOpen,
    openDiscard,
    closeDiscard,
    confirmDiscard,
  } = useAccountForm(profile, onSaved);

  const addressInput = (key: keyof ProfileAddress, id: string, label: string, autoComplete?: string, required = false) => (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={id}
        name={key}
        type="text"
        required={required}
        value={form.address[key]}
        onChange={(e) => setAddress(key, e.target.value)}
        autoComplete={autoComplete}
        inputMode={key === 'zip' ? 'numeric' : undefined}
      />
      <FieldError message={fieldErrors[key]} />
    </div>
  );

  return (
    <section className="mp-panel" id="mp-account" aria-labelledby="mp-t-account" hidden={hidden}>
      <PanelHead panel="account" title={account.title} lead={account.lead} onBack={onBack} />
      <PanelSuccess id="mp-account-ok" show={isSaved}>
        <b>{account.success}</b> {account.successNote}
      </PanelSuccess>
      {error && (
        <p className="ms-error" role="alert">
          {error}
        </p>
      )}

      <form className="cf-form mp-form" id="mp-account-form" autoComplete="on" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="mpa-title">Title</label>
            <CustomDropdown
              id="mpa-title"
              name="title"
              value={form.title}
              onChange={(val) => setField('title', val)}
              options={account.titles}
              placeholder="Select title"
              ariaLabel="Title"
            />
          </div>
          <div className="field">
            <label htmlFor="mpa-batch">Batch</label>
            <CustomDropdown
              id="mpa-batch"
              name="batch"
              value={profile.batchYear ?? ''}
              onChange={() => undefined}
              options={account.batches}
              placeholder="Not on record"
              disabled
              ariaLabel="Batch"
            />
            <p className="mp-hint">{account.batchHint}</p>
          </div>
        </div>

        <div className="cf-row3 eq">
          <div className="field">
            <label htmlFor="mpa-first">First name *</label>
            <input id="mpa-first" name="first" type="text" required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} autoComplete="given-name" />
            <FieldError message={fieldErrors.firstName} />
          </div>
          <div className="field">
            <label htmlFor="mpa-middle">Middle name</label>
            <input id="mpa-middle" name="middle" type="text" value={form.middleName} onChange={(e) => setField('middleName', e.target.value)} autoComplete="additional-name" />
          </div>
          <div className="field">
            <label htmlFor="mpa-last">Last name *</label>
            <input id="mpa-last" name="last" type="text" required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} autoComplete="family-name" />
            <FieldError message={fieldErrors.lastName} />
          </div>
        </div>

        <hr className="ms-sep" />
        <div className="field-row">
          <div className="field">
            <label htmlFor="mpa-email">Email *</label>
            <input id="mpa-email" name="email" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} autoComplete="email" />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className="field">
            <label htmlFor="mpa-mobile">Mobile *</label>
            <input id="mpa-mobile" name="mobile" type="tel" required value={form.mobile} onChange={(e) => setField('mobile', e.target.value)} autoComplete="tel" />
            <FieldError message={fieldErrors.mobile} />
          </div>
        </div>

        <hr className="ms-sep" />
        {addressInput('line1', 'mpa-a1', 'Residence Address Line 1', 'address-line1', true)}
        <div className="field-row">
          {addressInput('line2', 'mpa-a2', 'Residence Address Line 2', 'address-line2')}
          {addressInput('line3', 'mpa-a3', 'Residence Address Line 3')}
        </div>
        <div className="cf-row3 eq">
          {addressInput('city', 'mpa-city', 'City', 'address-level2', true)}
          {addressInput('state', 'mpa-state', 'State', 'address-level1', true)}
          {addressInput('zip', 'mpa-zip', 'Zip', 'postal-code', true)}
        </div>
        <div className="field">
          <label htmlFor="mpa-country">Country *</label>
          <CustomDropdown
            id="mpa-country"
            name="country"
            value={form.address.country}
            onChange={(val) => setAddress('country', val)}
            options={account.countries}
            placeholder="Select country"
            required
            searchable
            ariaLabel="Country"
          />
          <FieldError message={fieldErrors.country} />
        </div>

        <div className="mp-actions">
          <button className="btn btn-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
          <button className="cf-reset" type="button" onClick={openDiscard}>
            Discard changes
          </button>
        </div>
      </form>

      {isDiscardOpen && <DiscardDialog onCancel={closeDiscard} onConfirm={confirmDiscard} />}
    </section>
  );
};

export default AccountPanel;
