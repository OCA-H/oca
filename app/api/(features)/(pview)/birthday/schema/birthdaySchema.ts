/** A member whose birthday is today, as the home page shows them. */
export interface BirthdayMember {
  id: number;
  /** "Rohan Kapoor": the name without its title. */
  name: string;
  batchYear: string | null;
  /** Where "Send Wishes" writes to; anyone visiting the home page can send one. Null hides the button. */
  email: string | null;
}
