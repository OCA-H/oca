export function noop() {}

/**
 * DatePicker settings for a date of birth, matching what the server accepts: 1900 up to today.
 * With nothing chosen, the calendar opens 35 years back, around a typical member's birth year.
 */
export const DATE_OF_BIRTH_PICKER = { min: '1900-01-01', max: 'today', openToYearsAgo: 35 } as const;

/** "1985-03-24" → "24 March 1985", or "" when there is no date. */
export function formatDateOfBirth(value: string | null | undefined): string {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return '';
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
