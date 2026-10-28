import React from 'react';
import type { ProfilePanel } from '../../content';
import { profileHelper } from '../../helper';

interface PanelLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  panel: ProfilePanel;
  onShow: (panel: ProfilePanel) => void;
}

/**
 * A real link to a panel's address, so it can be opened in a new tab or copied, that swaps
 * the panel in place on a plain click instead of reloading the members area.
 */
export const PanelLink: React.FC<PanelLinkProps> = ({ panel, onShow, children, ...rest }) => (
  <a
    {...rest}
    href={profileHelper.panelPath(panel)}
    data-panel={panel}
    onClick={(e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      onShow(panel);
    }}
  >
    {children}
  </a>
);

export default PanelLink;
