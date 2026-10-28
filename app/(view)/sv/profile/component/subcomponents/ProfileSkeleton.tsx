import React from 'react';
import Link from 'next/link';
import { profileContent } from '../../content';

const Bar: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span className={`mp-skel ${className}`} style={style} aria-hidden="true" />
);

/**
 * Stands in for the members area while the profile loads. It reuses the real layout classes,
 * so the hero, sidebar and dashboard land exactly where the skeleton was and nothing jumps.
 */
export const ProfileSkeleton: React.FC = () => {
  const { breadcrumb, hero, nav, dashboard } = profileContent;
  const navRows = nav.reduce((count, group) => count + group.items.length, 0);

  return (
    <div className="mp-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="mp-sr">Loading your members area…</span>

      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={breadcrumb.homeHref}>{breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <span>{breadcrumb.pageText}</span>
        </div>
      </nav>

      <section className="page-hero mp-hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>
              <Bar className="mp-skel--dark mp-skel-h1" />
            </h1>
          </div>
          <div className="mp-chips">
            <Bar className="mp-skel--dark mp-skel-chip" />
            <Bar className="mp-skel--dark mp-skel-chip" style={{ width: 132 }} />
          </div>
        </div>
      </section>

      <section className="mp-shell">
        <div className="wrap mp-layout">
          <aside className="mp-side" aria-hidden="true">
            <div className="mp-profile">
              <div className="mp-photo-box">
                <Bar className="mp-photo-wrap mp-skel-photo" />
              </div>
              <div className="mp-profile-t">
                <Bar className="mp-skel-line mp-skel-name" />
                <Bar className="mp-skel-line mp-skel-sub" />
              </div>
            </div>
            <div className="mp-nav">
              {Array.from({ length: navRows }, (_, i) => (
                <div key={i} className="mp-link mp-skel-link">
                  <Bar className="mp-skel-ico" />
                  <Bar className="mp-skel-line" style={{ width: `${55 + ((i * 17) % 30)}%` }} />
                </div>
              ))}
            </div>
          </aside>

          <main className="mp-main" aria-hidden="true">
            <section className="mp-panel">
              <div className="mp-head">
                <Bar className="mp-skel-title" />
                <Bar className="mp-skel-line" style={{ width: '58%', marginTop: 12 }} />
              </div>
              <Bar className="mp-skel-feature" />
              <div className="mp-tiles">
                {dashboard.tiles.map((tile) => (
                  <div key={tile.label} className="mp-tile mp-skel-tile">
                    <Bar className="mp-tile-ico" />
                    <Bar className="mp-skel-line" style={{ width: '62%', height: 16 }} />
                    <Bar className="mp-skel-line" style={{ width: '88%', marginTop: 10 }} />
                    <Bar className="mp-skel-line" style={{ width: '40%', marginTop: 'auto' }} />
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProfileSkeleton;
