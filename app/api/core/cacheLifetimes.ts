import "server-only";

// How long cached reads of the database live. Every regeneration of a page is written to Vercel's
// cache, and that transfer counts against Fast Origin Transfer, so a page should regenerate when
// its content changes (tags are revalidated on save, on payment, on a pass edit), not on a timer.
// A page regenerates as often as the shortest-lived cached read it uses, so each read sets one.

/**
 * While the database cannot be read, a cached read falls back to defaults and is retried after
 * this: soon enough that the real content returns shortly after the database, without rebuilding
 * every page every minute during an outage.
 */
export const DB_FALLBACK_LIFE = { stale: 300, revalidate: 600, expire: 3600 } as const;
