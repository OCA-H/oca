import React from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { AdminSidebar } from './AdminSidebar';

const Bar: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span className={`mp-skel ${className}`} style={style} aria-hidden="true" />
);

/** Rows of fields, while a section's content loads. */
export const FormSkeleton: React.FC = () => (
  <div aria-busy="true">
    <Bar className="mp-skel-line" style={{ width: '40%', marginBottom: 28 }} />
    {[2, 1, 2, 1].map((columns, row) => (
      <div key={row} className={`mp-skel-row mp-skel-row--${columns}`}>
        {Array.from({ length: columns }, (_, i) => (
          <div key={i}>
            <Bar className="mp-skel-line mp-skel-label" />
            <Bar className="mp-skel-input" />
          </div>
        ))}
      </div>
    ))}
    <div className="mp-actions">
      <Bar className="mp-skel-btn" />
    </div>
  </div>
);

/**
 * Stands in for the admin panel while it loads. It uses the real layout and the real menu, so
 * the loaded page lands where the skeleton was and nothing jumps.
 */
export const AdminSkeleton: React.FC<{ panel?: AdminPanel }> = ({ panel }) => (
  <div className="mp-loading" aria-busy="true">
    <nav className="crumb" aria-label="Breadcrumb">
      <div className="wrap">
        <span>{adminContent.breadcrumb.pageText}</span>
      </div>
    </nav>
    <section className="page-hero mp-hero">
      <div className="wrap">
        <div>
          <span className="eyebrow">{adminContent.hero.eyebrow}</span>
          <h1>{adminContent.hero.title}</h1>
        </div>
        <div className="mp-chips">
          <Bar className="mp-skel-chip mp-skel--dark" />
        </div>
      </div>
    </section>
    <section className="mp-shell">
      <div className="wrap mp-layout">
        <div className="mp-skel-nav">
          <AdminSidebar panel={panel} />
        </div>
        <main className="mp-main">
          <section className="mp-panel">
            <div className="mp-head">
              <Bar className="mp-skel-title" />
              <Bar className="mp-skel-line" style={{ width: '58%', marginTop: 12 }} />
            </div>
            <FormSkeleton />
          </section>
        </main>
      </div>
    </section>
  </div>
);

export default AdminSkeleton;
