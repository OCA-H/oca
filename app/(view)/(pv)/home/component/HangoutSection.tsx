import React from 'react';
import type { HomeHangoutContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

/** Photo posts take these icons in turn. */
const PHOTO_ICONS = [
  <path key="heart" d="M13 21l-1-1-6.36-6.36a5 5 0 1 1 7.07-7.07L13 7l.29-.43a5 5 0 1 1 7.07 7.07L14 20l-1 1Z" stroke="#fff" strokeWidth="1.4"/>,
  <React.Fragment key="person"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="#fff" strokeWidth="1.4"/></React.Fragment>,
  <path key="sport" d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z" stroke="#fff" strokeWidth="1.4"/>,
  <path key="school" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="#fff" strokeWidth="1.4"/>,
];

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
        key={`${clone ? 'clone-' : ''}${i}-${post.caption}`}
        {...(clone && { 'data-clone': '', 'aria-hidden': true, inert: true })}
      >
        <div className={`post-media ${toneAt(i)}`}>
          <img className="tile-img" src={post.image} alt={post.imageAlt} loading="lazy" decoding="async" />
          {post.type === 'video' ? (
            <>
              <div className="play-btn"><span><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5Z" fill="currentColor"/></svg></span></div>
              <button className="mute-btn" data-muted="true" aria-label="Unmute"><svg viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg></button>
              {post.duration && <span className="post-duration">{post.duration}</span>}
            </>
          ) : (
            <div className="tile-icon"><svg viewBox="0 0 24 24" fill="none">{PHOTO_ICONS[photoCount++ % PHOTO_ICONS.length]}</svg></div>
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
          <p className="post-caption-text">{post.caption}</p>
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
