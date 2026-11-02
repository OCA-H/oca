import { paymentCheckController } from "@/app/api/(features)/(pview)/payments/controller";
import { eventPassAdminController } from "../controller";

// Opening the bookings also settles, in the background, orders whose browser never came back.
export const GET = (request: Request) => {
  paymentCheckController.checkSoon(request);
  return eventPassAdminController.listBookings(request, undefined);
};
