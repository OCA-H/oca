import React from 'react';
import type { AdminPanel } from '../../content';
import { adminHelper } from '../../helper';

interface AdminPanelLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  panel: AdminPanel;
  onShow: (panel: AdminPanel) => void;
}

/**
 * A real link to a panel's address, so it can be opened in a new tab or copied, that swaps
 * the panel in place on a plain click instead of reloading the admin panel.
 */
export const AdminPanelLink: React.FC<AdminPanelLinkProps> = ({ panel, onShow, children, ...rest }) => (
  <a
    {...rest}
    href={adminHelper.panelPath(panel)}
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

export default AdminPanelLink;
