'use client';

import React from 'react';
import { CustomDropdown } from '@/app/(view)/common';
import type { DonationHandler } from '../../handler/useDonationHandler';
import { unitOptions } from '../../helper/donation.helper';

/** The contribution form a signed-in member fills in; funds come from the database. */
export const ContributionForm: React.FC<{ handler: DonationHandler }> = ({ handler }) => {
  const {
    content,
    hasProfile,
    applyProfile,
    funds,
    fundsError,
    currentFund,
    formData,
    isPerUnit,
    formattedAmount,
    isSubmitting,
    submitError,
    handleFundChange,
    handleAmountChip,
    handleAmountChange,
    handleUnitsChange,
    handleDropdownChange,
    handleChange,
    handleFileChange,
    openResetModal,
    handleSubmit,
  } = handler;
  const { amountPresets, batches, countries, paymentOptions, terms } = content;

  return (
    <form className="cf-form" id="contribForm" onSubmit={handleSubmit} autoComplete="on">
      {/* Step 1: Your contribution */}
      <div className="cf-step">
        <span className="cf-num">1</span>
        <h3>Your contribution</h3>
      </div>

      <fieldset className="cf-group">
        <legend>Contribution head *</legend>
        {fundsError && (
          <p className="ms-error" role="alert">
            {fundsError}
          </p>
        )}
        <div className="cf-heads">
          {funds.map((fund) => (
            <label key={fund.code} className="cf-opt">
              <input
                type="radio"
                name="fund"
                value={fund.code}
                checked={formData.fund === fund.code}
                disabled={fund.suspended}
                onChange={() => handleFundChange(fund.code)}
              />
              <span>
                <b>{fund.label}</b>
                {fund.note && <small className={`cf-note ${fund.suspended ? 'warn' : ''}`}>{fund.note}</small>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {!isPerUnit ? (
        <div className="cf-free">
          <div className="field">
            <label htmlFor="d-amount">Amount (&#8377;) *</label>
            <div className="amount-row" data-target="d-amount">
              {amountPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`amount-chip ${formData.amount === preset ? 'active' : ''}`}
                  onClick={() => handleAmountChip(preset)}
                >
                  &#8377;{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <input
              id="d-amount"
              name="amount"
              type="number"
              min="100"
              required
              value={formData.amount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value, 10))}
              aria-label="Amount in rupees"
            />
          </div>
        </div>
      ) : (
        currentFund && (
          <div className="cf-sponsor">
            <div className="field-row">
              <div className="field">
                <label htmlFor="d-units">Number of {currentFund.unitLabel ?? 'unit'}s to sponsor *</label>
                <CustomDropdown
                  id="d-units"
                  name="units"
                  value={formData.units}
                  onChange={handleUnitsChange}
                  options={unitOptions(currentFund)}
                />
              </div>
              <div className="field">
                <label>Contribution amount</label>
                <div className="cf-fixed" id="cf-fixed">
                  {formattedAmount}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Step 2: About you */}
      <div className="cf-step">
        <span className="cf-num">2</span>
        <h3>About you</h3>
        {hasProfile && (
          <button
            type="button"
            className="cf-autofill"
            onClick={applyProfile}
            disabled={isSubmitting}
            title="Fill in your name, mobile and address from your member profile"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Use my profile details
          </button>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="d-name">Name *</label>
          <input
            id="d-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="As it should appear on the receipt"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="d-batch">Batch</label>
          <CustomDropdown
            id="d-batch"
            name="batch"
            value={formData.batch}
            onChange={(val) => handleDropdownChange('batch', val)}
            options={batches}
            placeholder="Select batch"
            searchable={true}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="d-email">Email</label>
          {/* The account's email, set on the server too: the receipt always goes to the signed-in member. */}
          <input
            id="d-email"
            name="email"
            type="email"
            readOnly
            aria-readonly="true"
            className="cf-locked"
            value={formData.email}
          />
          <small className="cf-field-note">Your account email. The receipt is sent here.</small>
        </div>
        <div className="field">
          <label htmlFor="d-phone">Mobile *</label>
          <input
            id="d-phone"
            name="mobile"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="d-address">Address *</label>
        <input
          id="d-address"
          name="address"
          type="text"
          required
          autoComplete="street-address"
          placeholder="Flat / house, street, locality"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="field-row three">
        <div className="field">
          <label htmlFor="d-city">City *</label>
          <input
            id="d-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="d-state">State *</label>
          <input
            id="d-state"
            name="state"
            type="text"
            required
            autoComplete="address-level1"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="d-pin">Pin code *</label>
          <input
            id="d-pin"
            name="pincode"
            type="text"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="postal-code"
            placeholder="6 digits"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="d-country">Residence Country *</label>
        <CustomDropdown
          id="d-country"
          name="country"
          value={formData.country}
          onChange={(val) => handleDropdownChange('country', val)}
          options={countries}
          searchable={true}
        />
      </div>

      {/* Step 3: Tax benefit */}
      <div className="cf-step">
        <span className="cf-num">3</span>
        <h3>Tax benefit</h3>
      </div>

      <div className="cf-80g">
        <div className="cf-80g-q">
          <p>Do you want the benefit of 80G under section 12(a) of the Income Tax Act, 1961?</p>
          <div className="cf-seg" role="radiogroup" aria-label="80G benefit">
            <label>
              <input type="radio" name="g80" value="yes" checked={formData.g80 === 'yes'} onChange={handleChange} />
              Yes
            </label>
            <label>
              <input type="radio" name="g80" value="no" checked={formData.g80 === 'no'} onChange={handleChange} />
              No
            </label>
          </div>
        </div>

        {formData.g80 === 'yes' && (
          <div className="cf-tax">
            <div className="field-row">
              <div className="field">
                <label htmlFor="d-pan">PAN number *</label>
                <input
                  id="d-pan"
                  name="pan"
                  type="text"
                  required
                  maxLength={10}
                  pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]"
                  autoCapitalize="characters"
                  placeholder="ABCDE1234F"
                  style={{ textTransform: 'uppercase' }}
                  value={formData.pan}
                  onChange={handleChange}
                />
              </div>
              <div className="field cf-file">
                <label htmlFor="d-pan-file">Upload PAN card</label>
                <input
                  id="d-pan-file"
                  name="pan_file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('panFile', e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="d-adoc">Address document number</label>
                <input
                  id="d-adoc"
                  name="addressDoc"
                  type="text"
                  placeholder="Number on the document"
                  value={formData.addressDoc}
                  onChange={handleChange}
                />
              </div>
              <div className="field cf-file">
                <label htmlFor="d-adoc-file">Upload address proof</label>
                <input
                  id="d-adoc-file"
                  name="address_file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('addressFile', e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>
            <p className="cf-hint">
              Address proof can be an Aadhaar copy, driving licence, voter ID card or passport copy.
            </p>
          </div>
        )}
      </div>

      {/* Step 4: Payment option */}
      {/* <div className="cf-step">
        <span className="cf-num">4</span>
        <h3>Payment option</h3>
      </div>
      <p className="cf-hint">
        You will complete the payment on CCAvenue&rsquo;s secure page, where you can still switch method.
      </p>

      <div className="cf-pay" role="radiogroup" aria-label="Payment option">
        {paymentOptions.map((opt) => (
          <label key={opt.id} className="cf-opt">
            <input type="radio" name="pay" value={opt.id} checked={formData.pay === opt.id} onChange={handleChange} />
            <span>
              <b>{opt.label}</b>
              <small>{opt.desc}</small>
            </span>
          </label>
        ))}
      </div>

      <ul className="cf-terms">
        {terms.map((term, idx) => (
          <li key={idx}>{term}</li>
        ))}
      </ul> */}

      <div className="cf-submit">
        {submitError && (
          <p className="ms-error" role="alert">
            {submitError}
          </p>
        )}
        <div className="cf-summary">
          <span>
            You are giving <strong id="cf-sum-amt">{formattedAmount}</strong> to{' '}
            <em id="cf-sum-for">{currentFund?.label ?? ''}</em>
          </span>
        </div>
        <div className="cf-actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting || !currentFund}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Redirecting to secure payment…' : 'Donate'}
          </button>
          <button className="cf-reset" type="button" onClick={openResetModal} disabled={isSubmitting}>
            Reset form
          </button>
        </div>
        <p className="form-note">
          A thank-you email with your payment details is sent as soon as your contribution is received. Payments
          are processed securely by CCAvenue.
        </p>
      </div>
    </form>
  );
};

export default ContributionForm;
