import { executiveCommitteeContent } from '../content/executiveCommittee.content';

// The committee terms themselves come from the admin panel: see getCommitteeContent.
export const executiveCommitteeService = {
  getContent() {
    return executiveCommitteeContent;
  },
};

export default executiveCommitteeService;
