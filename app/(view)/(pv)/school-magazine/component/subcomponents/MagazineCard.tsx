import React from 'react';
import { schoolMagazineContent as text } from '../../content';
import { schoolMagazineHelper } from '../../helper';

/** One edition of The Columban: its cover and year, opening the magazine in a new tab. */
export const MagazineCard: React.FC<{
  year: string;
  image: string;
  href: string;
  kicker?: string;
  desc?: string;
  featured?: boolean;
  hidden?: boolean;
}> = ({ year, image, href, kicker, desc, featured, hidden }) => (
  <a className={`mag-card${featured ? ' feat' : ''}`} data-era={schoolMagazineHelper.era(year)} href={href} target="_blank" rel="noopener noreferrer" hidden={hidden}>
    <div className="mag-cover">
      <img src={image} alt={text.coverAlt(year)} loading="lazy" decoding="async" />
    </div>
    <div className="mag-meta">
      {kicker && <span className="mag-kicker">{kicker}</span>}
      <h3>{year}</h3>
      {desc && <p className="mag-desc">{desc}</p>}
      <span className="mag-open">{text.readMagazine}</span>
    </div>
  </a>
);

export default MagazineCard;
