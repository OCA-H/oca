'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FIRST_BATCH, lastBatch } from '@/app/api/(features)/sv/oca-admin/schema';
import { OaSelect, type OaOption } from './OaSelect';

const num = (n: number) => n.toLocaleString('en-IN');
export const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;
export const money = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

/** A value, or nothing when it is empty (the old portal showed blanks, not dashes). */
export const Dash: React.FC<{ v?: string | number | null }> = ({ v }) => <>{v ?? ''}</>;

export const PageHead: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="ph">
    <h1>{title}</h1>
    {children}
  </div>
);

export const Back: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <a className="back" href={`#${to}`}>
    &larr; {label}
  </a>
);

export const Actions: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="factions">{children}</div>;

/** A labelled control in a filter row. */
export const Ff: React.FC<{ label: string; grow?: boolean; children: React.ReactNode }> = ({ label, grow, children }) => (
  <label className={`ff${grow ? ' grow' : ''}`}>
    <span>{label}</span>
    {children}
  </label>
);

/** Batch choices, newest first back to 1940, with how many records each has. */
export const batchOptions = (counts: Record<string, number>, all: boolean, selected = ''): OaOption[] => {
  const out: OaOption[] = [];
  for (let y = lastBatch(); y >= FIRST_BATCH; y--) {
    const n = counts[y] ?? 0;
    if (all || n || String(y) === selected) out.push({ value: String(y), label: `${y} (${num(n)})` });
  }
  return out;
};

export const countBy = <T,>(list: T[], key: (x: T) => string) => {
  const counts: Record<string, number> = {};
  for (const x of list) counts[key(x)] = (counts[key(x)] ?? 0) + 1;
  return counts;
};

/* ------------------------------- tables -------------------------------- */

export interface Column<T> {
  label: string;
  /** Makes the column sortable. */
  sort?: (row: T) => string | number;
  /** Cell content. */
  cell: (row: T) => React.ReactNode;
  wrap?: boolean;
  /** On phones, this cell becomes the card's title: first, full width, no label. */
  primary?: boolean;
}

export interface SortState {
  col: number | null;
  dir: 'asc' | 'desc';
}

/** One scrolling table. On phones it becomes stacked cards (each cell labelled), so nothing scrolls sideways. */
export function DataTable<T>({
  cols,
  rows,
  rowKey,
  sort,
  onSort,
  before,
}: {
  cols: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  sort?: SortState;
  onSort?: (col: number) => void;
  /** Extra rows rendered before a row (e.g. a group heading). */
  before?: (row: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="card tcard stack">
      <div className="scrollit">
        <table className="target" style={{ minWidth: Math.max(300, cols.length * 108) }}>
          <thead>
            <tr>
              {cols.map((c, i) => {
                if (!c.sort || !onSort || !sort) return <th key={c.label || i}>{c.label}</th>;
                const on = sort.col === i;
                return (
                  <th key={c.label || i} aria-sort={on ? (sort.dir === 'desc' ? 'descending' : 'ascending') : 'none'}>
                    <button type="button" className="sortbtn" onClick={() => onSort(i)}>
                      {c.label}
                      <span className="car" aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <React.Fragment key={rowKey(r)}>
                {before?.(r, index)}
                <tr>
                  {cols.map((c, i) => (
                    <td key={c.label || i} data-l={c.label} className={[c.wrap && 'tdwrap', c.primary && 'tdp'].filter(Boolean).join(' ') || undefined}>
                      {/* One box for the value, so a name, its badge and icons stay together in the phone card. */}
                      <span className="tdv">{c.cell(r)}</span>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------- list page ------------------------------ */

/** A list's filters. Kept by the console per list, so they survive a visit to another page. */
export interface ListFilters {
  batch: string;
  type: string;
  q: string;
  page: number;
  pageSize: number;
  /** A column's sort key, or "" for the list's own order. */
  sort: string;
  dir: 'asc' | 'desc';
}
export const PAGE_SIZES = [25, 50, 100];
export const newFilters = (): ListFilters => ({ batch: '', type: '', q: '', page: 1, pageSize: 25, sort: '', dir: 'asc' });

/** The query string the paged APIs read. */
export const filterParams = (f: ListFilters, typeParam = 'type') => {
  const params = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) });
  if (f.batch) params.set('batch', f.batch);
  if (f.type) params.set(typeParam, f.type);
  if (f.q.trim()) params.set('q', f.q.trim());
  if (f.sort) {
    params.set('sort', f.sort);
    params.set('dir', f.dir);
  }
  return params;
};

/** One fetched page. */
export interface Paged<T> {
  data: T[];
  total: number;
  batches: Record<string, number>;
  types?: Record<string, number>;
}

/** A column that can be sorted by the server. */
export interface PagedColumn<T> extends Omit<Column<T>, 'sort'> {
  sortKey?: string;
}

export interface PagedListProps<T> {
  title: string;
  filters: ListFilters;
  onFilters: (next: ListFilters) => void;
  fetchPage: (f: ListFilters, signal?: AbortSignal) => Promise<Paged<T>>;
  /** Bump to fetch the same page again (after a delete or a change). */
  reload?: number;
  rowKey: (row: T) => string | number;
  cols: PagedColumn<T>[];
  /** Adds the Batch filter, listing every batch from 1940 when `allBatches`. */
  batch?: boolean;
  allBatches?: boolean;
  /** Adds a second filter; options may come from the page (e.g. pass types and their counts). */
  type?: { label: string; options: (page: Paged<T> | null) => OaOption[] };
  one: string;
  many: string;
  top?: React.ReactNode;
  emptyText?: string;
}

/**
 * The old portal's list page, fed a page at a time by the API: title with filters on the right, one
 * table, and page links. Search, filters and sorting run in the database.
 */
export function PagedList<T>(p: PagedListProps<T>) {
  const { filters: f, onFilters, fetchPage } = p;
  const [q, setQ] = useState(f.q);
  const [seenQ, setSeenQ] = useState(f.q);
  if (seenQ !== f.q) {
    setSeenQ(f.q);
    setQ(f.q);
  }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const key = JSON.stringify([f, p.reload ?? 0]);
  const [result, setResult] = useState<{ key: string; page: Paged<T> | null; error: string | null } | null>(null);
  const loading = result?.key !== key;

  useEffect(() => {
    // A newer request cancels this one (fast typing, quick page clicks).
    const abort = new AbortController();
    fetchPage(f, abort.signal).then(
      (page) => {
        if (abort.signal.aborted) return;
        setResult({ key, page, error: null });
      },
      (error) => {
        if (abort.signal.aborted) return;
        setResult((old) => ({ key, page: old?.page ?? null, error: error instanceof Error ? error.message : 'Could not load this list.' }));
      }
    );
    return () => abort.abort();
    // `key` covers the filters and reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // While the next page loads, the last one stays on screen, dimmed.
  const page = result?.page ?? null;
  const set = (patch: Partial<ListFilters>) => onFilters({ ...f, page: 1, ...patch });
  const typeSearch = (value: string) => {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => set({ q: value }), 300);
  };
  const onSort = (col: number) => {
    const sortKey = p.cols[col]?.sortKey;
    if (!sortKey) return;
    if (f.sort === sortKey) onFilters(f.dir === 'asc' ? { ...f, dir: 'desc', page: 1 } : { ...f, sort: '', dir: 'asc', page: 1 });
    else onFilters({ ...f, sort: sortKey, dir: 'asc', page: 1 });
  };

  const total = page?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / f.pageSize));
  // A page past the end (after deletes) moves back to the last one.
  const pastEnd = !!page && !loading && f.page > pages;
  useEffect(() => {
    if (pastEnd) onFilters({ ...f, page: pages });
  }, [pastEnd, pages, f, onFilters]);

  const active = !!(f.batch || f.type || f.q);
  const from = total ? (f.page - 1) * f.pageSize + 1 : 0;
  const to = Math.min(total, f.page * f.pageSize);
  const noun = total === 1 ? p.one : p.many;
  const sortIndex = p.cols.findIndex((c) => c.sortKey && c.sortKey === f.sort);
  const tableCols: Column<T>[] = p.cols.map((c) => ({ ...c, sort: c.sortKey ? () => 0 : undefined }));

  return (
    <>
      <PageHead title={p.title}>
        <form className="filters" onSubmit={(e) => e.preventDefault()} role="search">
          {p.batch && (
            <div className="ff">
              <span>Batch</span>
              <OaSelect
                value={f.batch}
                onChange={(batch) => set({ batch })}
                placeholder="All Batches"
                allowEmpty
                ariaLabel="Batch"
                options={batchOptions(page?.batches ?? {}, !!p.allBatches, f.batch)}
              />
            </div>
          )}
          {p.type && (
            <div className="ff">
              <span>{p.type.label}</span>
              <OaSelect value={f.type} onChange={(type) => set({ type })} placeholder="All" allowEmpty ariaLabel={p.type.label} options={p.type.options(page)} />
            </div>
          )}
          <Ff label="Search" grow>
            <span className="sbox">
              <input
                type="text"
                className="form-control"
                placeholder="Search name, email, mobile or ID"
                data-k="q"
                value={q}
                autoComplete="off"
                onChange={(e) => typeSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (timer.current) clearTimeout(timer.current);
                    set({ q });
                  }
                }}
              />
              <button
                type="button"
                className="sclear"
                aria-label="Clear the search"
                onClick={(e) => {
                  setQ('');
                  set({ q: '' });
                  (e.currentTarget.previousElementSibling as HTMLInputElement | null)?.focus();
                }}
              >
                &times;
              </button>
            </span>
          </Ff>
        </form>
      </PageHead>
      {p.top}
      <div className="lbar">
        <span className="count" aria-live="polite">
          {loading && !page ? 'Loading…' : total ? `Showing ${num(from)}–${num(to)} of ${num(total)}${active ? ' matching' : ''} ${noun}` : ''}
        </span>
        {active && (
          <button type="button" className="linkbtn clear" onClick={() => onFilters({ ...newFilters(), pageSize: f.pageSize, sort: f.sort, dir: f.dir })}>
            Clear filters
          </button>
        )}
      </div>
      {result?.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
      {!page ? (
        !result?.error && <TableSkeleton cols={p.cols.length} />
      ) : !page.data.length ? (
        active ? (
          <div className="empty">
            <b>Nothing matches</b>Try a different search, or clear the filters.
          </div>
        ) : (
          <p className="text-muted">{p.emptyText ?? 'There is no record.'}</p>
        )
      ) : (
        <>
          <div className={loading ? 'is-loading' : undefined} aria-busy={loading}>
            <DataTable cols={tableCols} rows={page.data} rowKey={p.rowKey} sort={{ col: sortIndex >= 0 ? sortIndex : null, dir: f.dir }} onSort={onSort} />
          </div>
          <div className="foot">
            <Pager page={f.page} pages={pages} onPage={(n) => onFilters({ ...f, page: n })} />
            <div className="psize">
              <span>Rows per page</span>
              <OaSelect
                value={String(f.pageSize)}
                onChange={(v) => set({ pageSize: Number(v) })}
                placeholder="25"
                ariaLabel="Rows per page"
                searchable={false}
                options={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

/** Page links: ‹ 1 … 4 5 6 … 20 ›. */
export const Pager: React.FC<{ page: number; pages: number; onPage: (page: number) => void }> = ({ page, pages, onPage }) => {
  if (pages <= 1) return <span />;
  const items: (number | 'gap')[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= 1) {
      const last = items[items.length - 1];
      if (typeof last === 'number' && n - last > 1) items.push('gap');
      items.push(n);
    }
  }
  const goTo = (n: number) => {
    onPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <nav className="pg" aria-label="Pages">
      <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
        ‹
      </button>
      {items.map((n, i) =>
        n === 'gap' ? (
          <span key={`g${i}`} aria-hidden="true">
            …
          </span>
        ) : (
          <button key={n} type="button" className={n === page ? 'on' : undefined} aria-current={n === page ? 'page' : undefined} onClick={() => goTo(n)}>
            {n}
          </button>
        )
      )}
      <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages} aria-label="Next page">
        ›
      </button>
    </nav>
  );
};

/** Grey rows while the first page loads. */
export const TableSkeleton: React.FC<{ cols: number; rows?: number }> = ({ cols, rows = 8 }) => (
  <div className="card tcard" aria-hidden="true">
    <div style={{ padding: '16px' }}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="skr" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 18, padding: '11px 0' }}>
          {Array.from({ length: cols }, (_, c) => (
            <span key={c} className="skeleton" style={{ width: `${55 + ((r + c) % 4) * 10}%` }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------- dialog -------------------------------- */

export interface DialogSpec {
  title: string;
  body: React.ReactNode;
  /** Without it, the dialog only has Close. */
  okLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onOk?: () => void | Promise<void>;
}

/** The one small window: a question with OK / Cancel, or information with Close. Focus stays inside it. */
export const Dialog: React.FC<{ spec: DialogSpec; onClose: () => void }> = ({ spec, onClose }) => {
  const box = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const from = document.activeElement as HTMLElement | null;
    const first = box.current?.querySelector<HTMLButtonElement>(spec.danger || !spec.okLabel ? '[data-x]' : '[data-ok]');
    first?.focus();
    return () => {
      if (from && document.body.contains(from)) from.focus();
    };
  }, [spec]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !busy) onClose();
    if (e.key !== 'Tab') return;
    const buttons = Array.from(box.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? []);
    if (!buttons.length) return;
    const [first, last] = [buttons[0], buttons[buttons.length - 1]];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const ok = async () => {
    if (!spec.onOk) return onClose();
    setBusy(true);
    try {
      await spec.onOk();
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <>
      <div className="scrim" onClick={() => !busy && onClose()} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="oa-dlg-t" onKeyDown={onKey}>
        <div className="modal-content" ref={box}>
          <h2 className="modal-title" id="oa-dlg-t">
            {spec.title}
          </h2>
          <div className="modal-body">{typeof spec.body === 'string' ? <p>{spec.body}</p> : spec.body}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-x="" onClick={onClose} disabled={busy}>
              {spec.okLabel ? (spec.cancelLabel ?? 'Cancel') : 'Close'}
            </button>
            {spec.okLabel && (
              <button type="button" className={`btn ${spec.danger ? 'btn-danger' : 'btn-primary'}`} data-ok="" onClick={ok} disabled={busy}>
                {busy ? 'Please wait…' : spec.okLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/** A key–value table, for one record. */
export const KeyValues: React.FC<{ rows: [string, React.ReactNode][] }> = ({ rows }) => (
  <div className="card">
    <table className="kv">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
