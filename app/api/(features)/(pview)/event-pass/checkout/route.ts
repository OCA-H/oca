import { eventPassBookingController } from "../controller";

export const POST = (request: Request) => eventPassBookingController.checkout(request);
