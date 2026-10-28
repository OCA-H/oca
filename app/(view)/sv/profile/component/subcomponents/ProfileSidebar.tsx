'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { profileContent, type ProfilePanel } from '../../content';
import { profileHelper } from '../../helper';
import type { MemberProfile } from '../../services';
import { PanelLink } from './PanelLink';
import { ProfileIcon } from './ProfileIcon';

interface ProfileSidebarProps {
  profile: MemberProfile;
  panel: ProfilePanel;
  onShowPanel: (panel: ProfilePanel) => void;
  photoSrc: string | null;
  photoMsg: { text: string; bad: boolean } | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignOut: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  panel,
  onShowPanel,
  photoSrc,
  photoMsg,
  onPhotoChange,
  onSignOut,
}) => {
  const photoInput = useRef<HTMLInputElement>(null);
  const pickPhoto = () => photoInput.current?.click();
  const name = profileHelper.displayName(profile);

  return (
    <aside className="mp-side" aria-label="Members menu">
      <div className="mp-profile">
        <div className="mp-photo-box">
          <div className="mp-photo-wrap">
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mp-photo" src={photoSrc} alt={name} />
            ) : (
              <span className="mp-photo-initials" aria-label={name}>
                {profileHelper.getInitials(profile.fullName)}
              </span>
            )}
          </div>
          <button className="mp-cam" type="button" aria-label="Change photo" onClick={pickPhoto}>
            <ProfileIcon name="camera" />
          </button>
        </div>
        <div className="mp-profile-t">
          <b>{name}</b>
          <small>{profileHelper.membershipLine(profile)}</small>
          <button className="mp-photo-btn" type="button" onClick={pickPhoto}>
            <ProfileIcon name="camera" />
            Change photo
          </button>
          <input
            ref={photoInput}
            className="mp-photo-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={onPhotoChange}
          />
          <p className={`mp-photo-msg${photoMsg?.bad ? ' is-bad' : ''}`} role="status" aria-live="polite" hidden={!photoMsg}>
            {photoMsg?.text}
          </p>
        </div>
      </div>

      <nav className="mp-nav" aria-label="Members sections">
        {profileContent.nav.map(({ group, items }) => (
          <React.Fragment key={group}>
            <p className="mp-group">{group}</p>
            {items.map((item) =>
              item.panel ? (
                <PanelLink
                  key={item.label}
                  className={`mp-link${panel === item.panel ? ' is-active' : ''}`}
                  panel={item.panel}
                  onShow={onShowPanel}
                  aria-current={panel === item.panel ? 'page' : undefined}
                >
                  <ProfileIcon name={item.icon} />
                  <span>{item.label}</span>
                </PanelLink>
              ) : (
                <Link key={item.label} className="mp-link" href={item.href!}>
                  <ProfileIcon name={item.icon} />
                  <span>{item.label}</span>
                  <ProfileIcon name="ext" className="mp-ext" />
                </Link>
              )
            )}
          </React.Fragment>
        ))}
        <button className="mp-link mp-out" type="button" onClick={onSignOut}>
          <ProfileIcon name="logout" />
          <span>Log out</span>
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
