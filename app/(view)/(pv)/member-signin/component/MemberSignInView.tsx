'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memberSignInContent } from '../content';
import { useMemberSignInHandler } from '../handler';
import { useAuth } from '@/app/(view)/common/helper/useAuth';

export const MemberSignInView: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
    fillDemoCredentials,
  } = useMemberSignInHandler();

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
          <Link href={memberSignInContent.breadcrumb.homeHref}>{memberSignInContent.breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <span>{memberSignInContent.breadcrumb.sectionText}</span>
          <span className="sep">/</span>
          <span>{memberSignInContent.breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="content-section si-section">
        <div className="wrap">
          <div className="si-split">

            <aside className="si-side">
              <div className="si-crest" role="img" aria-label="Old Columbans Association crest" />
              <span className="eyebrow">{memberSignInContent.eyebrow}</span>
              <h2>{memberSignInContent.title}</h2>
              <ul className="si-list">
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <b>{memberSignInContent.benefits[0].title}</b>
                    <span className="d">{memberSignInContent.benefits[0].desc}</span>
                  </div>
                </li>
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M2.5 20c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5M17 7.5a3 3 0 0 1 0 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <div>
                    <b>{memberSignInContent.benefits[1].title}</b>
                    <span className="d">{memberSignInContent.benefits[1].desc}</span>
                  </div>
                </li>
                <li>
                  <span className="si-ico">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div>
                    <b>{memberSignInContent.benefits[2].title}</b>
                    <span className="d">{memberSignInContent.benefits[2].desc}</span>
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
                    <b>{memberSignInContent.benefits[3].title}</b>
                    <span className="d">{memberSignInContent.benefits[3].desc}</span>
                  </div>
                </li>
              </ul>
              <p className="si-side-foot">
                {memberSignInContent.sideFooter.question}
                <a href={memberSignInContent.sideFooter.linkHref}>{memberSignInContent.sideFooter.linkText}</a>
              </p>
            </aside>

            <div className="si-main">
              <div className="si-head">
                <h1>{memberSignInContent.main.title}</h1>
                <p>{memberSignInContent.main.subtitle}</p>
              </div>

              <div
                style={{
                  background: 'rgba(212, 168, 67, 0.1)',
                  border: '1px solid rgba(212, 168, 67, 0.35)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1a2744' }}>Quick Demo Login:</span>
                  <span style={{ fontSize: '11px', color: '#666' }}>Click to fill</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('member')}
                    style={{
                      background: '#fff',
                      border: '1px solid #d4a843',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      color: '#1a2744',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Columban 1994 (Life Member)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('columban')}
                    style={{
                      background: '#fff',
                      border: '1px solid #d4a843',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      color: '#1a2744',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Columban 2005
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    style={{
                      background: '#fff',
                      border: '1px solid #d4a843',
                      borderRadius: '4px',
                      padding: '4px 9px',
                      fontSize: '12px',
                      color: '#1a2744',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    OCA Admin
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="si-user">{memberSignInContent.main.userLabel}</label>
                  <input
                    id="si-user"
                    name="user"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder={memberSignInContent.main.userPlaceholder}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="si-pass">{memberSignInContent.main.passwordLabel}</label>
                  <div className="mb-pass">
                    <input
                      id="si-pass"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder={memberSignInContent.main.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="mb-eye"
                      type="button"
                      aria-pressed={showPassword}
                      aria-controls="si-pass"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="si-forgot">
                  <Link href={memberSignInContent.main.forgotPasswordHref}>
                    {memberSignInContent.main.forgotPasswordText}
                  </Link>
                </div>
                <button className="btn btn-primary si-wide" type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : memberSignInContent.main.loginButtonText}
                </button>
                <div className="si-or">
                  <span>{memberSignInContent.main.orText}</span>
                </div>
                <Link className="btn btn-gold si-wide" href={memberSignInContent.main.registerHref}>
                  {memberSignInContent.main.registerButtonText}
                </Link>
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
                {memberSignInContent.main.troubleText}
                <Link href={memberSignInContent.main.contactHref}>{memberSignInContent.main.contactText}</Link>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default MemberSignInView;
