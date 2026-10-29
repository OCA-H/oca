// Date of birth, as the membership form and My Account send it: an ISO calendar date, "1985-03-24".

/** The earliest date of birth accepted. */
export const EARLIEST_DATE_OF_BIRTH = "1900-01-01";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today as "YYYY-MM-DD" in India, where the members and the Secretariat are. */
export const todayInIndia = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** True for a real calendar date, so "1985-02-30" is caught rather than rolled over into March. */
function isCalendarDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Why a date of birth is not acceptable, or null when it is. An empty value is left to the caller. */
export function dateOfBirthError(value: string): string | null {
  if (!isCalendarDate(value)) return "Choose your date of birth from the calendar.";
  if (value < EARLIEST_DATE_OF_BIRTH) return "Please check the year of your date of birth.";
  if (value > todayInIndia()) return "Your date of birth can’t be in the future.";
  return null;
}
