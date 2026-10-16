import React from 'react';
import { OfficeBearer, CommitteeMember } from '../../content/executiveCommittee.content';

export type CommitteePerson = OfficeBearer | CommitteeMember;

export interface CommitteeTableProps {
  items: CommitteePerson[];
}

export const CommitteeTable: React.FC<CommitteeTableProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const hasAnyProfession = items.some((item) => Boolean(item.profession));

  return (
    <div className="xc-table-wrap">
      <table className="xc-table" aria-label="Committee member list">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Batch</th>
            <th scope="col">Role</th>
            {hasAnyProfession && <th scope="col">Profession</th>}
            <th scope="col">Contact</th>
          </tr>
        </thead>
        <tbody>
          {items.map((person, idx) => {
            const initials =
              person.initials ||
              person.name
                .split(' ')
                .filter(Boolean)
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

            return (
              <tr key={idx}>
                <td>
                  <div className="xc-table-person">
                    <div className="xc-table-mono" aria-hidden="true">
                      {initials}
                    </div>
                    <span className="xc-table-name">{person.name}</span>
                  </div>
                </td>
                <td>
                  <span className="xc-table-batch">{person.batch}</span>
                </td>
                <td>
                  <div className="xc-table-role">
                    <span>{person.role}</span>
                    {person.roleSub && <em>{person.roleSub}</em>}
                  </div>
                </td>
                {hasAnyProfession && (
                  <td>
                    {person.profession ? (
                      <span className="xc-chip">{person.profession}</span>
                    ) : (
                      <span style={{ color: 'var(--text-soft)' }}>—</span>
                    )}
                  </td>
                )}
                <td>
                  {person.email ? (
                    <a className="xc-mail" href={`mailto:${person.email}`}>
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                        <path
                          d="m4 7 8 6 8-6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{person.email}</span>
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-soft)' }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CommitteeTable;
