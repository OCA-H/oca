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
  const { dashboard, donor, birthdays } = profileContent;

  // Tiles that show the member's own details instead of a fixed line.
  const details = (tile: ProfileTile): React.ReactNode => {
    switch (tile.panel) {
      case 'card':
        return (
          <>
            <span className="mp-mini">{profile.membershipType}</span>
            <span className="mp-id">{profile.memberId}</span>
          </>
        );
      case 'donor':
        return (
          <>
            <span className="mp-mini mp-mini--gold">{donor.tileBadge}</span>
            {tile.desc}
          </>
        );
      case 'birthdays':
        return (
          <>
            <span className="mp-stack">
              {birthdays.people.map((person) => (
                <i key={person.name}>{profileHelper.getInitials(person.name)}</i>
              ))}
            </span>
            {birthdays.people.length} Columbans celebrate today.
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
        {dashboard.tiles.map((tile) => {
          const className = `mp-tile${tile.tone ? ` mp-tile--${tile.tone}` : ''}`;
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
