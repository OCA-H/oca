'use client';

import React from 'react';
import { useContact } from './ContactProvider';

// Links to the Secretariat, with the email and phone set in the admin panel (Settings → Contact
// details). Small client pieces, so the pages around them can stay server components.

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/** A mailto: link to the Secretariat, with the subject filled in; shows the address when it has no children. */
export const MailtoLink: React.FC<AnchorProps & { subject?: string }> = ({ subject, children, ...rest }) => {
  const contact = useContact();
  return (
    <a href={contact.mailto(subject)} {...rest}>
      {children ?? contact.email}
    </a>
  );
};

/** A tel: link to `phone` (any typed number), or to the Secretariat; shows the number when it has no children. */
export const TelLink: React.FC<AnchorProps & { phone?: string }> = ({ phone, children, ...rest }) => {
  const contact = useContact();
  const number = phone?.trim() || contact.phone;
  const href = `tel:${number.startsWith('+') ? '+' : ''}${number.replace(/\D/g, '')}`;
  return (
    <a href={href} {...rest}>
      {children ?? number}
    </a>
  );
};
