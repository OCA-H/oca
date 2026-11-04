'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useAuth } from '@/app/(view)/common/helper/useAuth';
import { EMPTY_QUERY, findBatchmatesHelper, type BatchmateQuery } from '../helper';

/** Where the sign-in page sends the member back to. */
const BACK_HERE = `${ROUTES.FIND_YOUR_BATCHMATES}#search`;

/**
 * The directory search form. Results are for members only: a visitor who is not signed in is sent
 * to sign in first and brought back here. A signed-in member's search is sent to the Secretariat
 * until the directory opens (see services).
 */
export function useFindBatchmatesHandler() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [query, setQuery] = useState<BatchmateQuery>(EMPTY_QUERY);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof BatchmateQuery, value: string) => {
    setQuery((prev) => ({ ...prev, [key]: value }));
    setIsSent(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(BACK_HERE)}`);
      return;
    }
    if (!findBatchmatesHelper.hasQuery(query)) {
      setError('Enter a name or a batch year to search for.');
      return;
    }
    setIsSent(true);
  };

  return { query, setField, handleSubmit, isSent, error, isAuthenticated, isLoading };
}

export default useFindBatchmatesHandler;
