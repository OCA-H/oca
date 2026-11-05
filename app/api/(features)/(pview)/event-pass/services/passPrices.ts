import "server-only";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { DB_FALLBACK_LIFE } from "@/app/api/core/cacheLifetimes";
import { EventPassRepository } from "../repository/eventPassRepository";

/** Refreshed whenever an admin changes a pass (see refreshPassPrices). */
export const PASS_PRICES_TAG = "event-pass-prices";

/** What an event page's "at a glance" box shows of each pass. */
export interface PassPrice {
  passId: string;
  tierGroup: string;
  tierTitle: string;
  title: string;
  batchEligibility: string | null;
  price: number;
  status: string;
}

/**
 * An event's passes and prices for its page, cached so the page still prerenders. Returns none if
 * the database cannot be read, so the page falls back to its typed-in prices instead of failing.
 */
export async function getPassPrices(eventName: string): Promise<PassPrice[]> {
  "use cache";
  cacheTag(PASS_PRICES_TAG);
  // Refreshed whenever an admin changes a pass, so a long life only spares needless rebuilds.
  cacheLife("days");

  try {
    const passes = await new EventPassRepository().findAll({ eventName });
    return passes.map(({ passId, tierGroup, tierTitle, title, batchEligibility, price, status }) => ({
      passId,
      tierGroup,
      tierTitle,
      title,
      batchEligibility,
      price,
      status,
    }));
  } catch (error) {
    console.error(`Could not load "${eventName}" pass prices; the page is showing the typed-in prices.`, error);
    cacheLife(DB_FALLBACK_LIFE);
    return [];
  }
}

/** After a pass changes: expire: 0 shows the new prices on the next visit. */
export const refreshPassPrices = () => revalidateTag(PASS_PRICES_TAG, { expire: 0 });
