import { eventPassBookingController } from "@/app/api/features/sv/event-pass";

export const GET = async (request: Request, context: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await context.params;
  return eventPassBookingController.getOrder(request, orderId);
};
