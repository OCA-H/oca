'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memberSignInContent } from '../content';
import { signInTarget, useMemberSignInHandler } from '../handler';
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
    welcomeName,
    handleSubmit,
  } = useMemberSignInHandler();

  // Already signed in when this page opened (e.g. Back from the members area): go on to the
  // members area. The proxy does this for a fresh load; this covers pages restored in the browser.
  // A sign-in made here navigates itself once its welcome has shown.
  const isAlreadySignedIn = isAuthenticated && !welcomeName;
  useEffect(() => {
    if (isAlreadySignedIn) router.replace(signInTarget());
  }, [isAlreadySignedIn, router]);

  const isHandingOff = Boolean(welcomeName) || isAlreadySignedIn;

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

            <div className={`si-main${isHandingOff ? ' is-handing-off' : ''}`}>
              {isHandingOff && (
                <div className="si-handoff" role="status" aria-live="polite">
                  <span className="si-handoff-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2>{welcomeName ? `Welcome back, ${welcomeName}` : 'You are signed in'}</h2>
                  <p>Opening your members area…</p>
                  <span className="si-handoff-bar" aria-hidden="true" />
                </div>
              )}
              <div className="si-head">
                <h1>{memberSignInContent.main.title}</h1>
                <p>{memberSignInContent.main.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} aria-hidden={isHandingOff || undefined} inert={isHandingOff || undefined}>
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
                <button className="btn btn-primary si-wide" type="submit" disabled={isLoading || isHandingOff}>
                  {isLoading ? 'Signing in…' : memberSignInContent.main.loginButtonText}
                </button>
                <div className="si-or">
                  <span>{memberSignInContent.main.orText}</span>
                </div>
                <Link className="btn btn-gold si-wide" href={memberSignInContent.main.registerHref}>
                  {memberSignInContent.main.registerButtonText}
                </Link>
              </form>
              {feedback && !isHandingOff && (
                <p
                  role={feedback.type === 'error' ? 'alert' : 'status'}
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
