import type { HomeCommitteeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { CommitteeTerm } from '../content/executiveCommittee.content';

/**
 * The current term with its office bearers taken from the admin panel (About → Executive Committee).
 * Batch, email and profession aren't edited there, so they're kept from the bearer of the same name.
 */
export function withAdminOfficeBearers(term: CommitteeTerm, committee?: HomeCommitteeContent): CommitteeTerm {
  if (!term.isCurrent || !committee?.members?.length) return term;
  return {
    ...term,
    officeBearers: committee.members.map((member) => {
      const known = term.officeBearers.find((b) => b.name.trim().toLowerCase() === member.name.trim().toLowerCase());
      return {
        ...known,
        name: member.name,
        role: member.role.toUpperCase(),
        batch: known?.batch ?? '',
        photo: member.image || undefined,
        photoAlt: member.imageAlt || undefined,
        initials: member.initials || undefined,
      };
    }),
  };
}

export function getTermAnchor(termId: string): string {
  return `#${termId}`;
}

export function formatEmailLink(email: string): string {
  return `mailto:${email}`;
}

export function findTermById(terms: CommitteeTerm[], id: string): CommitteeTerm | undefined {
  return terms.find((term) => term.id === id);
}
