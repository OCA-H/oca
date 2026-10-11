'use client';

import React from 'react';
import { ROUTES } from '@/app/views/common/helper/route';
import { useExecutiveCommitteeHandler } from '../handler/useExecutiveCommitteeHandler';

export const ExecutiveCommitteeView: React.FC = () => {
  const { content, activeTermId, handleSelectTerm } = useExecutiveCommitteeHandler();
  const { breadcrumbs, hero, terms, cta } = content;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <a href={ROUTES.HOME}>{breadcrumbs.homeLabel}</a>
          <span className="sep">/</span>
          <span>{breadcrumbs.parentLabel}</span>
          <span className="sep">/</span>
          <span>{breadcrumbs.currentLabel}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="page-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.lead}</p>
            <div className="page-hero-actions">
              <a className="btn btn-primary" href={hero.primaryBtn.href}>
                {hero.primaryBtn.text}
              </a>
              <a className="btn btn-secondary" href={hero.secondaryBtn.href}>
                {hero.secondaryBtn.text}
              </a>
            </div>
          </div>
          <div className="page-hero-media">
            <div className="photo-tile duo-teal">
              <img
                className="tile-img"
                src={hero.image}
                alt={hero.imageAlt}
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
              <div className="tile-caption">
                <div className="t">{hero.caption}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Term Jump Bar */}
      <div className="xc-jump">
        <div className="wrap">
          {terms.map((term) => (
            <a
              key={term.id}
              href={`#/executive-committee!${term.id}`}
              className={activeTermId === term.id ? 'on' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleSelectTerm(term.id);
              }}
            >
              {term.jumpLabel} {term.isCurrent && <i>Current</i>}
            </a>
          ))}
        </div>
      </div>

      {/* Committee Terms */}
      {terms.map((term) => (
        <section
          key={term.id}
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
                <article key={idx} className="profile-card xc-card">
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
                        {bearer.initials}
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
                  </div>
                </article>
              ))}
            </div>

            <h3 className="xc-sub">Members &amp; Patron</h3>
            <div className="xc-list">
              {term.members.map((member, idx) => (
                <div key={idx} className={`xc-row ${member.profession ? 'has-prof' : ''}`.trim()}>
                  <div className="dir-mono" aria-hidden="true">
                    {member.initials}
                  </div>
                  <div className="dir-info">
                    <div className="name">{member.name}</div>
                    <div className="meta">{member.batch}</div>
                  </div>
                  <div className="xc-role">
                    <span>{member.role}</span>
                    {member.roleSub && <small>{member.roleSub}</small>}
                  </div>
                  {member.profession && (
                    <div className="xc-prof">
                      <span className="xc-chip">{member.profession}</span>
                    </div>
                  )}
                  <div className="xc-email">
                    <a className="xc-mail" href={`mailto:${member.email}`}>
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
                      <span>{member.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Band */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2>{cta.title}</h2>
            <p>{cta.lead}</p>
          </div>
          <div className="cta-band-actions">
            <a className="btn btn-gold" href={cta.primaryBtn.href}>
              {cta.primaryBtn.text}
            </a>
            <a className="btn btn-secondary" href={cta.secondaryBtn.href}>
              {cta.secondaryBtn.text}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExecutiveCommitteeView;
