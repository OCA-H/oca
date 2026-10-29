import React from 'react';
import type { AdminIconName } from '../../content';

// Line icons in the members-area style, all on a 24px grid.
const PATHS: Record<AdminIconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M8 2.5v4M16 2.5v4M3 10h18" />
    </>
  ),
  megaphone: <path d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l6 4.5v-15L7 9H4.5A1.5 1.5 0 0 0 3 10.5ZM17 8.5a5 5 0 0 1 0 7M7 15l1.5 5.5" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-9.3-9.2A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 9.3 4.2C19.5 15.4 12 20 12 20Z" />,
  page: <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5ZM14 3v5h5M8.5 13h7M8.5 16.5h5" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  back: <path d="M19 12H5m5-5-5 5 5 5" />,
  go: <path d="M5 12h14m-5-5 5 5-5 5" />,
  ext: <path d="M7 17 17 7M8 7h9v9" />,
  check: <path d="m5.5 12.5 4.2 4.2L18.5 8" strokeWidth="2.2" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5" />,
  up: <path d="m6 15 6-6 6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  upload: <path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="m21 16-5.2-5.2L5 20" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5c0-3.3 2.8-5.2 6.2-5.2s6.2 1.9 6.2 5.2M16.5 5.2a3.2 3.2 0 0 1 0 5.8M18 14.6c2.1.7 3.4 2.3 3.4 4.9" />
    </>
  ),
  home: <path d="M3.5 10.5 12 3.5l8.5 7M5.5 9v11h4.5v-6h4v6h4.5V9" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" strokeWidth="2" />
    </>
  ),
  layers: <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3ZM3 12l9 4.8 9-4.8M3 16.2 12 21l9-4.8" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  ticket: <path d="M3 8.5V6a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 6v2.5a3.5 3.5 0 0 0 0 7V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-2.5a3.5 3.5 0 0 0 0-7ZM14.5 4.5v15" />,
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3ZM9 12l2.2 2.2L15.5 10" />,
};

export const AdminIcon: React.FC<{ name: AdminIconName; className?: string }> = ({ name, className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {PATHS[name]}
  </svg>
);

export default AdminIcon;
