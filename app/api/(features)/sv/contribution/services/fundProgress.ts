import "server-only";
import { cacheLife, cacheTag } from "next/cache";
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
  cacheLife("hours");

  try {
    return await new ContributionRepository().paidTotalsByFund();
  } catch (error) {
    console.error("Could not load fund totals; the home page is showing the typed-in figures.", error);
    cacheLife("minutes");
    return [];
  }
}
