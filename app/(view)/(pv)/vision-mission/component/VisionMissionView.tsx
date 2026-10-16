import React from 'react';
import Link from 'next/link';
import { visionMissionContent } from '../content';
import { ROUTES } from '@/app/(view)/common/helper/routes';

export const VisionMissionView: React.FC = () => {
  const { hero, whoWeAre, vision, mission, objectives, socialConscience, cta } =
    visionMissionContent;

  return (
    <>
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={ROUTES.HOME}>Home</Link>
          <span className="sep">/</span>
          <span>Vision &amp; Mission</span>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="page-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.lead}</p>
            <div className="page-hero-actions">
              <Link className="btn btn-primary" href={hero.primaryBtn.href}>
                {hero.primaryBtn.text}
              </Link>
              <Link className="btn btn-secondary" href={hero.secondaryBtn.href}>
                {hero.secondaryBtn.text}
              </Link>
            </div>
          </div>
          <div className="page-hero-media">
            <div className="photo-tile duo-navy">
              <img
                className="tile-img"
                src={hero.image}
                alt={hero.imageAlt}
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Who we are ---------- */}
      <section className="content-section">
        <div className="wrap split-2">
          <div>
            <div className="section-head stack" style={{ marginBottom: '20px' }}>
              <span className="eyebrow">{whoWeAre.eyebrow}</span>
              <h2>{whoWeAre.title}</h2>
            </div>
            <div className="prose">
              <p>
                The <strong>Old Columbans Association</strong> is a mutual
                benefit association founded by the ex-students of St.
                Columba&rsquo;s School, New Delhi, in association with the
                Management of the School.
              </p>
              <p>
                It is eternally guided by the School motto, which the
                Association continues to enshrine in its spirit and ethos.
              </p>
            </div>
          </div>
          <div className="split-media">
            <figure className="motto motto--fill">
              <div className="motto-orn" aria-hidden="true">
                <i></i>
              </div>
              <p className="motto-latin" lang="la">
                {whoWeAre.motto.latin.map((line, idx) => (
                  <span key={idx}>{line} </span>
                ))}
              </p>
              <p className="motto-trans">{whoWeAre.motto.trans}</p>
              <figcaption className="motto-cap">
                {whoWeAre.motto.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Our Vision ---------- */}
      <section
        className="content-section tint-gold"
        style={{ paddingTop: '88px', paddingBottom: '88px' }}
      >
        <div className="wrap editorial-quote">
          <span className="eyebrow">{vision.eyebrow}</span>
          <span className="mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote>{vision.quote}</blockquote>
          <div className="after">{vision.after}</div>
        </div>
      </section>

      {/* ---------- Our Mission ---------- */}
      <section
        className="content-section"
        style={{
          background: '#fff',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="wrap split-2">
          <div>
            <span className="eyebrow">{mission.eyebrow}</span>
            <h2 style={{ fontSize: '30px', lineHeight: '1.25', marginTop: '8px' }}>
              To praise, promote and protect St. Columba&rsquo;s School
            </h2>
            <div className="prose" style={{ marginTop: '20px' }}>
              {mission.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <Link
              className="btn btn-secondary"
              style={{ marginTop: '26px' }}
              href={mission.buttonHref}
            >
              {mission.buttonText}
            </Link>
          </div>
          <div className="split-media">
            <div className="photo-tile duo-teal">
              <img
                className="tile-img"
                src={mission.image}
                alt={mission.imageAlt}
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
            <p className="split-caption">{mission.caption}</p>
          </div>
        </div>
      </section>

      {/* ---------- Our Objectives ---------- */}
      <section className="content-section">
        <div className="wrap">
          <div className="section-head stack">
            <span className="eyebrow">{objectives.eyebrow}</span>
            <h2>{objectives.title}</h2>
            <p>{objectives.subtitle}</p>
          </div>
          <div className="obj-list">
            {objectives.items.map((item) => (
              <div className="obj-item" key={item.num}>
                <div className="obj-num">{item.num}</div>
                <div className="obj-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="form-note" style={{ marginTop: '26px' }}>
            {objectives.formNote}
            <Link href={objectives.formNoteHref}>{objectives.formNoteLinkText}</Link>.
          </p>
        </div>
      </section>

      {/* ---------- Where it shows ---------- */}
      <section className="content-section tint-teal">
        <div className="wrap split-2 media-left">
          <div className="split-media">
            <div className="photo-tile duo-gold">
              <img
                className="tile-img"
                src={socialConscience.image}
                alt={socialConscience.imageAlt}
                loading="lazy"
                decoding="async"
                data-ph="photo"
              />
            </div>
            <p className="split-caption">{socialConscience.caption}</p>
          </div>
          <div>
            <span className="eyebrow">{socialConscience.eyebrow}</span>
            <h2 style={{ fontSize: '30px', lineHeight: '1.25', marginTop: '8px' }}>
              {socialConscience.title}
            </h2>
            <div className="prose" style={{ marginTop: '20px' }}>
              <p>{socialConscience.paragraph}</p>
            </div>
            <Link
              className="btn btn-primary"
              style={{ marginTop: '26px' }}
              href={socialConscience.buttonHref}
            >
              {socialConscience.buttonText}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta-band">
        <div className="wrap">
          <div>
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2>{cta.title}</h2>
            <p>{cta.lead}</p>
          </div>
          <div className="cta-band-actions">
            <Link className="btn btn-gold" href={cta.btnGold.href}>
              {cta.btnGold.text}
            </Link>
            <Link className="btn btn-secondary" href={cta.btnSecondary.href}>
              {cta.btnSecondary.text}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default VisionMissionView;
