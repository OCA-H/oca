'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ListQuery, PagedList, PaymentSummary } from '../services';

/** Typing pauses this long before the search goes to the server. */
const SEARCH_DELAY_MS = 350;

/**
 * A records list fetched a page at a time: the page, status filter and search live here, and the
 * server does the filtering. Loads the first time the panel opens; changing the status or search
 * goes back to page 1. While a page loads, the one before stays on screen.
 */
export function usePagedList<T, S extends PaymentSummary>(load: (query: ListQuery) => Promise<PagedList<T, S>>, isActive: boolean) {
  const [page, setPage] = useState(1);
  const [status, setStatusState] = useState('');
  const [search, setSearchState] = useState('');
  const [q, setQ] = useState('');
  const [list, setList] = useState<PagedList<T, S> | null>(null);
  /** Bumped by reload, to fetch the same page again. */
  const [nonce, setNonce] = useState(0);
  /** The last request that finished, and its error if it failed. */
  const [settled, setSettled] = useState<{ key: string; error: string | null } | null>(null);
  const [hasOpened, setHasOpened] = useState(false);

  if (isActive && !hasOpened) setHasOpened(true);

  const key = `${page}|${status}|${q}|${nonce}`;

  useEffect(() => {
    if (!hasOpened) return;
    let isCurrent = true;
    load({ page, status, q })
      .then((result) => {
        if (!isCurrent) return;
        // A page past the end (the last record on it was confirmed away, say): show the last one there is.
        const lastPage = Math.max(1, Math.ceil(result.total / result.pageSize));
        if (result.data.length === 0 && page > lastPage) {
          setPage(lastPage);
          return;
        }
        setList(result);
        setSettled({ key, error: null });
      })
      .catch((err: unknown) => {
        if (isCurrent) setSettled({ key, error: err instanceof Error ? err.message : 'Could not load this list.' });
      });
    return () => {
      isCurrent = false;
    };
  }, [hasOpened, load, page, status, q, key]);

  const isLoading = hasOpened && settled?.key !== key;
  const error = settled?.key === key ? settled.error : null;

  useEffect(() => {
    const next = search.trim();
    if (next === q) return;
    const timer = setTimeout(() => {
      setQ(next);
      setPage(1);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search, q]);

  const setStatus = useCallback((value: string) => {
    setStatusState(value);
    setPage(1);
  }, []);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { list, error, isLoading, page, setPage, status, setStatus, search, setSearch: setSearchState, reload };
}

export default usePagedList;
