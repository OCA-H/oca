import React from 'react';
import { CommitteeTerm } from '../../content/executiveCommittee.content';
import { OfficeBearerCard } from './OfficeBearerCard';
import { CommitteeTable } from './CommitteeTable';

export interface CurrentCommitteeSectionProps {
  term: CommitteeTerm;
}

export const CurrentCommitteeSection: React.FC<CurrentCommitteeSectionProps> = ({ term }) => {
  return (
    <section
      className={`content-section ${term.tintClass || ''}`.trim()}
      id={term.id}
    >
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            <span className="eyebrow">{term.eyebrow}</span>
            <h2>{term.title}</h2>
          </div>
          {term.pill && <span className="pill gold">{term.pill}</span>}
        </div>

        <h3 className="xc-sub">Office bearers</h3>
        <div className={`profile-row ${term.isFourColumns ? 'four' : ''}`.trim()}>
          {term.officeBearers.map((bearer, idx) => (
            <OfficeBearerCard key={idx} bearer={bearer} />
          ))}
        </div>

        {term.members && term.members.length > 0 && (
          <>
            <h3 className="xc-sub">Members &amp; Patron</h3>
            <CommitteeTable items={term.members} />
          </>
        )}
      </div>
    </section>
  );
};

export default CurrentCommitteeSection;
