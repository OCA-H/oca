'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { partnerOrganizationContent } from '../content';
import { usePartnerOrganizationHandler } from '../handler';
import { useAuth } from '@/app/(view)/common/helper/useAuth';
import { useContact } from '@/app/(view)/common/component/ContactProvider';

export const PartnerOrganizationView: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const contact = useContact();
  const {
    user,
    setUser,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    isLoading,
    feedback,
    handleSubmit,
  } = usePartnerOrganizationHandler();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={partnerOrganizationContent.breadcrumb.homeHref}>
            {partnerOrganizationContent.breadcrumb.homeText}
          </Link>
          <span className="sep">/</span>
          <span>{partnerOrganizationContent.breadcrumb.sectionText}</span>
          <span className="sep">/</span>
          <span>{partnerOrganizationContent.breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="content-section si-section">
        <div className="wrap">
          <div className="si-split">

            <aside className="si-side">
              <div className="si-crest" role="img" aria-label="Old Columbans Association crest" />
              <span className="eyebrow">{partnerOrganizationContent.eyebrow}</span>
              <h2>{partnerOrganizationContent.title}</h2>
              <ul className="si-list">
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="m3 11 4-4 3 2 4-2 7 4-4 7-3-3-4 2-3-3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <b>{partnerOrganizationContent.benefits[0].title}</b>
                    <span className="d">{partnerOrganizationContent.benefits[0].desc}</span>
                  </div>
                </li>
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <b>{partnerOrganizationContent.benefits[1].title}</b>
                    <span className="d">{partnerOrganizationContent.benefits[1].desc}</span>
                  </div>
                </li>
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <div>
                    <b>{partnerOrganizationContent.benefits[2].title}</b>
                    <span className="d">{partnerOrganizationContent.benefits[2].desc}</span>
                  </div>
                </li>
              </ul>
              <p className="si-side-foot">
                {partnerOrganizationContent.sideFooter.question}
                <a href={contact.mailto(partnerOrganizationContent.sideFooter.linkSubject)}>
                  {partnerOrganizationContent.sideFooter.linkText}
                </a>
              </p>
            </aside>

            <div className="si-main">
              <div className="si-head">
                <h1>{partnerOrganizationContent.main.title}</h1>
                <p>{partnerOrganizationContent.main.subtitle}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="po-user">{partnerOrganizationContent.main.userLabel}</label>
                  <input
                    id="po-user"
                    name="user"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder={partnerOrganizationContent.main.userPlaceholder}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="po-pass">{partnerOrganizationContent.main.passwordLabel}</label>
                  <div className="mb-pass">
                    <input
                      id="po-pass"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder={partnerOrganizationContent.main.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="mb-eye"
                      type="button"
                      aria-pressed={showPassword}
                      aria-controls="po-pass"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="si-forgot">
                  <Link href={partnerOrganizationContent.main.forgotPasswordHref}>
                    {partnerOrganizationContent.main.forgotPasswordText}
                  </Link>
                </div>
                <button className="btn btn-primary si-wide" type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : partnerOrganizationContent.main.loginButtonText}
                </button>
              </form>
              {feedback && (
                <p
                  style={{
                    marginTop: '14px',
                    fontSize: '13.5px',
                    color: feedback.type === 'error' ? '#c0392b' : '#27ae60',
                  }}
                >
                  {feedback.text}
                </p>
              )}
              <p className="si-foot">
                {partnerOrganizationContent.main.troubleText}
                <Link href={partnerOrganizationContent.main.contactHref}>
                  {partnerOrganizationContent.main.contactText}
                </Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default PartnerOrganizationView;
