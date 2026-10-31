'use client';

import React, { useRef, useState } from 'react';
import { adminContent } from '../../content';
import type { MediaKind } from '../../services';
import { AdminIcon } from './AdminIcon';

interface VideoFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Holds the chosen file until the section is saved; the address to show it by comes back. */
  onChoose: (file: File, kind?: MediaKind) => string;
  /** Told how long a newly chosen video runs, e.g. "2:14", so its length can be filled in. */
  onLength?: (length: string) => void;
  describedBy?: string;
  invalid?: boolean;
}

/** 134.2 → "2:14"; an hour or more → "1:02:05". */
const formatLength = (seconds: number) => {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

/** How long a local video file runs, read from its metadata; null if the browser cannot tell. */
const readLength = (file: File) =>
  new Promise<string | null>((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    const done = (length: string | null) => {
      URL.revokeObjectURL(url);
      resolve(length);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => done(Number.isFinite(video.duration) ? formatLength(video.duration) : null);
    video.onerror = () => done(null);
    video.src = url;
  });

/**
 * A preview of the video and an upload button. Videos can only be uploaded, not linked, so the
 * server can hold every one to its size limit. A chosen video is only previewed here; it is
 * uploaded when the section is saved.
 */
export const VideoField: React.FC<VideoFieldProps> = ({ id, value, onChange, onChoose, onLength, describedBy, invalid }) => {
  const { video } = adminContent;
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!video.types.test(file.type)) return setMessage(video.badType);
    if (file.size > video.maxBytes) return setMessage(video.tooBig);

    setMessage(null);
    onChange(onChoose(file, 'video'));
    readLength(file).then((length) => length && onLength?.(length));
  };

  return (
    <div className={`ad-image${invalid ? ' is-invalid' : ''}`}>
      <div className="ad-image-preview">
        {value ? (
          <video key={value} src={value} controls preload="metadata" playsInline />
        ) : (
          <span className="ad-image-empty">
            <AdminIcon name="upload" />
            {video.none}
          </span>
        )}
      </div>
      <div className="ad-image-side">
        <button
          id={id}
          className="mp-photo-btn ad-image-btn"
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-describedby={describedBy}
        >
          <AdminIcon name="upload" />
          {value ? video.replace : video.upload}
        </button>
        {value.startsWith('blob:') && <p className="mp-hint">{video.pending}</p>}
        <input ref={fileInput} type="file" accept={video.accept} hidden onChange={handleFile} />
        {message && (
          <p className="mp-hint mp-hint--bad" role="alert">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoField;
