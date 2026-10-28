'use client';

import React from 'react';
import { profileContent } from '../../content';
import { useSuggestionForm } from '../../handler';
import { FieldError, PanelHead, PanelSuccess } from './PanelHead';

export const SuggestionPanel: React.FC<{ hidden: boolean; onBack: () => void }> = ({ hidden, onBack }) => {
  const { suggest } = profileContent;
  const { subject, setSubject, message, setMessage, fieldErrors, error, isSending, isSent, handleSubmit, clear, sendAnother } =
    useSuggestionForm();

  return (
    <section className="mp-panel" id="mp-suggest" aria-labelledby="mp-t-suggest" hidden={hidden}>
      <PanelHead panel="suggest" title={suggest.title} lead={suggest.lead} onBack={onBack} />
      <PanelSuccess id="mp-suggest-ok" show={isSent}>
        <b>{suggest.success}</b>{' '}
        <a className="mp-textlink" href="#" onClick={sendAnother}>
          {suggest.again}
        </a>
      </PanelSuccess>
      {error && (
        <p className="ms-error" role="alert">
          {error}
        </p>
      )}

      <form className="cf-form mp-form" id="mp-suggest-form" hidden={isSent} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="mps-subject">Subject *</label>
          <input
            id="mps-subject"
            name="subject"
            type="text"
            required
            placeholder="What is this about?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <FieldError message={fieldErrors.subject} />
        </div>
        <div className="field">
          <label htmlFor="mps-msg">Your suggestion *</label>
          <textarea
            id="mps-msg"
            name="message"
            required
            rows={6}
            placeholder="Tell us what we could do better, or what you would like to see."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <FieldError message={fieldErrors.message} />
        </div>
        <div className="mp-actions">
          <button className="btn btn-primary" type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send suggestion'}
          </button>
          <button className="cf-reset" type="button" onClick={clear}>
            Clear
          </button>
        </div>
      </form>
    </section>
  );
};

export default SuggestionPanel;
