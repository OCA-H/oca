'use client';

import { useAuth } from '@/app/(view)/common/helper/useAuth';
import type { BirthdayMember } from '@/app/api/(features)/(pview)/birthday/schema';
import { birthdayWishGmailUrl } from '../helper';

/** Where each "Send Wishes" goes: a Gmail draft to the member, signed with the visitor's name when they are signed in. */
export function useBirthdaysHandler() {
  const { user } = useAuth();

  // Null for members with no email on file: there is nowhere to send a wish.
  const wishHref = (member: BirthdayMember): string | null =>
    member.email ? birthdayWishGmailUrl(member.email, member.name, user?.fullName) : null;

  return { wishHref };
}

export default useBirthdaysHandler;
