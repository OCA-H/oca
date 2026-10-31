'use client';

import React, { useRef, useState } from 'react';
import { adminContent } from '../../content';
import { AdminIcon } from './AdminIcon';

interface ImageFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Holds the chosen file until the section is saved; the address to show it by comes back. */
  onChoose: (file: File) => string;
  describedBy?: string;
  invalid?: boolean;
}

/**
 * A preview of the image, an upload button, and the address itself, for images hosted elsewhere.
 * A chosen image is only previewed here; it is uploaded when the section is saved.
 */
export const ImageField: React.FC<ImageFieldProps> = ({ id, value, onChange, onChoose, describedBy, invalid }) => {
  const { image } = adminContent;
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  /** The address whose preview failed to load, so a corrected one gets a fresh try. */
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!image.types.test(file.type)) return setMessage(image.badType);
    if (file.size > image.maxBytes) return setMessage(image.tooBig);

    setMessage(null);
    onChange(onChoose(file));
  };

  const showPreview = value && brokenSrc !== value;
  /** A chosen file not saved yet, shown by an object URL: no address to edit until it is uploaded. */
  const isPending = value.startsWith('blob:');

  return (
    <div className="ad-image">
      <div className="ad-image-preview">
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={value} src={value} alt="" onError={() => setBrokenSrc(value)} />
        ) : (
          <span className="ad-image-empty">
            <AdminIcon name="image" />
            {value ? 'Cannot show this image' : image.none}
          </span>
        )}
      </div>
      <div className="ad-image-side">
        <button className="mp-photo-btn ad-image-btn" type="button" onClick={() => fileInput.current?.click()}>
          <AdminIcon name="upload" />
          {value ? image.replace : image.upload}
        </button>
        <input ref={fileInput} type="file" accept={image.accept} hidden onChange={handleFile} />
        <input
          id={id}
          type="text"
          inputMode="url"
          value={isPending ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isPending ? image.pending : 'https://… or /images/…'}
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

export default ImageField;
