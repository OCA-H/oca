'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { useContactForm } from '../handler/useContactForm';

/** A field's error message from the API, under its input. */
const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="mp-hint mp-hint--bad">{message}</p> : null;

export const ContactSection: React.FC = () => {
  const contact = useContact();
  const { form, setField, fieldErrors, error, sentMessage, isSending, handleSubmit, sendAnother } = useContactForm();
  return (
    <section className="section tint-teal" id="contact">
      <div className="wrap">
        <div className="contact-layout">
          <div className="contact-info-col">
            <div className="contact-intro">
              <span className="eyebrow">Get in touch</span>
              <h2>We&rsquo;d love to hear from you</h2>
              <p>Questions about membership, an event, or just want to say hello — write to the Secretariat and we&rsquo;ll get back to you.</p>
            </div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Call</div>{contact.phone}</div></div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4Zm0 0 8 9 8-9" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Email</div>{contact.email}</div></div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-7.4 8-13a8 8 0 1 0-16 0c0 5.6 8 13 8 13ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Address</div>{contact.address}</div></div>
            <div className="contact-cta">
              <h4>Ready to reconnect?</h4>
              <p>Become a lifetime member and stay part of the Columban family for good.</p>
              <Link className="btn btn-primary btn-sm" href={ROUTES.MEMBERSHIP}>Get Lifetime Membership</Link>
            </div>
          </div>
          <form className="contact-form-panel" onSubmit={handleSubmit} noValidate>
            <div className="mp-ok" id="contact-ok" role="status" hidden={!sentMessage}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <p>
                <b>{sentMessage}</b>{' '}
                <a href="#contact" onClick={sendAnother}>Send another message</a>
              </p>
            </div>
            {error && (
              <p className="ms-error" role="alert">
                {error}
              </p>
            )}
            <div hidden={Boolean(sentMessage)}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="ct-name">Full Name *</label>
                  <input id="ct-name" type="text" required autoComplete="name" maxLength={120} placeholder="Your name" value={form.name} onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(fieldErrors.name) || undefined} />
                  <FieldError message={fieldErrors.name} />
                </div>
                <div className="field">
                  <label htmlFor="ct-batch">Batch / Year</label>
                  <input id="ct-batch" type="text" maxLength={20} placeholder="e.g. 1995" value={form.batch} onChange={(e) => setField('batch', e.target.value)} />
                  <FieldError message={fieldErrors.batch} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="ct-email">Email *</label>
                  <input id="ct-email" type="email" required autoComplete="email" maxLength={255} placeholder="you@example.com" value={form.email} onChange={(e) => setField('email', e.target.value)} aria-invalid={Boolean(fieldErrors.email) || undefined} />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div className="field">
                  <label htmlFor="ct-phone">Phone</label>
                  <input id="ct-phone" type="tel" autoComplete="tel" maxLength={20} placeholder="+91" value={form.phone} onChange={(e) => setField('phone', e.target.value)} aria-invalid={Boolean(fieldErrors.phone) || undefined} />
                  <FieldError message={fieldErrors.phone} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="ct-subject">Subject</label>
                <input id="ct-subject" type="text" maxLength={150} placeholder="What is this about?" value={form.subject} onChange={(e) => setField('subject', e.target.value)} />
                <FieldError message={fieldErrors.subject} />
              </div>
              <div className="field">
                <label htmlFor="ct-message">Message *</label>
                <textarea id="ct-message" required maxLength={3000} placeholder="Write your message here…" value={form.message} onChange={(e) => setField('message', e.target.value)} aria-invalid={Boolean(fieldErrors.message) || undefined}></textarea>
                <FieldError message={fieldErrors.message} />
              </div>
              {/* Hidden from people: only bots fill it in. */}
              <div style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                <label htmlFor="ct-website">Website</label>
                <input id="ct-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField('website', e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={isSending}>{isSending ? 'Sending…' : 'Send Message'}</button>
              <p className="form-note">We&rsquo;ll email you a copy of your message.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
