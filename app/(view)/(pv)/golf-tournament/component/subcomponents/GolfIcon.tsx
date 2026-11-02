import React from 'react';

// The golf page's line icons, drawn as in the page template: 24px grid, 1.7 stroke.
const ICONS = {
  person: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
    </>
  ),
  couple: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5c0-3.3 2.8-5.2 6.2-5.2s6.2 1.9 6.2 5.2M16.5 5.2a3.2 3.2 0 0 1 0 5.8M18 14.6c2.1.7 3.4 2.3 3.4 4.9" />
    </>
  ),
  dinner: <path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8M7 7h4M17 3c-2 1.5-3 4-3 7 0 1.5 1 2.5 3 3v8" />,
  flag: <path d="M6 21V4M6 5l11 4-11 4" />,
  check: <path d="m5.5 12.5 4.2 4.2L18.5 8" strokeWidth="2.2" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9V6h18v3a3 3 0 0 0 0 6v3H3v-3a3 3 0 0 0 0-6Z" />
      <path d="M14 6v2M14 11v2M14 16v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
};

export type GolfIconName = keyof typeof ICONS;

export const GolfIcon: React.FC<{ name: GolfIconName }> = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICONS[name]}
  </svg>
);

export default GolfIcon;
