import "server-only";
import { cacheLife } from "next/cache";
import { todayInIndia } from "@/app/api/core/dateOfBirth";
import { UserRepository } from "@/app/api/(features)/(pview)/auth/repository/userRepository";
import type { User } from "@/app/api/(features)/(pview)/auth/schema/userSchema";
import type { BirthdayMember } from "../schema/birthdaySchema";

/** India is UTC+5:30 all year, so its midnight is a fixed offset from UTC's. */
const INDIA_OFFSET_SECONDS = 5.5 * 60 * 60;
const DAY_SECONDS = 24 * 60 * 60;
/** A cache that expires in under 5 minutes is left out of the prerender, so never go below this. */
const MIN_EXPIRE_SECONDS = 10 * 60;

const secondsUntilMidnightInIndia = () =>
  DAY_SECONDS - ((Math.floor(Date.now() / 1000) + INDIA_OFFSET_SECONDS) % DAY_SECONDS);

/**
 * The days of the year whose members celebrate on `today` ("2027-02-28"). In a year without
 * 29 February, those born on it celebrate on the 28th.
 */
function birthdaysOn(today: string): Array<{ month: number; day: number }> {
  const [year, month, day] = today.split("-").map(Number);
  const days = [{ month, day }];
  const isLeapYear = new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1;
  if (month === 2 && day === 28 && !isLeapYear) days.push({ month: 2, day: 29 });
  return days;
}

/** "Rohan Kapoor": the name parts the profile form saved, else fullName without a title like "Mr.". */
function displayName(user: User): string {
  const saved = (user.metadata?.name ?? {}) as Record<string, unknown>;
  const parts = [saved.firstName, saved.lastName].filter((part): part is string => typeof part === "string" && part.trim() !== "");
  if (parts.length > 0) return parts.map((part) => part.trim()).join(" ");
  return user.fullName.trim().replace(/^\S+\.\s+/, "");
}

const toMember = (user: User): BirthdayMember => ({
  id: user.id,
  name: displayName(user),
  batchYear: user.batchYear,
  email: user.email,
});

/**
 * Today's birthdays for the home page, cached until midnight in India so the page still
 * prerenders. Shows no one if the database cannot be read, so the home page never fails because of it.
 */
export async function getTodaysBirthdays(): Promise<BirthdayMember[]> {
  "use cache";
  const expire = Math.max(secondsUntilMidnightInIndia(), MIN_EXPIRE_SECONDS);
  // Refreshed hourly as well, so a date of birth saved today shows up the same day.
  cacheLife({ revalidate: Math.min(60 * 60, expire - 60), expire });

  try {
    return (await new UserRepository().findActiveBornOn(birthdaysOn(todayInIndia()))).map(toMember);
  } catch (error) {
    console.error("Could not load today's birthdays; the home page is showing none.", error);
    cacheLife("minutes");
    return [];
  }
}
