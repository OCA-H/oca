import React from 'react';
import Link from 'next/link';
import { profileContent, type ProfilePanel } from '../../content';
import { CardSkeleton } from './CardPanel';
import { ProfileIcon } from './ProfileIcon';

const Bar: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span className={`mp-skel ${className}`} style={style} aria-hidden="true" />
);

/** Placeholder for any panel other than the dashboard: its heading, then rows of fields. */
const FormPanelSkeleton: React.FC = () => (
  <>
    <Bar className="mp-skel-back" />
    <div className="mp-head">
      <Bar className="mp-skel-title" />
      <Bar className="mp-skel-line" style={{ width: '58%', marginTop: 12 }} />
    </div>
    {[2, 3, 2, 1].map((columns, row) => (
      <div key={row} className={`mp-skel-row mp-skel-row--${columns}`}>
        {Array.from({ length: columns }, (_, i) => (
          <div key={i}>
            <Bar className="mp-skel-line mp-skel-label" />
            <Bar className="mp-skel-input" />
          </div>
        ))}
      </div>
    ))}
    <div className="mp-actions">
      <Bar className="mp-skel-btn" />
    </div>
  </>
);

const DashboardSkeleton: React.FC = () => (
  <>
    <div className="mp-head">
      <Bar className="mp-skel-title" />
      <Bar className="mp-skel-line" style={{ width: '58%', marginTop: 12 }} />
    </div>
    <Bar className="mp-skel-feature" />
    <div className="mp-tiles">
      {profileContent.dashboard.tiles.map((tile) => (
        <div key={tile.label} className="mp-tile mp-skel-tile">
          <Bar className="mp-tile-ico" />
          <Bar className="mp-skel-line" style={{ width: '62%', height: 16 }} />
          <Bar className="mp-skel-line" style={{ width: '88%', marginTop: 10 }} />
          <Bar className="mp-skel-line" style={{ width: '40%', marginTop: 'auto' }} />
        </div>
      ))}
    </div>
  </>
);

/**
 * Stands in for the members area while the profile loads, shaped like the panel being opened.
 * It reuses the real layout classes and the real (static) menu, so the loaded page lands
 * exactly where the skeleton was and nothing jumps.
 */
export const ProfileSkeleton: React.FC<{ panel: ProfilePanel }> = ({ panel }) => {
  const { breadcrumb, hero, nav } = profileContent;

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
            <div className="mp-nav mp-skel-nav">
              {nav.map(({ group, items }) => (
                <React.Fragment key={group}>
                  <p className="mp-group">{group}</p>
                  {items.map((item) => (
                    <span key={item.label} className={`mp-link${item.panel === panel ? ' is-active' : ''}`}>
                      <ProfileIcon name={item.icon} />
                      <span>{item.label}</span>
                      {item.href && <ProfileIcon name="ext" className="mp-ext" />}
                    </span>
                  ))}
                </React.Fragment>
              ))}
              <span className="mp-link mp-out">
                <ProfileIcon name="logout" />
                <span>Log out</span>
              </span>
            </div>
          </aside>

          <main className="mp-main" aria-hidden="true">
            <section className="mp-panel">
              {panel === 'dashboard' ? (
                <DashboardSkeleton />
              ) : panel === 'card' ? (
                <>
                  <Bar className="mp-skel-back" />
                  <div className="mp-head">
                    <Bar className="mp-skel-title" />
                    <Bar className="mp-skel-line" style={{ width: '40%', marginTop: 12 }} />
                  </div>
                  <CardSkeleton />
                </>
              ) : (
                <FormPanelSkeleton />
              )}
            </section>
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProfileSkeleton;
