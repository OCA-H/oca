'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { useDonationHandler } from '../handler/useDonationHandler';
import { ContributionForm, ContributionLockOverlay, ContributionDummyPreview } from './subcomponents';

export const DonationView: React.FC = () => {
  const handler = useDonationHandler();
  const contact = useContact();
  const { content, isAuthenticated, showResetModal, closeResetModal, confirmReset, preselectFund } = handler;

  const { breadcrumbs, hero, aside, impact, featuredCause, trust, cta } = content;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>{breadcrumbs.home}</Link>
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

          {/* Form: members only. Visitors see a blurred placeholder, never real data. */}
          <div className="cf-gate">
            {!isAuthenticated && <ContributionLockOverlay />}
            {isAuthenticated ? <ContributionForm handler={handler} /> : <ContributionDummyPreview />}
          </div>
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
                Call the Secretariat on <a href={contact.tel}>{contact.phone}</a> or write to{' '}
                <a href={contact.mailto()}>{contact.email}</a>. {contact.address}.
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
            <Link className="btn btn-gold" href={cta.primaryBtn.href}>
              {cta.primaryBtn.text}
            </Link>
            <Link className="btn btn-secondary" href={cta.secondaryBtn.href}>
              {cta.secondaryBtn.text}
            </Link>
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
