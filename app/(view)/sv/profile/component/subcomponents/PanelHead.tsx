import React from 'react';
import type { ProfilePanel } from '../../content';
import { PanelLink } from './PanelLink';
import { ProfileIcon } from './ProfileIcon';

interface PanelHeadProps {
  panel: ProfilePanel;
  title: string;
  lead: string;
  /** Shows the "Dashboard" back button; left out on the dashboard itself. */
  onBack?: () => void;
}

export const PanelHead: React.FC<PanelHeadProps> = ({ panel, title, lead, onBack }) => (
  <>
    {onBack && (
      <PanelLink className="mp-back" panel="dashboard" onShow={onBack}>
        <ProfileIcon name="back" />
        Dashboard
      </PanelLink>
    )}
    <div className="mp-head">
      <h2 id={`mp-t-${panel}`} tabIndex={-1}>
        {title}
      </h2>
      <p>{lead}</p>
    </div>
  </>
);

/** The green confirmation at the top of a panel after a form succeeds. */
export const PanelSuccess: React.FC<{ id: string; show: boolean; children: React.ReactNode }> = ({ id, show, children }) => (
  <div className="mp-ok" id={id} role="status" hidden={!show}>
    <ProfileIcon name="check" />
    <p>{children}</p>
  </div>
);

/** A field's error message from the API, in the design's hint style. */
export const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="mp-hint mp-hint--bad">{message}</p> : null;

export default PanelHead;
