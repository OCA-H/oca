import React from 'react';
import { SECTION_SPECS } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { adminContent, RECORD_GROUPS, RECORD_PANELS, SECTION_ICONS, type AdminPanel } from '../../content';
import { adminHelper } from '../../helper';
import type { SectionSummary } from '../../services';
import { AdminIcon } from './AdminIcon';
import { AdminPanelLink } from './AdminPanelLink';

interface AdminDashboardPanelProps {
  sections: SectionSummary[];
  hidden: boolean;
  onShowPanel: (panel: AdminPanel) => void;
}

/** One tile per editable section, grouped by page, with when it was last saved. */
export const AdminDashboardPanel: React.FC<AdminDashboardPanelProps> = ({ sections, hidden, onShowPanel }) => {
  const { dashboard, nav } = adminContent;
  // The menu's page groups, in menu order, with their sections.
  const groups = nav
    .map(({ group, items }) => ({ group, specs: SECTION_SPECS.filter((spec) => items.some((item) => item.panel === spec.key)) }))
    .filter(({ specs }) => specs.length > 0);

  return (
    <section className="mp-panel" data-admin-panel="dashboard" aria-labelledby="ad-t-dashboard" hidden={hidden}>
      <div className="mp-head">
        <h2 id="ad-t-dashboard" tabIndex={-1}>
          {dashboard.title}
        </h2>
        <p>{dashboard.lead}</p>
      </div>

      {groups.map(({ group, specs }) => (
        <React.Fragment key={group}>
          <h3 className="ad-subhead">{dashboard.pageTitle(group)}</h3>
          <div className="mp-tiles">
            {specs.map((spec) => {
              const summary = sections.find((s) => s.key === spec.key);
              return (
                <AdminPanelLink key={spec.key} className="mp-tile" panel={spec.key} onShow={onShowPanel}>
                  <span className="mp-tile-ico">
                    <AdminIcon name={SECTION_ICONS[spec.key]} />
                  </span>
                  {summary?.updatedAt ? (
                    <span className="ad-status" title={`${dashboard.saved} ${adminHelper.formatSaved(summary.updatedAt)}`}>
                      {dashboard.saved} {adminHelper.formatSavedDate(summary.updatedAt)}
                    </span>
                  ) : (
                    <span className="ad-status ad-status--original">{dashboard.notSaved}</span>
                  )}
                  <span className="mp-tile-t">{spec.label}</span>
                  <span className="mp-tile-d">{spec.description}</span>
                  <span className="mp-tile-act">
                    {dashboard.edit}
                    <AdminIcon name="go" />
                  </span>
                </AdminPanelLink>
              );
            })}
          </div>
        </React.Fragment>
      ))}

      {RECORD_GROUPS.map(({ group, panels }) => (
        <React.Fragment key={group}>
          <h3 className="ad-subhead">{group}</h3>
          <div className="mp-tiles">
            {panels.map((panel) => (
              <AdminPanelLink key={panel} className="mp-tile mp-tile--gold" panel={panel} onShow={onShowPanel}>
                <span className="mp-tile-ico">
                  <AdminIcon name={RECORD_PANELS[panel].icon} />
                </span>
                <span className="mp-tile-t">{RECORD_PANELS[panel].label}</span>
                <span className="mp-tile-d">{RECORD_PANELS[panel].description}</span>
                <span className="mp-tile-act">
                  {adminContent.records.view}
                  <AdminIcon name="go" />
                </span>
              </AdminPanelLink>
            ))}
          </div>
        </React.Fragment>
      ))}
    </section>
  );
};

export default AdminDashboardPanel;
