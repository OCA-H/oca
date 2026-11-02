import { eventPassBookingController } from "../controller";
import { paymentCheckController } from "@/app/api/(features)/(pview)/payments/controller";

// Every payment visit also settles, in the background, orders whose browser never came back.
export const POST = (request: Request) => {
  paymentCheckController.checkSoon(request);
  return eventPassBookingController.checkout(request);
};
