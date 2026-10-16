import React from 'react';
import { CommitteeTerm } from '../../content/executiveCommittee.content';
import { CommitteeTable } from './CommitteeTable';

export interface PastCommitteeSectionProps {
  term: CommitteeTerm;
}

export const PastCommitteeSection: React.FC<PastCommitteeSectionProps> = ({ term }) => {
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

        {term.officeBearers && term.officeBearers.length > 0 && (
          <>
            <h3 className="xc-sub">Office bearers</h3>
            <CommitteeTable items={term.officeBearers} />
          </>
        )}

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

export default PastCommitteeSection;
