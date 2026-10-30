'use client';

import React from 'react';
import { CustomDropdown } from '@/app/(view)/common/component/CustomDropdown';
import type { AdminIconName } from '../../content';
import type { FieldSpec, MediaKind } from '../../services';
import { AdminIcon } from './AdminIcon';
import { ImageField } from './ImageField';
import { VideoField } from './VideoField';

interface FieldInputProps {
  field: FieldSpec;
  /** Unique on the page; also the key of this field's error from the API. */
  name: string;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  onUpload: (file: File, kind?: MediaKind) => Promise<string>;
  /** Video fields: told how long a newly uploaded video runs, e.g. "2:14". */
  onVideoLength?: (length: string) => void;
  error?: string;
  /** Spans both columns of the form grid; text areas and images always do. */
  wide?: boolean;
}

/** One field of a section, drawn from its spec. */
export const FieldInput: React.FC<FieldInputProps> = ({ field, name, value, onChange, onUpload, onVideoLength, error, wide: forceWide }) => {
  const id = `ad-${name.replace(/\./g, '-')}`;
  const hintId = `${id}-hint`;
  const text = value === undefined ? '' : String(value);
  const counts = field.max && (field.type === 'text' || field.type === 'textarea');
  const isEmail = field.type === 'email' || field.type === 'emails';
  const wide = forceWide || field.type === 'textarea' || field.type === 'image' || field.type === 'video' || field.type === 'emails';
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
      input = field.segmented ? (
        <div className="ad-segmented" role="radiogroup" id={id} aria-labelledby={`${id}-label`} aria-describedby={described}>
          {(field.options ?? []).map((option) => {
            const isOn = text === option.value;
            return (
              <button key={option.value} type="button" role="radio" aria-checked={isOn} className={`ad-seg${isOn ? ' is-on' : ''}`} onClick={() => onChange(option.value)}>
                {option.icon && <AdminIcon name={option.icon as AdminIconName} />}
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <CustomDropdown id={id} name={name} value={text} onChange={onChange} options={field.options ?? []} ariaLabel={field.label} />
      );
      break;
    case 'image':
      input = <ImageField id={id} value={text} onChange={onChange} onUpload={onUpload} describedBy={described} invalid={Boolean(error)} />;
      break;
    case 'video':
      input = (
        <VideoField id={id} value={text} onChange={onChange} onUpload={onUpload} onLength={onVideoLength} describedBy={described} invalid={Boolean(error)} />
      );
      break;
    default:
      input = (
        <input
          {...common}
          type="text"
          inputMode={field.type === 'link' ? 'url' : isEmail ? 'email' : undefined}
          spellCheck={field.type === 'link' || isEmail ? false : undefined}
          autoCapitalize={isEmail ? 'none' : undefined}
          value={text}
          maxLength={field.type === 'link' ? 500 : field.max}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? (field.type === 'link' ? '/page or https://…' : undefined)}
        />
      );
  }

  return (
    <div className={`field ad-field${wide ? ' ad-field--wide' : field.size === 'third' ? ' ad-field--third' : ''}`}>
      <label htmlFor={id} id={`${id}-label`} className="ad-label">
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
