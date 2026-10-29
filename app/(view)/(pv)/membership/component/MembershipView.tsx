'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useAuth } from '@/app/(view)/common/helper/useAuth';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { CustomDropdown, DatePicker } from '@/app/(view)/common';
import { DATE_OF_BIRTH_PICKER } from '@/app/(view)/common/helper/common.helper';
import { MEMBERSHIP_CONTENT } from '../content/membership.content';
import { formatRupees } from '../helper/membership.helper';
import { useMembershipHandler } from '../handler/useMembershipHandler';

interface MembershipViewProps {
  /** The Life Membership fee in rupees, as set in the admin panel. */
  fee: number;
}

export const MembershipView: React.FC<MembershipViewProps> = ({ fee }) => {
  const { isAuthenticated } = useAuth();
  const contact = useContact();
  const content = MEMBERSHIP_CONTENT;
  const feeLabel = formatRupees(fee);
  const {
    step,
    formData,
    showPassword,
    showResetModal,
    isSubmitting,
    submitError,
    formRef,
    reviewItems,
    handleChange,
    handleDropdownChange,
    togglePasswordVisibility,
    goToNextStep,
    goToPrevStep,
    openResetModal,
    closeResetModal,
    confirmReset,
    handleKeyDown,
    handleSubmit,
  } = useMembershipHandler();

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <span>Membership</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="page-hero cf-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{content.hero.eyebrow}</span>
            <h1>{content.hero.title}</h1>
            <p className="lead">{content.hero.lead}</p>
          </div>
        </div>
      </section>

      {/* The Form Section */}
      <section className="content-section cf-section" id="join">
        <div className="wrap cf-layout">
          <aside className="cf-aside">
            <span className="eyebrow">{content.aside.eyebrow}</span>
            <h2>{content.aside.title}</h2>
            <p>{content.aside.description}</p>
            <div className="ms-fee">
              <span className="ms-fee-k">{content.aside.fee.label}</span>
              <strong>{feeLabel}</strong>
              <span className="ms-fee-n">{content.aside.fee.note}</span>
            </div>
            <div className="aside-quote">
              <p>{content.aside.quote.text}</p>
              <div className="who">{content.aside.quote.author}</div>
            </div>
            <div className="aside-links">
              <Link href={ROUTES.VISION_MISSION}>Learn about our mission &rarr;</Link>
              <Link href={ROUTES.EXECUTIVE_COMMITTEE}>Meet the Executive Committee &rarr;</Link>
              <Link href={ROUTES.BYLAWS}>Read the ByLaws &rarr;</Link>
            </div>
          </aside>

          <form
            className="cf-form ms-form"
            id="memberForm"
            ref={formRef}
            autoComplete="on"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          >
            <div className="ms-head">
              <ol className="ms-steps" aria-label="Application steps">
                <li
                  className={step === 1 ? 'is-current' : 'is-done'}
                  aria-current={step === 1 ? 'step' : undefined}
                >
                  <span className="ms-dot">1</span>
                  <span className="ms-lab">
                    <b>Your details</b>
                    <small>Name and login</small>
                  </span>
                </li>
                <li
                  className={step === 2 ? 'is-current' : step > 2 ? 'is-done' : ''}
                  aria-current={step === 2 ? 'step' : undefined}
                >
                  <span className="ms-dot">2</span>
                  <span className="ms-lab">
                    <b>Address</b>
                    <small>Where you live</small>
                  </span>
                </li>
                <li
                  className={step === 3 ? 'is-current' : ''}
                  aria-current={step === 3 ? 'step' : undefined}
                >
                  <span className="ms-dot">3</span>
                  <span className="ms-lab">
                    <b>Review &amp; pay</b>
                    <small>{content.feeText.step(feeLabel)}</small>
                  </span>
                </li>
              </ol>
              <p className="ms-note" aria-live="polite">
                <strong id="ms-now">Step {step} of 3.</strong>{' '}
                <span
                  id="ms-msg"
                  dangerouslySetInnerHTML={{
                    __html: content.stepMessages[step as 1 | 2 | 3](feeLabel),
                  }}
                />
              </p>
            </div>

            {submitError && (
              <p className="ms-error" role="alert">
                {submitError}
              </p>
            )}

            {/* Step 1: Your Details */}
            <div className="ms-panel" id="ms-p1" data-step="1" hidden={step !== 1}>
              <fieldset className="cf-group">
                <legend>Type of membership</legend>
                <label className="cf-opt mb-lock">
                  <input
                    type="radio"
                    name="mtype"
                    value="life"
                    checked={formData.mtype === 'life'}
                    onChange={handleChange}
                  />
                  <span>
                    <b>Life Member</b>
                    <small className="cf-note">
                      {content.feeText.lifeMember(feeLabel)}
                    </small>
                  </span>
                  <em className="mb-badge">Selected</em>
                </label>
              </fieldset>

              <hr className="ms-sep" />
              <div className="field-row">
                <div className="field">
                  <label htmlFor="m-title">Title *</label>
                  <CustomDropdown
                    id="m-title"
                    name="title"
                    value={formData.title}
                    onChange={(val) => handleDropdownChange('title', val)}
                    options={content.titles}
                    placeholder="Select title"
                    required
                    ariaLabel="Title"
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-batch">Batch *</label>
                  <CustomDropdown
                    id="m-batch"
                    name="batch"
                    value={formData.batch}
                    onChange={(val) => handleDropdownChange('batch', val)}
                    options={content.batches}
                    placeholder="Select batch"
                    required
                    searchable
                    ariaLabel="Batch"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="m-first">First name *</label>
                  <input
                    id="m-first"
                    name="first_name"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-middle">Middle name</label>
                  <input
                    id="m-middle"
                    name="middle_name"
                    type="text"
                    autoComplete="additional-name"
                    placeholder="Middle name"
                    value={formData.middle_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="m-dob">Date of birth *</label>
                  <DatePicker
                    id="m-dob"
                    name="dob"
                    value={formData.dob}
                    onChange={(val) => handleDropdownChange('dob', val)}
                    {...DATE_OF_BIRTH_PICKER}
                    placeholder="Select date of birth"
                    required
                    ariaLabel="Date of birth"
                  />
                </div>
              </div>

              <hr className="ms-sep" />
              <div className="field-row">
                <div className="field">
                  <label htmlFor="m-email">Email *</label>
                  <input
                    id="m-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-pass">Password *</label>
                  <div className="mb-pass">
                    <input
                      id="m-pass"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="mb-eye"
                      type="button"
                      aria-pressed={showPassword}
                      aria-controls="m-pass"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="m-mobile">
                  Mobile * <span className="mb-sub">(country code and number)</span>
                </label>
                <div className="mb-mobile">
                  <input
                    id="m-code"
                    name="country_code"
                    type="text"
                    required
                    inputMode="tel"
                    value={formData.country_code}
                    aria-label="Country code"
                    autoComplete="tel-country-code"
                    onChange={handleChange}
                  />
                  <input
                    id="m-mobile"
                    name="mobile"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    placeholder="Mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="ms-sep" />
              <label className="mb-check">
                <input
                  type="checkbox"
                  name="agree_rules"
                  required
                  checked={formData.agree_rules}
                  onChange={handleChange}
                />
                <span>
                  By being a member, I hereby agree to abide by{' '}
                  <a href={ROUTES.BYLAWS} target="_blank" rel="noopener noreferrer">
                    all Rules &amp; By-Laws
                  </a>{' '}
                  as contained in the Memorandum of Constitution of The Old Columbans
                  Association (as amended from time to time).
                </span>
              </label>
              <label className="mb-check">
                <input
                  type="checkbox"
                  name="share_email"
                  checked={formData.share_email}
                  onChange={handleChange}
                />
                <span>
                  I hereby permit The Old Columban Association to share my Email ID
                  with all / any OCA Affiliate Programme Partners in order to facilitate
                  availment of special offers.
                </span>
              </label>
              <ul className="cf-terms">
                <li>All payments will be accepted in Indian Rupees only.</li>
                <li>
                  International Debit / Credit cards and International Bank transfers
                  are not accepted.
                </li>
              </ul>

              <div className="ms-nav">
                <button
                  className="btn btn-primary"
                  type="button"
                  data-ms="next"
                  onClick={goToNextStep}
                >
                  Continue to address
                </button>
                <button
                  className="cf-reset"
                  type="button"
                  data-reset-form="ms-p1"
                  onClick={() => openResetModal(1)}
                >
                  Reset form
                </button>
              </div>
              <p className="form-note">
                The Secretariat verifies each application against School records before
                enrolment. Questions? Write to{' '}
                <a href={contact.mailto()}>{contact.email}</a> or call{' '}
                <a href={contact.tel}>{contact.phone}</a>.
              </p>
            </div>

            {/* Step 2: Address */}
            <div className="ms-panel" id="ms-p2" data-step="2" hidden={step !== 2}>
              <div className="field">
                <label htmlFor="m-addr1">Residence Address Line 1 *</label>
                <input
                  id="m-addr1"
                  name="addr1"
                  type="text"
                  required
                  autoComplete="address-line1"
                  placeholder="House number, street"
                  value={formData.addr1}
                  onChange={handleChange}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="m-addr2">Residence Address Line 2</label>
                  <input
                    id="m-addr2"
                    name="addr2"
                    type="text"
                    autoComplete="address-line2"
                    placeholder="Locality, area"
                    value={formData.addr2}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-addr3">Residence Address Line 3</label>
                  <input
                    id="m-addr3"
                    name="addr3"
                    type="text"
                    placeholder="Landmark, if any"
                    value={formData.addr3}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="cf-row3 eq">
                <div className="field">
                  <label htmlFor="m-city">Residence City *</label>
                  <input
                    id="m-city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-state">Residence State *</label>
                  <input
                    id="m-state"
                    name="state"
                    type="text"
                    required
                    autoComplete="address-level1"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-zip">Residence Zip *</label>
                  <input
                    id="m-zip"
                    name="zip"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="Zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="m-country">Residence Country *</label>
                <CustomDropdown
                  id="m-country"
                  name="country"
                  value={formData.country}
                  onChange={(val) => handleDropdownChange('country', val)}
                  options={content.countries}
                  placeholder="Select country"
                  required
                  searchable
                  ariaLabel="Residence Country"
                />
              </div>

              <div className="ms-nav">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-ms="back"
                  onClick={goToPrevStep}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  data-ms="next"
                  onClick={goToNextStep}
                >
                  Continue to payment
                </button>
                <button
                  className="cf-reset"
                  type="button"
                  data-reset-form="ms-p2"
                  onClick={() => openResetModal(2)}
                >
                  Reset form
                </button>
              </div>
            </div>

            {/* Step 3: Review & pay */}
            <div className="ms-panel" id="ms-p3" data-step="3" hidden={step !== 3}>
              <dl className="ms-review" id="ms-review" aria-label="Your application">
                {reviewItems.map((item) => (
                  <React.Fragment key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value || '—'}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <div className="ms-bill">
                <div className="ms-bill-row">
                  <span>
                    Life Membership <small>one-time</small>
                  </span>
                  <b>{feeLabel}</b>
                </div>
                <div className="ms-bill-total">
                  <span>Total to pay</span>
                  <strong>{feeLabel}</strong>
                </div>
              </div>
              <ul className="cf-terms">
                <li>{content.checkout.note}</li>
                <li>All payments will be accepted in Indian Rupees only.</li>
                <li>
                  International Debit / Credit cards and International Bank transfers
                  are not accepted.
                </li>
              </ul>
              <div className="ms-nav">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-ms="back"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? content.checkout.redirecting : content.checkout.button(feeLabel)}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="content-section">
        <div className="wrap benefit-split">
          <div>
            <span className="eyebrow">Why join</span>
            <h2 style={{ fontSize: '30px', lineHeight: 1.25, marginTop: '8px' }}>
              You left the School. You never left the community.
            </h2>
            <div className="prose" style={{ marginTop: '20px' }}>
              <p>
                Membership of the Old Columbans Association is for life. It puts you
                back on the roll, keeps you in touch with your batch, and makes you part
                of the body that looks after the School and the people who taught in it.
              </p>
            </div>
            <figure className="motto motto--plaque" style={{ marginTop: '30px' }}>
              <div className="motto-orn" aria-hidden="true">
                <i />
              </div>
              <p className="motto-latin" lang="la">
                <span>Sapere aude</span> <span>sincere et constanter</span>
              </p>
              <p className="motto-trans">Dare to be wise, sincere and constant.</p>
              <figcaption className="motto-cap">
                The motto of St. Columba&rsquo;s School
              </figcaption>
            </figure>
          </div>
          <div className="benefit-list">
            {content.benefits.map((b) => (
              <div key={b.num} className="benefit">
                <div className="bn">{b.num}</div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">{content.cta.eyebrow}</span>
            <h2>{content.cta.title}</h2>
            <p>{content.cta.desc}</p>
          </div>
          <div className="cta-band-actions">
            {!isAuthenticated && (
              <Link className="btn btn-gold" href={ROUTES.MEMBER_SIGNIN}>
                Sign In
              </Link>
            )}
            <Link className="btn btn-secondary" href={ROUTES.DONATION}>
              Support OCA
            </Link>
          </div>
        </div>
      </section>

      {/* Reset Confirmation Dialog */}
      {showResetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 32, 39, .6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closeResetModal}
        >
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="crTitle"
          >
            <h3 id="crTitle">Reset this form?</h3>
            <p>
              Everything you have entered will be cleared. This cannot be undone.
            </p>
            <div className="cd-actions">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeResetModal}
              >
                Keep editing
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={confirmReset}
              >
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MembershipView;
