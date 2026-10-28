import { eventPassBookingController } from "@/app/api/features/sv/event-pass";

// CCAvenue posts both successful and cancelled payments here.
export const POST = (request: Request) => eventPassBookingController.paymentResponse(request);
