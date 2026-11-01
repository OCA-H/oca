import type { CommitteeContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { CommitteeTerm } from '../content/executiveCommittee.content';

/** "2025 – 2027" → "ec-2025-27", the anchor the jump links use; `ec-<n>` if there are no years in it. */
function termId(period: string, index: number): string {
  const years = period.match(/(\d{4})\D+(\d{2,4})/);
  return years ? `ec-${years[1]}-${years[2].slice(-2)}` : `ec-${index + 1}`;
}

/** The terms as set in the admin panel (About → Executive Committee), ready to render: the first is the current one. */
export function toCommitteeTerms(content: CommitteeContent): CommitteeTerm[] {
  const used = new Set<string>();
  return (content.terms ?? []).map((term, index) => {
    const isCurrent = index === 0;
    let id = termId(term.period, index);
    if (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);

    return {
      id,
      jumpLabel: term.period,
      isCurrent,
      eyebrow: term.eyebrow || (isCurrent ? 'Current committee' : 'Previous committee'),
      title: term.title || `Executive Committee of ${term.period}`,
      pill: term.pill || (isCurrent ? 'Current term' : undefined),
      isFourColumns: term.officeBearers.length >= 4,
      officeBearers: term.officeBearers.map((bearer) => ({
        name: bearer.name,
        role: bearer.role,
        roleSub: bearer.roleSub || undefined,
        batch: bearer.batch,
        profession: bearer.profession || undefined,
        email: bearer.email || undefined,
        photo: bearer.image || undefined,
        photoAlt: bearer.imageAlt || undefined,
        initials: bearer.initials || undefined,
      })),
      members: term.members.map((member) => ({
        name: member.name,
        role: member.role,
        roleSub: member.roleSub || undefined,
        batch: member.batch,
        profession: member.profession || undefined,
        email: member.email || undefined,
      })),
    };
  });
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
