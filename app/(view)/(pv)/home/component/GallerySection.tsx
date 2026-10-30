'use client';

import React from 'react';
import type { HomeGalleryContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { useGalleryHandler } from '../handler';
import { galleryTone } from '../content';

export const GallerySection: React.FC<{ content: HomeGalleryContent }> = ({ content }) => {
  const {
    albums,
    selectedAlbumIdx,
    selectedPhotoIdx,
    currentAlbum,
    currentPhoto,
    setIsHovered,
    selectAlbum,
    nextPhoto,
    prevPhoto,
  } = useGalleryHandler(content.albums);

  if (!currentAlbum) return null;

  return (
    <section className="section tint-gold" id="gallery">
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
            <h2>{content.title}</h2>
            {content.intro && <p>{content.intro}</p>}
          </div>
        </div>
    
        <div 
          className="media-viewer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="media-stage">
            <div className={`photo-tile ${galleryTone(selectedAlbumIdx)}`} id="stageTile">
              {currentPhoto.image && (
                <img
                  className="tile-img"
                  id="stageImg"
                  src={currentPhoto.image}
                  alt={currentPhoto.caption}
                  decoding="async"
                />
              )}
              <div className="stage-counter" id="stageCounter">
                {selectedPhotoIdx + 1} / {currentAlbum.photos.length}
              </div>
              <div className="tile-caption">
                <div className="t" id="stageCaption">{currentPhoto.caption}</div>
                <div className="s" id="stageSub">{[currentAlbum.name, currentAlbum.time].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            {/* Siblings of the tile so clicks here don't open the lightbox. */}
            <button type="button" className="stage-arrow prev" aria-label="Previous photo" onClick={prevPhoto}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button type="button" className="stage-arrow next" aria-label="Next photo" onClick={nextPhoto}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="album-tabs" id="albumTabs">
            {albums.map((album, idx) => {
              const isActive = idx === selectedAlbumIdx;
              return (
                <div
                  key={`${idx}-${album.name}`}
                  className={`album-tab ${isActive ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectAlbum(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectAlbum(idx);
                    }
                  }}
                >
                  <div className="album-tab-top">
                    <span className="album-tab-name">{album.name}</span>
                    <span className="album-tab-time">{album.time}</span>
                  </div>
                  <div className="album-tab-meta">
                    {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                  </div>
                  <div className="album-progress">
                    <div 
                      className="album-progress-fill" 
                      style={{ 
                        width: isActive ? `${((selectedPhotoIdx + 1) / album.photos.length) * 100}%` : '0%',
                        transition: isActive ? 'width 3.2s linear' : 'none'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

