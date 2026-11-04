'use client';

import React, { useRef, useState } from 'react';
import { adminContent } from '../../content';
import type { FileKindName, MediaKind } from '../../services';
import { AdminIcon } from './AdminIcon';

interface FileFieldProps {
  id: string;
  value: string;
  /** What may be uploaded: a PDF, or an MP3 recording. */
  kind: FileKindName;
  onChange: (value: string) => void;
  /** Holds the chosen file until the section is saved; the address to show it by comes back. */
  onChoose: (file: File, kind?: MediaKind) => string;
  describedBy?: string;
  invalid?: boolean;
}

/** "…/uploads/2022/10/OCA_byLaw.pdf" → "OCA_byLaw.pdf"; an uploaded file's random name reads as "Uploaded PDF". */
const fileName = (value: string, kindLabel: string) => {
  const last = decodeURIComponent(value.split(/[?#]/)[0].split('/').pop() ?? '');
  return /^[0-9a-f]{24}\.[a-z0-9]+$/.test(last) ? `Uploaded ${kindLabel}` : last || value;
};

/**
 * A document or recording: the file it holds (with a link to open it), an upload button, and the
 * address itself, for a file already online elsewhere. A chosen file is uploaded when the section is saved.
 */
export const FileField: React.FC<FileFieldProps> = ({ id, value, kind, onChange, onChoose, describedBy, invalid }) => {
  const text = adminContent.file[kind];
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  /** The name of the file chosen but not uploaded yet, which its object URL does not tell. */
  const [pendingName, setPendingName] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!text.types.test(file.type) && !text.extensions.test(file.name)) return setMessage(text.badType);
    if (file.size > text.maxBytes) return setMessage(text.tooBig);

    setMessage(null);
    setPendingName(file.name);
    onChange(onChoose(file, kind));
  };

  const isPending = value.startsWith('blob:');

  return (
    <div className={`ad-image ad-file${invalid ? ' is-invalid' : ''}`}>
      <div className="ad-image-preview ad-file-preview">
        {value ? (
          <a className="ad-file-name" href={value} target="_blank" rel="noopener noreferrer">
            <AdminIcon name="page" />
            <span>{isPending ? pendingName ?? text.label : fileName(value, text.label)}</span>
            <AdminIcon name="ext" />
          </a>
        ) : (
          <span className="ad-image-empty">
            <AdminIcon name="page" />
            {text.none}
          </span>
        )}
      </div>
      <div className="ad-image-side">
        <button className="mp-photo-btn ad-image-btn" type="button" onClick={() => fileInput.current?.click()}>
          <AdminIcon name="upload" />
          {value ? text.replace : text.upload}
        </button>
        <input ref={fileInput} type="file" accept={text.accept} hidden onChange={handleFile} />
        <input
          id={id}
          type="text"
          inputMode="url"
          value={isPending ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isPending ? text.pending : 'https://… or /…'}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          spellCheck={false}
        />
        {message && (
          <p className="mp-hint mp-hint--bad" role="alert">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileField;
