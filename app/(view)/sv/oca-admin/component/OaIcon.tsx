import React from 'react';

// The OCA admin template's icons (templates/oca-admin.html), drawn on a 24×24 grid with a stroke.
const PATHS = {
  home: <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5c0-3.3 2.8-5.2 6.2-5.2s6.2 1.9 6.2 5.2M16.5 5.2a3.2 3.2 0 0 1 0 5.8M18 14.6c2.1.7 3.4 2.3 3.4 4.9" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9V6h18v3a3 3 0 0 0 0 6v3H3v-3a3 3 0 0 0 0-6Z" />
      <path d="M14 6v2M14 11v2M14 16v2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  idcard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16c.5-1.7 1.8-2.5 3.2-2.5s2.7.8 3.2 2.5M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  plus: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  download: <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  rupee: <path d="M6 4h12M6 9h12M6 4h3.5a5 5 0 0 1 0 10H6l8.5 7" />,
  filter: <path d="M4 5h16l-6 7.5V19l-4-2v-4.5L4 5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  cal: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
} as const;

export type OaIconName = keyof typeof PATHS;

export const OaIcon: React.FC<{ name: OaIconName }> = ({ name }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {PATHS[name]}
  </svg>
);
