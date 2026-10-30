'use client';

import React, { useRef, useState } from 'react';
import type { HomeHangoutContent, HomeHangoutPhoto } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

/** Photo posts take these icons in turn. */
const PHOTO_ICONS = [
  <path key="heart" d="M13 21l-1-1-6.36-6.36a5 5 0 1 1 7.07-7.07L13 7l.29-.43a5 5 0 1 1 7.07 7.07L14 20l-1 1Z" stroke="#fff" strokeWidth="1.4"/>,
  <React.Fragment key="person"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="#fff" strokeWidth="1.4"/></React.Fragment>,
  <path key="sport" d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z" stroke="#fff" strokeWidth="1.4"/>,
  <path key="school" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="#fff" strokeWidth="1.4"/>,
];

const MUTED_ICON = <svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>;
const UNMUTED_ICON = <svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>;

/** A photo post's pictures: swipe through them, or pick one by its dot. One picture shows no dots. */
function PostPhotos({ images }: { images: HomeHangoutPhoto[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (el && el.clientWidth) setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (index: number) => {
    const el = track.current;
    el?.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <>
      <div className="post-slides" ref={track} onScroll={images.length > 1 ? onScroll : undefined}>
        {images.map((photo, i) => (
          <div className="post-slide" key={`${i}-${photo.image}`} aria-hidden={i !== current || undefined}>
            <img className="tile-img" src={photo.image} alt={photo.imageAlt} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="post-dots">
          {images.map((photo, i) => (
            <button
              key={`${i}-${photo.image}`}
              type="button"
              className={`post-dot${i === current ? ' is-active' : ''}`}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              aria-current={i === current || undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * A video post, drawn exactly as before uploads: the play button, mute button and length over the
 * picture. With an uploaded video, the video takes the picture's place and the buttons work.
 */
function PostVideo({ src, still, duration }: { src: string; still?: HomeHangoutPhoto; duration: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.current) video.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {src ? (
        // "#t=0.1" makes browsers that show nothing before playing (iOS Safari) show the first frame.
        <video ref={video} className="tile-img" src={`${src}#t=0.1`} preload="metadata" playsInline muted={isMuted} loop onClick={togglePlay} />
      ) : (
        still && <img className="tile-img" src={still.image} alt={still.imageAlt} loading="lazy" decoding="async" />
      )}
      <div className="play-btn" onClick={togglePlay}><span><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5Z" fill="currentColor"/></svg></span></div>
      <button className="mute-btn" data-muted={isMuted} aria-label={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
        {isMuted ? MUTED_ICON : UNMUTED_ICON}
      </button>
      {duration && <span className="post-duration">{duration}</span>}
    </>
  );
}

/** The intro, with the admin's chosen words in gold. */
function Intro({ intro, highlight }: { intro: string; highlight: string }) {
  const at = highlight ? intro.indexOf(highlight) : -1;
  if (at < 0) return <>{intro}</>;
  return (
    <>
      {intro.slice(0, at)}
      <span style={{ color: "var(--gold)", fontWeight: "600" }}>{highlight}</span>
      {intro.slice(at + highlight.length)}
    </>
  );
}

export const HangoutSection: React.FC<{ content: HomeHangoutContent }> = ({ content }) => {
  // Rendered twice so the carousel can loop without a visible jump; see useHomeHandler.
  const posts = (clone: boolean) => {
    let photoCount = 0;
    return content.posts.map((post, i) => (
      <article
        className="post-card"
        data-type={post.type}
        key={`${clone ? 'clone-' : ''}${i}`}
        {...(clone && { 'data-clone': '', 'aria-hidden': true, inert: true })}
      >
        <div className={`post-media ${toneAt(i)}`}>
          {post.type === 'video' ? (
            <PostVideo src={post.video} still={post.images[0]} duration={post.duration} />
          ) : (
            <>
              <PostPhotos images={post.images} />
              <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none">{PHOTO_ICONS[photoCount++ % PHOTO_ICONS.length]}</svg></div>
            </>
          )}
        </div>
        <div className="post-body">
          {(post.name || post.batch) && (
            <div className="post-header">
              <div className="post-who">
                {post.name && <div className="post-name">{post.name}</div>}
                {post.batch && <div className="post-batch">{post.batch}</div>}
              </div>
            </div>
          )}
          {post.caption && <p className="post-caption-text">{post.caption}</p>}
          {post.time && <div className="post-time">{post.time}</div>}
        </div>
      </article>
    ));
  };

  return (
    <section className="section band-dark" id="hangout">
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
            <h2 style={{ whiteSpace: "nowrap" }}>{content.title}</h2>
            {content.intro && <p style={{ color: "#AFC8B6" }}><Intro intro={content.intro} highlight={content.highlight} /></p>}
          </div>
        </div>

        <div className="post-carousel-wrap">
          <button className="post-nav prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="post-carousel" id="postCarousel">
            {posts(false)}
            {posts(true)}
          </div>

          <button className="post-nav next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HangoutSection;
