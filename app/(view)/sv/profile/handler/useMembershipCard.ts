'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { profileService, type MembershipCard } from '../services';

/**
 * Loads the e-Membership Card the first time its panel is open, and again after `refresh`
 * (when My Account saves a new name or batch). A refresh keeps the current card on screen
 * and swaps in the new one, so only the very first load shows the skeleton. A new `sessionKey`
 * (after a sign-out) drops the card entirely, so one member never sees the last member's card.
 */
export function useMembershipCard(isActive: boolean, sessionKey: number) {
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const loadedKey = useRef<string | null>(null);

  // Signed out and back in: forget the previous member's card before showing anything.
  const [cardSession, setCardSession] = useState(sessionKey);
  if (cardSession !== sessionKey) {
    setCardSession(sessionKey);
    setCard(null);
    setError(null);
  }

  useEffect(() => {
    const key = `${sessionKey}:${version}`;
    if (!isActive || loadedKey.current === key) return;
    loadedKey.current = key;
    let isCurrent = true;
    let isDone = false;

    profileService
      .getCard()
      .then((data) => {
        if (!isCurrent) return;
        setCard(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (isCurrent) setError(err instanceof Error ? err.message : 'We could not load your membership card.');
      })
      .finally(() => {
        isDone = true;
      });

    return () => {
      isCurrent = false;
      // Left the panel before the answer came: ask again next time it opens.
      if (!isDone) loadedKey.current = null;
    };
  }, [isActive, version, sessionKey]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const retry = useCallback(() => {
    setError(null);
    setVersion((v) => v + 1);
  }, []);

  return {
    card,
    // A failed refresh keeps the card it already has, so the error only matters without one.
    error: card ? null : error,
    isLoading: isActive && !card && !error,
    retry,
    refresh,
  };
}

export default useMembershipCard;
