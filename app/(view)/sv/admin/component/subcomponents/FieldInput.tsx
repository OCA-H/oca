'use client';

import React from 'react';
import { CustomDropdown } from '@/app/(view)/common/component/CustomDropdown';
import type { FieldSpec } from '../../services';
import { ImageField } from './ImageField';

interface FieldInputProps {
  field: FieldSpec;
  /** Unique on the page; also the key of this field's error from the API. */
  name: string;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  onUpload: (file: File) => Promise<string>;
  error?: string;
  /** Spans both columns of the form grid; text areas and images always do. */
  wide?: boolean;
}

/** One field of a section, drawn from its spec. */
export const FieldInput: React.FC<FieldInputProps> = ({ field, name, value, onChange, onUpload, error, wide: forceWide }) => {
  const id = `ad-${name.replace(/\./g, '-')}`;
  const hintId = `${id}-hint`;
  const text = value === undefined ? '' : String(value);
  const counts = field.max && (field.type === 'text' || field.type === 'textarea');
  const wide = forceWide || field.type === 'textarea' || field.type === 'image' || field.type === 'emails';
  const described = error || field.hint ? hintId : undefined;
  const common = { id, name, 'aria-describedby': described, 'aria-invalid': Boolean(error) || undefined };

  let input: React.ReactNode;
  switch (field.type) {
    case 'textarea':
      input = <textarea {...common} value={text} maxLength={field.max} rows={field.max && field.max > 500 ? 6 : 3} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
      break;
    case 'number':
      input = (
        <input
          {...common}
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
          step={field.integer ? 1 : undefined}
          value={text}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );
      break;
    case 'select':
      input = (
        <CustomDropdown id={id} name={name} value={text} onChange={onChange} options={field.options ?? []} ariaLabel={field.label} />
      );
      break;
    case 'image':
      input = <ImageField id={id} value={text} onChange={onChange} onUpload={onUpload} describedBy={described} invalid={Boolean(error)} />;
      break;
    default:
      input = (
        <input
          {...common}
          type="text"
          inputMode={field.type === 'link' ? 'url' : field.type === 'emails' ? 'email' : undefined}
          spellCheck={field.type === 'link' || field.type === 'emails' ? false : undefined}
          autoCapitalize={field.type === 'emails' ? 'none' : undefined}
          value={text}
          maxLength={field.type === 'link' ? 500 : field.max}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? (field.type === 'link' ? '/page or https://…' : undefined)}
        />
      );
  }

  return (
    <div className={`field ad-field${wide ? ' ad-field--wide' : ''}`}>
      <label htmlFor={id} className="ad-label">
        <span>
          {field.label}
          {field.required && ' *'}
        </span>
        {counts && (
          <span className={`ad-count${text.length > field.max! * 0.9 ? ' is-near' : ''}`}>
            {text.length}/{field.max}
          </span>
        )}
      </label>
      {input}
      {error ? (
        <p className="mp-hint mp-hint--bad" id={hintId}>
          {error}
        </p>
      ) : (
        field.hint && (
          <p className="mp-hint" id={hintId}>
            {field.hint}
          </p>
        )
      )}
    </div>
  );
};

export default FieldInput;
