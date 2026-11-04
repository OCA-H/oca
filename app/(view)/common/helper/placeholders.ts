import React from 'react';

/**
 * Image safety net — matches the template's placeholder SVG art.
 * If a photograph fails to load or is not provided, this engraved placeholder
 * that reads as an archival photograph (not a flat block) takes its place,
 * ensuring no section or hero of the page shows a broken image slot.
 */

const PHOTO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="600" height="420" fill="#0F5E2D"/>' +
  '<g opacity="0.16" fill="#CDE0D2">' +
  '<circle cx="128" cy="150" r="62"/><rect x="40" y="228" width="176" height="150" rx="8"/>' +
  '<circle cx="330" cy="176" r="48"/><rect x="262" y="240" width="136" height="138" rx="8"/>' +
  '<circle cx="492" cy="158" r="56"/><rect x="418" y="230" width="152" height="148" rx="8"/>' +
  '</g>' +
  '<rect x="0.5" y="0.5" width="599" height="419" fill="none" stroke="#C9A227" stroke-width="1" opacity="0.45"/>' +
  '<text x="300" y="402" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="#A8C4B1">From the OCA archive</text>' +
  '</svg>';

const MARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="300" height="300" fill="#F5F8F5"/>' +
  '<path d="M150 62 L214 88 V148 C214 190 186 218 150 232 C114 218 86 190 86 148 V88 Z" fill="none" stroke="#C9A227" stroke-width="2"/>' +
  '<text x="150" y="162" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#0F5E2D">OCA</text>' +
  '</svg>';

export const FALLBACK_HERO_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PHOTO_SVG)}`;
export const FALLBACK_MARK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(MARK_SVG)}`;

export const FALLBACK_HERO_IMAGE_PATH = '/images/hero-fallback.svg';
export const FALLBACK_MARK_IMAGE_PATH = '/images/oca-mark-fallback.svg';

export type PlaceholderKind = 'photo' | 'mark';

export function getPlaceholderImage(kind: PlaceholderKind = 'photo'): string {
  return kind === 'mark' ? FALLBACK_MARK_IMAGE : FALLBACK_HERO_IMAGE;
}

/**
 * Event handler for img `onError` to safely swap to the template's engraved SVG fallback.
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  kind: PlaceholderKind = 'photo'
): void {
  const img = event.currentTarget;
  const fallback = getPlaceholderImage(kind);
  if (img.src !== fallback) {
    img.src = fallback;
  }
}

/**
 * Head script that attaches a capture-phase error listener for early image load errors
 * across all pages, matching the template's safety net behavior.
 */
export const IMAGE_PLACEHOLDER_GUARD_SCRIPT = `(function(){var p=${JSON.stringify(
  FALLBACK_HERO_IMAGE
)},m=${JSON.stringify(
  FALLBACK_MARK_IMAGE
)};window.addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="IMG"){var k=t.getAttribute("data-ph")||(t.classList.contains("tile-img")?"photo":null);if(k){var s=k==="mark"?m:p;if(t.src!==s){t.src=s}}}},true)})();`;
