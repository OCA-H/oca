'use client';

import React from 'react';
import Link from 'next/link';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { memberSignInContent, forgotPasswordContent, resetPasswordContent } from '../content';
import { useResetPasswordHandler } from '../handler';
import { PasswordRecoverySide, PasswordRecoveryNotice } from './subcomponents';

export const ResetPasswordView: React.FC = () => {
  const content = resetPasswordContent;
  const contact = useContact();
  const {
    stage,
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    toggleShowPassword,
    isLoading,
    error,
    handleSubmit,
  } = useResetPasswordHandler();

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
              {stage === 'done' && (
                <PasswordRecoveryNotice tone="success" icon="success" title={content.done.title} lead={content.done.lead}>
                  <div className="si-notice-actions">
                    <Link className="btn btn-primary" href={content.done.signInHref}>
                      {content.done.signInText}
                    </Link>
                  </div>
                </PasswordRecoveryNotice>
              )}

              {stage === 'invalid' && (
                <PasswordRecoveryNotice tone="warning" icon="warning" title={content.invalid.title} lead={content.invalid.lead}>
                  <div className="si-notice-actions">
                    <Link className="btn btn-primary" href={content.invalid.retryHref}>
                      {content.invalid.retryText}
                    </Link>
                  </div>
                </PasswordRecoveryNotice>
              )}

              {stage === 'form' && (
                <>
                  <div className="si-head">
                    <h1>{content.form.title}</h1>
                    <p>{content.form.subtitle}</p>
                  </div>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                      <label htmlFor="rp-pass">{content.form.passwordLabel}</label>
                      <div className="mb-pass">
                        <input
                          id="rp-pass"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          autoFocus
                          placeholder={content.form.passwordPlaceholder}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          aria-describedby={error ? 'rp-error' : undefined}
                        />
                        <button
                          className="mb-eye"
                          type="button"
                          aria-pressed={showPassword}
                          aria-controls="rp-pass rp-confirm"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="rp-confirm">{content.form.confirmLabel}</label>
                      <input
                        id="rp-confirm"
                        name="confirm"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        placeholder={content.form.confirmPlaceholder}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        aria-describedby={error ? 'rp-error' : undefined}
                      />
                    </div>
                    {error && (
                      <p className="si-alert" id="rp-error" role="alert">
                        {error}
                      </p>
                    )}
                    <button className="btn btn-primary si-wide" type="submit" disabled={isLoading}>
                      {isLoading ? content.form.submittingText : content.form.submitText}
                    </button>
                  </form>
                </>
              )}

              <p className="si-foot">
                {forgotPasswordContent.trouble.text}
                <a href={contact.mailto(forgotPasswordContent.trouble.linkSubject)}>{forgotPasswordContent.trouble.linkText}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPasswordView;
