import React from 'react';
import type { HomeCommitteeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { toneAt } from './SiteLink';

/** "Santosh V. Kalyani" → "SVK", when no initials were entered. */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 3)
    .join('')
    .toUpperCase();

export const CommitteeSection: React.FC<{ content: HomeCommitteeContent }> = ({ content }) => {
  return (
    <section className="section" id="committee" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head stack" style={{ maxWidth: "none", textAlign: "center" }}>
          {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
          <h2>{content.title}</h2>
        </div>
        <div className="committee-grid">
          {content.members.map((member, i) => (
            <div className="committee-card" key={`${i}-${member.name}`}>
              <div className={`committee-photo ${toneAt(i)} photo-tile`}>
                {member.image && <img className="tile-img" src={member.image} alt={member.imageAlt || `${member.name}, ${member.role}`} loading="lazy" decoding="async" />}
                <span className="initials">{member.initials || initialsOf(member.name)}</span>
              </div>
              <div className="committee-body"><h4>{member.name}</h4><div className="role">{member.role.toUpperCase()}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommitteeSection;
