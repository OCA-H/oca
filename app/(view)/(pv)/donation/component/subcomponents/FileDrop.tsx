'use client';

import React, { useRef, useState } from 'react';

interface FileDropProps {
  id: string;
  name: string;
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

// Matches the server's rules for tax documents (contributionService: documentRules).
const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';
const TYPES = /^(image\/(jpeg|png|webp)|application\/pdf)$/i;
const MAX_BYTES = 4 * 1024 * 1024;

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/**
 * A compact file picker: a "Choose file" chip with the chosen file's name and size beside it, to
 * change or remove; a file can also be dropped onto it. Checked here first, to the server's rules.
 */
export const FileDrop: React.FC<FileDropProps> = ({ id, name, label, file, onChange, disabled }) => {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const errorId = `${id}-error`;

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    if (!TYPES.test(picked.type)) return setError('Please choose a JPG, PNG, WebP or PDF file.');
    if (picked.size > MAX_BYTES) return setError(`That file is ${formatSize(picked.size)}. Please choose one under 4 MB.`);
    setError(null);
    onChange(picked);
  };

  const remove = () => {
    setError(null);
    onChange(null);
    if (input.current) input.current.value = '';
  };

  return (
    <div className="field cf-file">
      <label htmlFor={id}>{label}</label>
      <input
        ref={input}
        id={id}
        name={name}
        type="file"
        accept={ACCEPT}
        className="cf-file-input"
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {/* The same height as the inputs beside it: a "Choose file" chip, then the file's name or a prompt. */}
      <div
        className={`cf-file-box${file ? ' has-file' : ''}${isDragging ? ' is-dragging' : ''}${error ? ' is-bad' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) pick(e.dataTransfer.files[0]);
        }}
      >
        <button type="button" className="cf-file-chip" onClick={() => input.current?.click()} disabled={disabled} aria-describedby={error ? errorId : undefined}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 16V4m-4.5 4.5L12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {file ? 'Change' : 'Choose file'}
        </button>
        {file ? (
          <>
            <span className="cf-file-name" title={file.name}>
              {file.name}
              <small>{formatSize(file.size)}</small>
            </span>
            <button type="button" className="cf-file-x" onClick={remove} disabled={disabled} aria-label={`Remove ${file.name}`} title="Remove">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        ) : (
          <span className="cf-file-empty">No file chosen</span>
        )}
      </div>

      {error && (
        <p className="ms-error" role="alert" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FileDrop;
