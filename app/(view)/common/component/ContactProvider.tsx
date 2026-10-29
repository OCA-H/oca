'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { phoneHref, type ContactDetailsContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { CONTACT_DEFAULTS } from '@/app/api/(features)/(pview)/site/services/siteDefaults';

// The Association's contact details, set in the admin panel (Settings → Contact details). The root
// layout reads them once on the server and hands them down here, so every page and its footer
// show the same email, phone and address without fetching them again.

const ContactContext = createContext<ContactDetailsContent>(CONTACT_DEFAULTS);

export const ContactProvider: React.FC<{ contact: ContactDetailsContent; children: React.ReactNode }> = ({ contact, children }) => (
  <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>
);

/** The contact details, with ready-made tel:, mailto: and map links. */
export function useContact() {
  const contact = useContext(ContactContext);
  return useMemo(
    () => ({
      ...contact,
      tel: phoneHref(contact.phone),
      /** The address on Google Maps. */
      map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
      /** "mailto:info@…", with the subject filled in when given. */
      mailto: (subject?: string) => `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`,
    }),
    [contact]
  );
}
