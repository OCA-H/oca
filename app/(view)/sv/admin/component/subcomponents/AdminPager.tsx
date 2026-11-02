import React from 'react';
import { AdminIcon } from './AdminIcon';

interface AdminPagerProps {
  page: number;
  pageSize: number;
  total: number;
  isLoading: boolean;
  onPage: (page: number) => void;
}

/** Page links with the current one in the middle: 1 … 4 5 6 … 12. */
const pageLinks = (page: number, pages: number): (number | 'gap')[] => {
  const wanted = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...wanted].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (['gap', p] as const) : [p]));
};

/** Previous and next, and the page numbers around the current one. Hidden for a single page. */
export const AdminPager: React.FC<AdminPagerProps> = ({ page, pageSize, total, isLoading, onPage }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  return (
    <nav className="ad-pager" aria-label="Pages">
      <button className="ad-pager-btn" type="button" onClick={() => onPage(page - 1)} disabled={page <= 1 || isLoading} aria-label="Previous page">
        <AdminIcon name="back" />
      </button>
      {pageLinks(page, pages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="ad-pager-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`ad-pager-btn${p === page ? ' is-active' : ''}`}
            type="button"
            onClick={() => onPage(p)}
            disabled={isLoading && p !== page}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        )
      )}
      <button className="ad-pager-btn" type="button" onClick={() => onPage(page + 1)} disabled={page >= pages || isLoading} aria-label="Next page">
        <AdminIcon name="go" />
      </button>
    </nav>
  );
};

export default AdminPager;
