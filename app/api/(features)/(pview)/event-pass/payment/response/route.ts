import { eventPassBookingController } from "../../controller";

// CCAvenue posts both successful and cancelled payments here.
export const POST = (request: Request) => eventPassBookingController.paymentResponse(request);
