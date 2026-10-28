import React from 'react';
import { profileContent, type ProfilePanel } from '../../content';
import { PanelHead } from './PanelHead';
import { PanelLink } from './PanelLink';
import { ProfileIcon } from './ProfileIcon';

interface ComingSoonPanelProps {
  panel: ProfilePanel;
  /** The section's own name, e.g. "Donor Pass", shown above the message. */
  label: string;
  hidden: boolean;
  onBack: () => void;
}

/** Stands in for a section that is not built yet, when its address is opened directly. */
export const ComingSoonPanel: React.FC<ComingSoonPanelProps> = ({ panel, label, hidden, onBack }) => {
  const { comingSoon } = profileContent;
  return (
    <section className="mp-panel" id={`mp-${panel}`} aria-labelledby={`mp-t-${panel}`} hidden={hidden}>
      <PanelHead panel={panel} title={label} lead={comingSoon.lead} onBack={onBack} />
      <div className="mp-soon">
        <span className="mp-soon-ico" aria-hidden="true">
          <ProfileIcon name="dashboard" />
        </span>
        <span className="soon-tag">{comingSoon.badge}</span>
        <PanelLink className="btn btn-secondary" panel="dashboard" onShow={onBack}>
          {comingSoon.back}
        </PanelLink>
      </div>
    </section>
  );
};

export default ComingSoonPanel;
