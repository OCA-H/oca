import { eventPassBookingController } from "@/app/api/features/sv/event-pass";

export const POST = (request: Request) => eventPassBookingController.checkout(request);
