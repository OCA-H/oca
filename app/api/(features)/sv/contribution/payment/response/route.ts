import { contributionController } from "../../controller";
import { paymentCheckController } from "@/app/api/(features)/(pview)/payments/controller";

// CCAvenue posts both successful and cancelled payments here.
// Every payment visit also settles, in the background, orders whose browser never came back.
export const POST = (request: Request) => {
  paymentCheckController.checkSoon(request);
  return contributionController.paymentResponse(request);
};
