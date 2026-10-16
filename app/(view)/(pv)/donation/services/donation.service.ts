import { donationContent } from '../content/donation.content';

export const donationService = {
  getContent() {
    return donationContent;
  },
  getHeads() {
    return donationContent.heads;
  },
  getPaymentOptions() {
    return donationContent.paymentOptions;
  },
};

export default donationService;
