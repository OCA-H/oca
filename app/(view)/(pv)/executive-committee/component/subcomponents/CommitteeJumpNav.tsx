import React from 'react';
import { CommitteeTerm } from '../../content/executiveCommittee.content';

export interface CommitteeJumpNavProps {
  terms: CommitteeTerm[];
  activeTermId: string;
  onSelectTerm: (termId: string) => void;
}

export const CommitteeJumpNav: React.FC<CommitteeJumpNavProps> = ({
  terms,
  activeTermId,
  onSelectTerm,
}) => {
  return (
    <div className="xc-jump">
      <div className="wrap">
        {terms.map((term) => (
          <a
            key={term.id}
            href={`#${term.id}`}
            className={activeTermId === term.id ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              onSelectTerm(term.id);
            }}
          >
            {term.jumpLabel} {term.isCurrent && <i>Current</i>}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CommitteeJumpNav;
