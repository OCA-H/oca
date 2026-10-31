import React from 'react';
import Link from 'next/link';
import { profileContent, type ProfilePanel, type ProfileTile } from '../../content';
import { profileHelper } from '../../helper';
import type { MemberProfile } from '../../services';
import { PanelHead } from './PanelHead';
import { PanelLink } from './PanelLink';
import { ProfileIcon } from './ProfileIcon';

interface DashboardPanelProps {
  profile: MemberProfile;
  hidden: boolean;
  onShowPanel: (panel: ProfilePanel) => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ profile, hidden, onShowPanel }) => {
  const { dashboard, comingSoon, admin } = profileContent;
  const tiles = profileHelper.isAdmin(profile) ? [admin.tile, ...dashboard.tiles] : dashboard.tiles;

  // Tiles that show the member's own details instead of a fixed line.
  const details = (tile: ProfileTile): React.ReactNode => {
    switch (tile.panel) {
      case 'card':
        return (
          <>
            <span className="mp-mini">{profile.membershipType}</span>
            <span className="mp-id">{profile.memberId}</span>
            {profile.username && <span className="mp-mini">User ID: {profile.username}</span>}
          </>
        );
      default:
        return tile.desc;
    }
  };

  return (
    <section className="mp-panel" id="mp-dashboard" aria-labelledby="mp-t-dashboard" hidden={hidden}>
      <PanelHead panel="dashboard" title={dashboard.title} lead={dashboard.lead} />

      <div className="mp-feature">
        <div className="mp-feature-t">
          <span className="mp-pill">{dashboard.feature.pill}</span>
          <h3>{dashboard.feature.title}</h3>
          <p>{dashboard.feature.desc}</p>
        </div>
        <Link className="btn btn-gold" href={dashboard.feature.href}>
          {dashboard.feature.cta}
        </Link>
      </div>

      <div className="mp-tiles">
        {tiles.map((tile) => {
          const className = `mp-tile${tile.tone ? ` mp-tile--${tile.tone}` : ''}`;

          // Not built yet: the same card, quietened, with a badge instead of an action.
          if (tile.soon) {
            return (
              <div key={tile.label} className={`${className} is-soon`} aria-disabled="true">
                <span className="mp-tile-ico">
                  <ProfileIcon name={tile.icon} />
                </span>
                <span className="mp-tile-t">{tile.label}</span>
                <span className="mp-tile-d">{tile.desc}</span>
                <span className="mp-tile-act">
                  <span className="soon-tag">{comingSoon.badge}</span>
                </span>
              </div>
            );
          }

          const body = (
            <>
              {tile.href && (
                <span className="mp-tile-ext">
                  <ProfileIcon name="ext" className="mp-ext" />
                </span>
              )}
              <span className="mp-tile-ico">
                <ProfileIcon name={tile.icon} />
              </span>
              <span className="mp-tile-t">{tile.label}</span>
              <span className="mp-tile-d">{details(tile)}</span>
              <span className="mp-tile-act">
                {tile.action} <ProfileIcon name="go" />
              </span>
            </>
          );

          return tile.panel ? (
            <PanelLink key={tile.label} className={className} panel={tile.panel} onShow={onShowPanel}>
              {body}
            </PanelLink>
          ) : (
            <Link key={tile.label} className={className} href={tile.href!}>
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardPanel;
