import React from 'react';
import Link from 'next/link';

type SiteLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/** A link an admin entered: client-side navigation for pages on this site, a plain link otherwise. */
export const SiteLink: React.FC<SiteLinkProps> = ({ href, ...rest }) =>
  /^\/(?![/\\])/.test(href) ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;

/** The photo tiles' colour washes, in turn. */
export const TILE_TONES = ['duo-navy', 'duo-teal', 'duo-gold'] as const;
export const toneAt = (index: number, offset = 0) => TILE_TONES[(index + offset) % TILE_TONES.length];

export default SiteLink;
