import React from 'react';
import { OfficeBearer } from '../../content/executiveCommittee.content';

export interface OfficeBearerCardProps {
  bearer: OfficeBearer;
}

export const OfficeBearerCard: React.FC<OfficeBearerCardProps> = ({ bearer }) => {
  const initials =
    bearer.initials ||
    bearer.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <article className="profile-card xc-card">
      {bearer.photo ? (
        <div className="profile-photo">
          <img
            src={bearer.photo}
            alt={bearer.photoAlt || `${bearer.name}, ${bearer.role}`}
            loading="lazy"
            decoding="async"
            data-ph="photo"
          />
          <span className="profile-role">
            {bearer.role}
            {bearer.roleSub && <em> {bearer.roleSub}</em>}
          </span>
        </div>
      ) : (
        <div className="profile-photo nophoto">
          <span className="xc-bigmono" aria-hidden="true">
            {initials}
          </span>
          <span className="profile-role">
            {bearer.role}
            {bearer.roleSub && <em> {bearer.roleSub}</em>}
          </span>
        </div>
      )}
      <div className="profile-body">
        <h3>{bearer.name}</h3>
        <div className="batch">{bearer.batch}</div>
        {bearer.profession && <span className="xc-chip">{bearer.profession}</span>}
        {bearer.email && (
          <a className="xc-mail" href={`mailto:${bearer.email}`}>
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
            <span>{bearer.email}</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default OfficeBearerCard;
