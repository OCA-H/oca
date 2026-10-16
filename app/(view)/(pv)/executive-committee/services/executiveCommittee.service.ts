import { executiveCommitteeContent, CommitteeTerm } from '../content/executiveCommittee.content';

export const executiveCommitteeService = {
  getContent() {
    return executiveCommitteeContent;
  },
  getTerms(): CommitteeTerm[] {
    return executiveCommitteeContent.terms;
  },
  getCurrentTerm(): CommitteeTerm | undefined {
    return executiveCommitteeContent.terms.find((t) => t.isCurrent);
  },
  getTermById(id: string): CommitteeTerm | undefined {
    return executiveCommitteeContent.terms.find((t) => t.id === id);
  },
};

export default executiveCommitteeService;
