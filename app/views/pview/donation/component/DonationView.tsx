'use client';

import React from 'react';
import { ROUTES } from '@/app/views/common/helper/route';
import { CustomDropdown } from '@/app/views/common';
import { useDonationHandler } from '../handler/useDonationHandler';

export const DonationView: React.FC = () => {
  const {
    content,
    formData,
    isSponsor,
    formattedAmount,
    currentHeadLabel,
    showResetModal,
    handleHeadChange,
    handleAmountChip,
    handleAmountChange,
    handleTeachersChange,
    handleDropdownChange,
    handleChange,
    handleFileChange,
    openResetModal,
    closeResetModal,
    confirmReset,
    handleSubmit,
    preselectFund,
  } = useDonationHandler();

  const {
    breadcrumbs,
    hero,
    aside,
    heads,
    amountPresets,
    teacherOptions,
    batches,
    countries,
    paymentOptions,
    terms,
    impact,
    featuredCause,
    trust,
    cta,
  } = content;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <a href={ROUTES.HOME}>{breadcrumbs.home}</a>
          <span className="sep">/</span>
          <span>{breadcrumbs.current}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="page-hero cf-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.lead}</p>
          </div>
        </div>
      </section>

      {/* The Form Section */}
      <section className="content-section cf-section" id="give-form">
        <div className="wrap cf-layout">
          {/* Aside */}
          <aside className="cf-aside">
            <span className="eyebrow">{aside.eyebrow}</span>
            <h2>{aside.title}</h2>
            <p>{aside.description}</p>
            <div className="aside-quote">
              <p>{aside.quote}</p>
              <div className="who">{aside.quoteWho}</div>
            </div>
            <div className="aside-links">
              {aside.links.map((link, idx) => (
                <a key={idx} href={link.href}>
                  {link.text}
                </a>
              ))}
            </div>
          </aside>

          {/* Form */}
          <form className="cf-form" id="contribForm" onSubmit={handleSubmit} autoComplete="on">
            {/* Step 1: Your contribution */}
            <div className="cf-step">
              <span className="cf-num">1</span>
              <h3>Your contribution</h3>
            </div>

            <fieldset className="cf-group">
              <legend>Contribution head *</legend>
              <div className="cf-heads">
                {heads.map((head) => (
                  <label key={head.id} className="cf-opt">
                    <input
                      type="radio"
                      name="head"
                      value={head.id}
                      checked={formData.head === head.id}
                      onChange={() => handleHeadChange(head.id)}
                    />
                    <span>
                      <b>{head.label}</b>
                      {head.note && (
                        <small className={`cf-note ${head.isWarn ? 'warn' : ''}`}>
                          {head.note}
                        </small>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Free Amount selection */}
            {!isSponsor ? (
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
              <div className="cf-sponsor">
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="d-teachers">Number of teachers to sponsor *</label>
                    <CustomDropdown
                      id="d-teachers"
                      name="teachers"
                      value={formData.teachers}
                      onChange={handleTeachersChange}
                      options={teacherOptions}
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
            )}

            {/* Step 2: About you */}
            <div className="cf-step">
              <span className="cf-num">2</span>
              <h3>About you</h3>
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
                <label htmlFor="d-email">Email *</label>
                <input
                  id="d-email"
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
                    <input
                      type="radio"
                      name="g80"
                      value="yes"
                      checked={formData.g80 === 'yes'}
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="g80"
                      value="no"
                      checked={formData.g80 === 'no'}
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.g80 === 'yes' && (
                <div className="cf-tax">
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="d-pan">PAN number</label>
                      <input
                        id="d-pan"
                        name="pan"
                        type="text"
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
                        onChange={(e) =>
                          handleFileChange('panFile', e.target.files ? e.target.files[0] : null)
                        }
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
                        onChange={(e) =>
                          handleFileChange('addressFile', e.target.files ? e.target.files[0] : null)
                        }
                      />
                    </div>
                  </div>
                  <p className="cf-hint">
                    Address proof can be an Aadhaar copy, driving licence, voter ID card or passport
                    copy.
                  </p>
                </div>
              )}
            </div>

            {/* Step 4: Payment option */}
            <div className="cf-step">
              <span className="cf-num">4</span>
              <h3>Payment option</h3>
            </div>

            <div className="cf-pay" role="radiogroup" aria-label="Payment option">
              {paymentOptions.map((opt) => (
                <label key={opt.id} className="cf-opt">
                  <input
                    type="radio"
                    name="pay"
                    value={opt.id}
                    checked={formData.pay === opt.id}
                    onChange={handleChange}
                  />
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
            </ul>

            <div className="cf-submit">
              <div className="cf-summary">
                <span>
                  You are giving <strong id="cf-sum-amt">{formattedAmount}</strong> to{' '}
                  <em id="cf-sum-for">{currentHeadLabel}</em>
                </span>
              </div>
              <div className="cf-actions">
                <button className="btn btn-primary" type="submit">
                  Donate
                </button>
                <button className="cf-reset" type="button" onClick={openResetModal}>
                  Reset form
                </button>
              </div>
              <p className="form-note">
                A receipt is issued by the Secretariat for every contribution received. Payments
                are processed through the Association&rsquo;s secure payment gateway.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Where it goes */}
      <section className="content-section">
        <div className="wrap">
          <div className="section-head stack">
            <span className="eyebrow">{impact.eyebrow}</span>
            <h2>{impact.title}</h2>
            <p>{impact.lead}</p>
          </div>

          <div className="impact-band">
            {impact.cells.map((cell, idx) => (
              <div key={idx} className="impact-cell">
                <div className="fig">{cell.num}</div>
                <h4>{cell.title}</h4>
                <p>{cell.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cause */}
      <section className="content-section tint-gold">
        <div className="wrap split-2 media-left">
          <div className="split-media">
            <div className="photo-tile duo-teal">
              <img
                className="tile-img"
                src={featuredCause.image}
                alt={featuredCause.caption}
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
            <p className="split-caption">{featuredCause.caption}</p>
          </div>
          <div>
            <span className="eyebrow">{featuredCause.eyebrow}</span>
            <h2 style={{ fontSize: '30px', lineHeight: 1.25, marginTop: '8px' }}>
              {featuredCause.title}
            </h2>
            <div className="prose" style={{ marginTop: '18px' }}>
              <p>{featuredCause.description}</p>
            </div>
            <div className="progress-track" style={{ marginTop: '26px' }}>
              <div className="progress-fill" style={{ width: `${featuredCause.percent}%` }}></div>
            </div>
            <div className="fund-meta">
              <span>{featuredCause.percent}% donated</span>
              <span>
                <strong>{featuredCause.collected}</strong> / {featuredCause.target}
              </span>
            </div>
            <div className="btn-row" style={{ marginTop: '22px' }}>
              <a
                className="btn btn-primary"
                href={featuredCause.primaryBtn.href}
                data-fund="tbf"
                onClick={(e) => {
                  e.preventDefault();
                  preselectFund('tbf');
                }}
              >
                {featuredCause.primaryBtn.text}
              </a>
              <a className="btn btn-secondary" href={featuredCause.secondaryBtn.href}>
                {featuredCause.secondaryBtn.text}
              </a>
            </div>

            <div className="ask-ribbon" style={{ marginTop: '28px' }}>
              <div className="ask-item">
                <div className="ask-item-top">
                  <div className="ask-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5>{featuredCause.asks[0].title}</h5>
                    <p>{featuredCause.asks[0].budget}</p>
                  </div>
                </div>
              </div>
              <div className="ask-item">
                <div className="ask-item-top">
                  <div className="ask-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M8 5H5v1a3 3 0 0 0 3 3M16 5h3v1a3 3 0 0 1-3 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 12v3M9 19h6M10 15h4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5>{featuredCause.asks[1].title}</h5>
                    <p>{featuredCause.asks[1].budget}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="content-section tight tint-navy-soft">
        <div className="wrap">
          <div className="section-head stack">
            <span className="eyebrow">{trust.eyebrow}</span>
            <h2>{trust.title}</h2>
          </div>
          <div className="trust-row" style={{ marginTop: 0, borderTop: 'none' }}>
            <div className="trust-cell">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h5>{trust.cells[0].title}</h5>
              <p>{trust.cells[0].description}</p>
            </div>
            <div className="trust-cell">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12h6M9 16h6M9 8h6M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <h5>{trust.cells[1].title}</h5>
              <p>{trust.cells[1].description}</p>
            </div>
            <div className="trust-cell">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <h5>{trust.cells[2].title}</h5>
              <p>
                Call the Secretariat on 011-23748666 or write to{' '}
                <a href="mailto:info@oldcolumban.net">info@oldcolumban.net</a>. St. Columba&rsquo;s
                School, Ashoka Place, New Delhi &ndash; 110 001.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2>{cta.title}</h2>
            <p>{cta.lead}</p>
          </div>
          <div className="cta-band-actions">
            <a className="btn btn-gold" href={cta.primaryBtn.href}>
              {cta.primaryBtn.text}
            </a>
            <a className="btn btn-secondary" href={cta.secondaryBtn.href}>
              {cta.secondaryBtn.text}
            </a>
          </div>
        </div>
      </section>

      {/* Confirm Reset Modal */}
      {showResetModal && (
        <div
          className="modal-backdrop"
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
            <p>Everything you have entered will be cleared. This cannot be undone.</p>
            <div className="cd-actions">
              <button className="btn btn-secondary" type="button" onClick={closeResetModal}>
                Keep editing
              </button>
              <button className="btn btn-primary" type="button" onClick={confirmReset}>
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationView;
