import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { DB_FALLBACK_LIFE } from "@/app/api/core/cacheLifetimes";
import { ContributionRepository } from "../repository/contributionRepository";
import type { FundProgress } from "../schema/contributionSchema";

/** Refreshed whenever a contribution is paid (see ContributionService.handleGatewayResponse). */
export const FUND_PROGRESS_TAG = "fund-progress";

/**
 * Every fund's paid total for the home page, cached so the page still prerenders. Shows no
 * totals if the database cannot be read, so the home page never fails because of it.
 */
export async function getFundProgress(): Promise<FundProgress[]> {
  "use cache";
  cacheTag(FUND_PROGRESS_TAG);
  // Refreshed on every paid contribution, so a long life only spares needless rebuilds.
  cacheLife("days");

  try {
    return await new ContributionRepository().paidTotalsByFund();
  } catch (error) {
    console.error("Could not load fund totals; the home page is showing the typed-in figures.", error);
    cacheLife(DB_FALLBACK_LIFE);
    return [];
  }
}
