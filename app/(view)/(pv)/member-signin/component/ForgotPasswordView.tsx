'use client';

import React from 'react';
import Link from 'next/link';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { memberSignInContent, forgotPasswordContent } from '../content';
import { useForgotPasswordHandler } from '../handler';
import { PasswordRecoverySide, PasswordRecoveryNotice } from './subcomponents';

export const ForgotPasswordView: React.FC = () => {
  const content = forgotPasswordContent;
  const contact = useContact();
  const { identifier, setIdentifier, isLoading, error, sentTo, handleSubmit, tryAgain } = useForgotPasswordHandler();

  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={memberSignInContent.breadcrumb.homeHref}>{memberSignInContent.breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <Link href={content.breadcrumb.signInHref}>{content.breadcrumb.signInText}</Link>
          <span className="sep">/</span>
          <span>{content.breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="content-section si-section">
        <div className="wrap">
          <div className="si-split">
            <PasswordRecoverySide {...content.side} />

            <div className="si-main">
              {sentTo ? (
                <PasswordRecoveryNotice
                  tone="success"
                  icon="mail"
                  title={content.sent.title}
                  lead={
                    <>
                      {content.sent.lead.split('{identifier}')[0]}
                      <b>{sentTo}</b>
                      {content.sent.lead.split('{identifier}')[1]}
                    </>
                  }
                >
                  <ul className="cf-terms si-notice-tips">
                    {content.sent.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="si-notice-actions">
                    <Link className="btn btn-primary" href={content.sent.signInHref}>
                      {content.sent.signInText}
                    </Link>
                    <button className="btn btn-secondary" type="button" onClick={tryAgain}>
                      {content.sent.retryText}
                    </button>
                  </div>
                </PasswordRecoveryNotice>
              ) : (
                <>
                  <div className="si-head">
                    <h1>{content.form.title}</h1>
                    <p>{content.form.subtitle}</p>
                  </div>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                      <label htmlFor="fp-identifier">{content.form.label}</label>
                      <input
                        id="fp-identifier"
                        name="identifier"
                        type="text"
                        required
                        autoComplete="username"
                        autoFocus
                        placeholder={content.form.placeholder}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'fp-error' : undefined}
                      />
                    </div>
                    {error && (
                      <p className="si-alert" id="fp-error" role="alert">
                        {error}
                      </p>
                    )}
                    <button className="btn btn-primary si-wide" type="submit" disabled={isLoading}>
                      {isLoading ? content.form.submittingText : content.form.submitText}
                    </button>
                  </form>
                  <p className="si-back">
                    <Link href={content.form.backHref}>{content.form.backText}</Link>
                  </p>
                </>
              )}
              <p className="si-foot">
                {content.trouble.text}
                <a href={contact.mailto(content.trouble.linkSubject)}>{content.trouble.linkText}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPasswordView;
