'use client';

import React from 'react';
import { useSchoolAnthemHandler } from '../../handler';
import { schoolAnthemContent as text } from '../../content';

/** The floating play button by the words, driving the anthem video in the banner. */
export const AnthemPlayer: React.FC<{ videoId: string; sectionId: string }> = ({ videoId, sectionId }) => {
  const { isVisible, isPlaying, isLoading, toggle } = useSchoolAnthemHandler(videoId, sectionId);
  return (
    <div className={`anthem-player${isVisible ? ' show' : ''}${isPlaying ? ' on' : ''}`}>
      <button type="button" className="sing-play" aria-label={isPlaying ? text.pauseAria : text.playAria} aria-pressed={isPlaying} onClick={toggle}>
        <svg className="ic-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
        <svg className="ic-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
          <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
        </svg>
      </button>
      <span className="ap-text">
        <strong>{text.listen}</strong>
        <small aria-live="polite">{isPlaying ? text.playing : isLoading ? text.loading : text.tapToPlay}</small>
      </span>
      <span className="ap-eq" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </div>
  );
};

export default AnthemPlayer;
