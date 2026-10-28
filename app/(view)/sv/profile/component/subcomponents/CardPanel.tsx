'use client';

import React from 'react';
import { profileContent } from '../../content';
import { profileHelper } from '../../helper';
import type { MemberProfile } from '../../services';
import { PanelHead } from './PanelHead';
import { ProfileIcon } from './ProfileIcon';

interface CardPanelProps {
  profile: MemberProfile;
  hidden: boolean;
  onBack: () => void;
}

export const CardPanel: React.FC<CardPanelProps> = ({ profile, hidden, onBack }) => {
  const { card } = profileContent;
  const name = profileHelper.displayName(profile);
  // The print stylesheet keeps only the card; "Download" opens the same dialog to save it as a PDF.
  const printCard = () => window.print();

  return (
    <section className="mp-panel" id="mp-card" aria-labelledby="mp-t-card" hidden={hidden}>
      <PanelHead panel="card" title={card.title} lead={card.lead} onBack={onBack} />
      <div className="mp-ecard-wrap">
        <div
          className="mp-ecard"
          role="img"
          aria-label={`${card.org} membership card for ${name}, ${profileHelper.membershipLine(profile)}`}
        >
          <div className="mp-ecard-top">
            <span className="mp-ecard-crest" aria-hidden="true" />
            <span className="mp-ecard-org">
              <b>{card.org}</b>
              <small>{card.school}</small>
            </span>
            <span className="mp-ecard-tag">{profile.membershipType}</span>
          </div>
          <div className="mp-ecard-body">
            <span className="mp-ecard-name">{name}</span>
            <div className="mp-ecard-meta">
              {profile.batchYear && (
                <span>
                  <small>Batch</small>
                  <b>{profile.batchYear}</b>
                </span>
              )}
              <span>
                <small>Member ID</small>
                <b>{profile.memberId}</b>
              </span>
              <span>
                <small>Valid</small>
                <b>{card.validity}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="mp-ecard-side">
          <dl className="mp-dl">
            <dt>Member</dt>
            <dd>{name}</dd>
            <dt>Membership</dt>
            <dd>{profile.membershipType}</dd>
            <dt>Member ID</dt>
            <dd>{profile.memberId}</dd>
          </dl>
          <div className="mp-btns">
            <button className="btn btn-primary" type="button" onClick={printCard}>
              <ProfileIcon name="download" />
              Download card
            </button>
            <button className="btn btn-secondary" type="button" onClick={printCard}>
              <ProfileIcon name="print" />
              Print
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardPanel;
