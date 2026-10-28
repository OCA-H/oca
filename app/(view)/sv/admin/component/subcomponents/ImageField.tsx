'use client';

import React, { useRef, useState } from 'react';
import { adminContent } from '../../content';
import { AdminIcon } from './AdminIcon';

interface ImageFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
  describedBy?: string;
  invalid?: boolean;
}

/** A preview of the image, an upload button, and the address itself, for images hosted elsewhere. */
export const ImageField: React.FC<ImageFieldProps> = ({ id, value, onChange, onUpload, describedBy, invalid }) => {
  const { image } = adminContent;
  const fileInput = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  /** The address whose preview failed to load, so a corrected one gets a fresh try. */
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!image.types.test(file.type)) return setMessage(image.badType);
    if (file.size > image.maxBytes) return setMessage(image.tooBig);

    setMessage(null);
    setIsUploading(true);
    try {
      onChange(await onUpload(file));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : image.failed);
    } finally {
      setIsUploading(false);
    }
  };

  const showPreview = value && brokenSrc !== value;

  return (
    <div className="ad-image">
      <div className={`ad-image-preview${isUploading ? ' is-uploading' : ''}`} aria-busy={isUploading}>
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={value} src={value} alt="" onError={() => setBrokenSrc(value)} />
        ) : (
          <span className="ad-image-empty">
            <AdminIcon name="image" />
            {value ? 'Cannot show this image' : image.none}
          </span>
        )}
        {isUploading && (
          <span className="ad-image-busy" aria-hidden="true">
            <span className="mp-photo-spin" />
          </span>
        )}
      </div>
      <div className="ad-image-side">
        <button className="mp-photo-btn ad-image-btn" type="button" onClick={() => fileInput.current?.click()} disabled={isUploading}>
          <AdminIcon name="upload" />
          {isUploading ? image.uploading : value ? image.replace : image.upload}
        </button>
        <input ref={fileInput} type="file" accept={image.accept} hidden onChange={handleFile} />
        <input
          id={id}
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /images/…"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          spellCheck={false}
          disabled={isUploading}
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
