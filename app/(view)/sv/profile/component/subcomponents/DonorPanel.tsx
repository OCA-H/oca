import React from 'react';
import Link from 'next/link';
import { profileContent } from '../../content';
import { PanelHead } from './PanelHead';
import { ProfileIcon } from './ProfileIcon';

export const DonorPanel: React.FC<{ hidden: boolean; onBack: () => void }> = ({ hidden, onBack }) => {
  const { donor } = profileContent;
  return (
    <section className="mp-panel" id="mp-donor" aria-labelledby="mp-t-donor" hidden={hidden}>
      <PanelHead panel="donor" title={donor.title} lead={donor.lead} onBack={onBack} />
      <div className="mp-status">
        <span className="mp-status-ico">
          <ProfileIcon name="ticket" />
        </span>
        <div className="mp-status-t">
          <small>{donor.statusLabel}</small>
          <b>{donor.status}</b>
        </div>
        <Link className="btn btn-primary" href={donor.href}>
          {donor.cta}
        </Link>
      </div>
      <p className="mp-lead">{donor.partnersLead}</p>
      <ul className="mp-partners" aria-label="Partner offers">
        {donor.partners.map((partner) => (
          <li key={partner}>{partner}</li>
        ))}
      </ul>
    </section>
  );
};

export default DonorPanel;
