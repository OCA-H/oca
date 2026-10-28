import React from 'react';
import { adminContent, RECORD_PANELS, type AdminPanel, type RecordPanel } from '../../content';
import { AdminIcon } from './AdminIcon';
import { AdminPanelLink } from './AdminPanelLink';
import { FormSkeleton } from './AdminSkeleton';

interface RecordPanelFrameProps {
  panel: RecordPanel;
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
  isLoading: boolean;
  /** False until the first load finishes; a skeleton shows meanwhile. */
  hasLoaded: boolean;
  error: string | null;
  onReload: () => void;
  /** Shown beside the heading, e.g. "View on site". */
  action?: React.ReactNode;
  children: React.ReactNode;
}

/** What every record panel shares: back link, heading, refresh, and the loading and error states. */
export const RecordPanelFrame: React.FC<RecordPanelFrameProps> = ({ panel, isActive, onBack, isLoading, hasLoaded, error, onReload, action, children }) => {
  const { label, description } = RECORD_PANELS[panel];
  const text = adminContent.records;
  const headingId = `ad-t-${panel}`;

  return (
    <section className="mp-panel" data-admin-panel={panel} aria-labelledby={headingId} hidden={!isActive}>
      <AdminPanelLink className="mp-back" panel="dashboard" onShow={onBack}>
        <AdminIcon name="back" />
        Dashboard
      </AdminPanelLink>
      <div className="mp-head ad-head">
        <div>
          <h2 id={headingId} tabIndex={-1}>
            {label}
          </h2>
          <p>{description}</p>
        </div>
        <div className="ad-head-tools">
          {action}
          <button className="mp-photo-btn ad-view" type="button" onClick={onReload} disabled={isLoading} aria-busy={isLoading}>
            {text.refresh}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mp-fade">
          <p className="ms-error" role="alert">
            {text.loadError} {error}
          </p>
          <button className="btn btn-secondary" type="button" onClick={onReload} style={{ marginTop: 16 }}>
            {text.retry}
          </button>
        </div>
      ) : (
        hasLoaded ? children : <FormSkeleton />
      )}
    </section>
  );
};

export default RecordPanelFrame;
