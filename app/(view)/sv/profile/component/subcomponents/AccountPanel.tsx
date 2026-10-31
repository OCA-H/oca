'use client';

import React from 'react';
import { CustomDropdown } from '@/app/(view)/common/component/CustomDropdown';
import { DatePicker } from '@/app/(view)/common/component/DatePicker';
import { PhoneInput } from '@/app/(view)/common/component/PhoneInput';
import { DATE_OF_BIRTH_PICKER } from '@/app/(view)/common/helper/common.helper';
import { profileContent } from '../../content';
import { useAccountForm } from '../../handler';
import type { MemberProfile, ProfileAddress } from '../../services';
import { FieldError, PanelHead, PanelSuccess } from './PanelHead';
import { DiscardDialog } from './DiscardDialog';
import { ProfileIcon } from './ProfileIcon';

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
    phone,
    setPhone,
    setAddress,
    isLocked,
    isDirty,
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

  /** Email or mobile: read-only, with a lock and a note, when this session signed in with it. */
  const contactInput = (key: 'email' | 'mobile', id: string, label: string, type: string, autoComplete: string, hint?: string) => {
    const locked = isLocked(key);
    const hintId = `${id}-hint`;
    return (
      <div className="field">
        <label htmlFor={id}>
          {label}
          {!locked && key === 'mobile' && ' *'}
        </label>
        <div className={`mp-input${locked ? ' is-locked' : ''}`}>
          {key === 'mobile' ? (
            <PhoneInput
              id={id}
              name={key}
              required={!locked}
              readOnly={locked}
              aria-describedby={locked || hint ? hintId : undefined}
              maxLength={15}
              value={phone}
              onChange={setPhone}
              autoComplete={locked ? 'off' : autoComplete}
            />
          ) : (
            <input
              id={id}
              name={key}
              type={type}
              readOnly={locked}
              aria-readonly={locked || undefined}
              aria-describedby={locked || hint ? hintId : undefined}
              value={form[key]}
              onChange={(e) => setField(key, e.target.value)}
              autoComplete={locked ? 'off' : autoComplete}
            />
          )}
          {locked && <ProfileIcon name="lock" className="mp-input-lock" />}
        </div>
        {fieldErrors[key] ? (
          <FieldError message={fieldErrors[key]} />
        ) : locked ? (
          <p className="mp-hint" id={hintId}>{account.lockedHint[key]}</p>
        ) : (
          hint && <p className="mp-hint" id={hintId}>{hint}</p>
        )}
      </div>
    );
  };

  return (
    <section className="mp-panel" id="mp-account" aria-labelledby="mp-t-account" hidden={hidden}>
      <PanelHead panel="account" title={account.title} lead={account.lead} onBack={onBack} />
      <PanelSuccess id="mp-account-ok" show={isSaved}>
        <b>{account.success}</b> {account.successNote}
      </PanelSuccess>
      {error && (
        <p className="ms-error mp-fade" role="alert">
          {error}
        </p>
      )}

      <form className="cf-form mp-form" id="mp-account-form" autoComplete="on" onSubmit={handleSubmit} aria-busy={isSaving}>
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
              value={form.batchYear}
              onChange={(val) => setField('batchYear', val)}
              options={account.batches}
              placeholder="Select batch"
              required={Boolean(profile.batchYear)}
              searchable
              ariaLabel="Batch"
            />
            {fieldErrors.batchYear ? <FieldError message={fieldErrors.batchYear} /> : <p className="mp-hint">{account.batchHint}</p>}
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
            <label htmlFor="mpa-last">Last name</label>
            <input id="mpa-last" name="last" type="text" value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} autoComplete="family-name" />
            <FieldError message={fieldErrors.lastName} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="mpa-dob">Date of birth{profile.dateOfBirth ? ' *' : ''}</label>
            <DatePicker
              id="mpa-dob"
              name="dob"
              value={form.dateOfBirth}
              onChange={(val) => setField('dateOfBirth', val)}
              {...DATE_OF_BIRTH_PICKER}
              placeholder="Select date of birth"
              required={Boolean(profile.dateOfBirth)}
              ariaLabel="Date of birth"
            />
            {fieldErrors.dateOfBirth ? <FieldError message={fieldErrors.dateOfBirth} /> : <p className="mp-hint">{account.dobHint}</p>}
          </div>
        </div>

        <hr className="ms-sep" />
        <div className="field-row">
          {contactInput('email', 'mpa-email', 'Email', 'email', 'email', account.emailHint)}
          {contactInput('mobile', 'mpa-mobile', 'Mobile', 'tel', 'tel-national', account.mobileHint)}
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
          <button className={`btn btn-primary mp-save${isSaving ? ' is-saving' : ''}`} type="submit" disabled={isSaving || !isDirty}>
            <span className="mp-spinner" aria-hidden="true" />
            <span>{isSaving ? 'Saving…' : 'Save changes'}</span>
          </button>
          <button className="cf-reset" type="button" onClick={openDiscard} disabled={isSaving || !isDirty}>
            Discard changes
          </button>
        </div>
      </form>

      {isDiscardOpen && <DiscardDialog onCancel={closeDiscard} onConfirm={confirmDiscard} />}
    </section>
  );
};

export default AccountPanel;
