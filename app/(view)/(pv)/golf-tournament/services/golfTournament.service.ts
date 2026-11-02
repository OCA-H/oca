import { annualDinnerService, type ApiEventPass } from '@/app/(view)/(pv)/annual-dinner/services/annualDinner.service';
import { GOLF_EVENT } from '../content/golfTournament.content';

export { PassCheckoutError } from '@/app/(view)/(pv)/annual-dinner/services/annualDinner.service';

/** The golf passes go through the same event-pass API as the dinner's, under their own event name. */
export const golfTournamentService = {
  getPasses: (): Promise<ApiEventPass[]> => annualDinnerService.getPasses(GOLF_EVENT),

  /** Prices and stores the booking on the server; returns what the browser posts to CCAvenue. */
  checkout: (passId: string, spouseName?: string) =>
    annualDinnerService.checkout({ eventName: GOLF_EVENT, passId, spouseName, teachers: 0, under12: 0, above12: 0 }),

  redirectToGateway: annualDinnerService.redirectToGateway,
};
