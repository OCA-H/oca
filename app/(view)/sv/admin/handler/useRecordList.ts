'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A list of records for a record panel (passes, bookings): loads the first time the panel opens,
 * then stays, so moving between panels does not refetch. `reload` fetches it again.
 */
export function useRecordList<T>(load: () => Promise<T[]>, isActive: boolean) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasRequested = useRef(false);

  const reload = useCallback(() => {
    setError(null);
    setIsLoading(true);
    load()
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load this list.'))
      .finally(() => setIsLoading(false));
  }, [load]);

  useEffect(() => {
    if (!isActive || hasRequested.current) return;
    hasRequested.current = true;
    reload();
  }, [isActive, reload]);

  return { items, setItems, error, isLoading, reload };
}

export default useRecordList;
