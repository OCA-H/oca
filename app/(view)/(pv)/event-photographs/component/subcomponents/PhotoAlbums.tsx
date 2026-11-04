'use client';

import React from 'react';
import type { HomeGalleryAlbum } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { eventPhotographsContent as text } from '../../content';
import { ALL_ALBUMS, useEventPhotographsHandler } from '../../handler';
import { eventPhotographsHelper } from '../../helper';

/** The albums with their photos, the chips to show one album, and the photo viewer. */
export const PhotoAlbums: React.FC<{ albums: HomeGalleryAlbum[] }> = ({ albums }) => {
  const { ids, filter, chooseFilter, isShown, viewer, open, close, step } = useEventPhotographsHandler(albums);
  return (
    <>
      {albums.length > 1 && (
        <div className="ph-chips" role="group" aria-label={text.filterAria}>
          <button type="button" className={`ph-chip${filter === ALL_ALBUMS ? ' active' : ''}`} aria-pressed={filter === ALL_ALBUMS} onClick={() => chooseFilter(ALL_ALBUMS)}>
            {text.allAlbums}
          </button>
          {albums.map((album, i) => (
            <button type="button" key={ids[i]} className={`ph-chip${filter === ids[i] ? ' active' : ''}`} aria-pressed={filter === ids[i]} onClick={() => chooseFilter(ids[i])}>
              {album.name}
            </button>
          ))}
        </div>
      )}

      {albums.map((album, albumIndex) => (
        <div className="ph-album" data-album-id={ids[albumIndex]} key={ids[albumIndex]} hidden={!isShown(albumIndex)}>
          <div className="ph-album-head">
            <div>
              {album.time && <span className="eyebrow">{album.time}</span>}
              <h2>{album.name}</h2>
              {album.desc && <p>{album.desc}</p>}
            </div>
            <span className="ph-count">{eventPhotographsHelper.photoCount(album.photos.length)}</span>
          </div>
          <div className="ph-grid">
            {album.photos.map((photo, photoIndex) => (
              <button type="button" className="ph-item" key={`${photoIndex}-${photo.image}`} onClick={() => open(albumIndex, photoIndex)}>
                <span className="ph-img">
                  <img src={photo.image} alt={photo.caption} loading="lazy" decoding="async" />
                </span>
                <span className="cap">{photo.caption}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div
        className={`lb${viewer ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={text.viewer.label}
        aria-hidden={!viewer}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <button className="x" type="button" aria-label={text.viewer.close} onClick={close}>
          &#10005;
        </button>
        <button className="prev" type="button" aria-label={text.viewer.previous} onClick={() => step(-1)}>
          &#8592;
        </button>
        <figure>
          {viewer && <img src={viewer.photo.image} alt={viewer.photo.caption} />}
          {viewer && (
            <figcaption>
              {viewer.photo.caption}
              <small>{eventPhotographsHelper.position(viewer.photo, viewer.index, viewer.total)}</small>
            </figcaption>
          )}
        </figure>
        <button className="next" type="button" aria-label={text.viewer.next} onClick={() => step(1)}>
          &#8594;
        </button>
      </div>
    </>
  );
};

export default PhotoAlbums;
