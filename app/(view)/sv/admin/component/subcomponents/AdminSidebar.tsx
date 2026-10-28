'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { adminContent, type AdminNavGroup, type AdminNavItem, type AdminPanel } from '../../content';
import { adminHelper } from '../../helper';
import type { AdminUser } from '../../services';
import { AdminIcon } from './AdminIcon';
import { AdminPanelLink } from './AdminPanelLink';

interface AdminSidebarProps {
  /** Left out while loading: the menu shows, without the admin's name. */
  admin?: AdminUser;
  /** Left out while loading: nothing is highlighted. */
  panel?: AdminPanel;
  /** Left out while loading (the skeleton is a server component, which cannot pass functions). */
  onShowPanel?: (panel: AdminPanel) => void;
  onSignOut?: () => void;
  isSigningOut?: boolean;
}

/** The collapsible group holding a panel's menu entry, if any. */
const groupOf = (panel: AdminPanel | undefined) =>
  adminContent.nav.find((g) => g.collapsible && g.items.some((item) => item.panel === panel))?.group;

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ admin, panel, onShowPanel, onSignOut, isSigningOut }) => {
  // Groups the admin opened or closed by hand. The rest are open only while they hold the open panel,
  // so the menu stays short however many pages become editable.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [lastPanel, setLastPanel] = useState(panel);
  if (panel !== lastPanel) {
    // Moving to a panel (from a dashboard tile, say) opens its group again, even if it was closed by hand.
    setLastPanel(panel);
    const group = groupOf(panel);
    if (group && group in toggled) {
      const rest = { ...toggled };
      delete rest[group];
      setToggled(rest);
    }
  }

  const isOpen = ({ group }: AdminNavGroup) => toggled[group] ?? groupOf(panel) === group;
  const toggle = (navGroup: AdminNavGroup) => setToggled((t) => ({ ...t, [navGroup.group]: !isOpen(navGroup) }));

  const renderItem = (item: AdminNavItem) =>
    item.soon ? (
      <span key={item.label} className="mp-link is-soon" aria-disabled="true">
        <AdminIcon name={item.icon} />
        <span>{item.label}</span>
        <span className="soon-tag">{adminContent.soonTag}</span>
      </span>
    ) : item.panel ? (
      <AdminPanelLink
        key={item.label}
        className={`mp-link${panel === item.panel ? ' is-active' : ''}`}
        panel={item.panel}
        onShow={onShowPanel ?? (() => undefined)}
        aria-current={panel === item.panel ? 'page' : undefined}
      >
        <AdminIcon name={item.icon} />
        <span>{item.label}</span>
      </AdminPanelLink>
    ) : (
      <Link key={item.label} className="mp-link" href={item.href!}>
        <AdminIcon name={item.icon} />
        <span>{item.label}</span>
        <AdminIcon name="ext" className="mp-ext" />
      </Link>
    );

  return (
    <aside className="mp-side" aria-label="Admin menu">
      <div className="mp-profile ad-who">
        <span className="ad-who-badge" aria-hidden="true">
          {admin ? adminHelper.getInitials(admin.fullName) : <AdminIcon name="shield" />}
        </span>
        <div className="mp-profile-t">
          {admin ? <b>{admin.fullName}</b> : <span className="mp-skel mp-skel-line mp-skel-name" aria-hidden="true" />}
          <small className="ad-role">
            <AdminIcon name="shield" />
            {adminContent.hero.chip}
          </small>
        </div>
      </div>

      <nav className="mp-nav" aria-label="Admin sections">
        {adminContent.nav.map((navGroup) => {
          const { group, items, collapsible } = navGroup;
          if (!collapsible) {
            return (
              <React.Fragment key={group}>
                <p className="mp-group">{group}</p>
                {items.map(renderItem)}
              </React.Fragment>
            );
          }
          const open = isOpen(navGroup);
          const listId = `ad-nav-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const holdsActive = groupOf(panel) === group;
          return (
            <div key={group} className={`ad-nav-group${open ? ' is-open' : ''}${holdsActive ? ' has-active' : ''}`}>
              <button className="ad-group-toggle" type="button" aria-expanded={open} aria-controls={listId} onClick={() => toggle(navGroup)}>
                {navGroup.icon && (
                  <span className="ad-group-ico" aria-hidden="true">
                    <AdminIcon name={navGroup.icon} />
                  </span>
                )}
                <span className="ad-group-name">{group}</span>
                <span className="ad-group-count">
                  {items.length}
                  <span className="mp-sr"> sections</span>
                </span>
                <AdminIcon name="down" className="ad-group-chev" />
              </button>
              <div className="ad-nav-items" id={listId}>
                {items.map(renderItem)}
              </div>
            </div>
          );
        })}
        {onSignOut && (
          <button className="mp-link mp-out" type="button" onClick={onSignOut} disabled={isSigningOut} aria-busy={isSigningOut}>
            <AdminIcon name="logout" />
            <span>{isSigningOut ? 'Signing out…' : 'Log out'}</span>
          </button>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
