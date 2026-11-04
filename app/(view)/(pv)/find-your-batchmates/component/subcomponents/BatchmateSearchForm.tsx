'use client';

import React from 'react';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { findBatchmatesContent as text } from '../../content';
import { useFindBatchmatesHandler } from '../../handler';
import { findBatchmatesHelper } from '../../helper';

/** The directory search: name and batch, with city and profession folded away. */
export const BatchmateSearchForm: React.FC = () => {
  const { query, setField, handleSubmit, isSent, error, isAuthenticated } = useFindBatchmatesHandler();
  const contact = useContact();
  const { form } = text;
  const mailto = `${contact.mailto(text.result.subject)}&body=${encodeURIComponent(
    `Please help me find these Columbans:\n\n${findBatchmatesHelper.queryLines(query)}\n`
  )}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-row">
        <div className="field">
          <label htmlFor="fb-name">{form.name.label}</label>
          <input id="fb-name" type="text" autoComplete="off" placeholder={form.name.placeholder} value={query.name} onChange={(e) => setField('name', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="fb-batch">{form.batch.label}</label>
          <input id="fb-batch" type="text" inputMode="numeric" placeholder={form.batch.placeholder} value={query.batch} onChange={(e) => setField('batch', e.target.value)} />
        </div>
      </div>
      <details className="fy-more">
        <summary>{form.more}</summary>
        <div className="field-row">
          <div className="field">
            <label htmlFor="fb-city">{form.city.label}</label>
            <input id="fb-city" type="text" placeholder={form.city.placeholder} value={query.city} onChange={(e) => setField('city', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="fb-prof">{form.profession.label}</label>
            <input id="fb-prof" type="text" placeholder={form.profession.placeholder} value={query.profession} onChange={(e) => setField('profession', e.target.value)} />
          </div>
        </div>
      </details>
      <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 22 }}>
        {form.submit}
      </button>
      <p className="form-note">{isAuthenticated ? form.noteSignedIn : form.noteSignedOut}</p>
      {error && (
        <p className="mp-hint mp-hint--bad" role="alert">
          {error}
        </p>
      )}
      {isSent && (
        <div className="fy-result" role="status">
          {text.result.lead} <a href={mailto}>{text.result.action}</a>.
        </div>
      )}
    </form>
  );
};

export default BatchmateSearchForm;
