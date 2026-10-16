import { CommitteeTerm } from '../content/executiveCommittee.content';

export function getTermAnchor(termId: string): string {
  return `#${termId}`;
}

export function formatEmailLink(email: string): string {
  return `mailto:${email}`;
}

export function findTermById(terms: CommitteeTerm[], id: string): CommitteeTerm | undefined {
  return terms.find((term) => term.id === id);
}
