'use client';

import React from 'react';
import { useGalleryHandler } from '../handler';

export const GallerySection: React.FC = () => {
  const {
    galleryAlbums,
    selectedAlbumIdx,
    selectedPhotoIdx,
    currentAlbum,
    currentPhoto,
    setIsHovered,
    selectAlbum,
  } = useGalleryHandler();

  return (
    <section className="section tint-gold" id="gallery">
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            <span className="eyebrow">Our Gallery</span>
            <h2>Moments from the OCA community</h2>
            <p>Browse by album — the story keeps playing, or jump straight to the one you want.</p>
          </div>
          <a className="btn btn-ghost btn-sm" href="https://www.oldcolumban.net/events-photographs/">View all photographs →</a>
        </div>
    
        <div 
          className="media-viewer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="media-stage">
            <div className={`photo-tile ${currentAlbum.tone}`} id="stageTile">
              <img 
                className="tile-img" 
                id="stageImg" 
                src={currentPhoto.src} 
                alt={currentPhoto.cap} 
                decoding="async" 
              />
              <div 
                className="tile-icon" 
                id="stageIcon" 
                dangerouslySetInnerHTML={{ __html: currentAlbum.icon }} 
              />
              <div className="stage-counter" id="stageCounter">
                {selectedPhotoIdx + 1} / {currentAlbum.photos.length}
              </div>
              <div className="tile-caption">
                <div className="t" id="stageCaption">{currentPhoto.cap}</div>
                <div className="s" id="stageSub">{currentAlbum.name} · {currentAlbum.time}</div>
              </div>
            </div>
          </div>
    
          <div className="album-tabs" id="albumTabs">
            {galleryAlbums.map((album, idx) => {
              const isActive = idx === selectedAlbumIdx;
              const secs = (album.photos.length * 3.2).toFixed(1).replace('.0', '');
              return (
                <div
                  key={album.name}
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
                    {album.photos.length} photos · {secs}s
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

