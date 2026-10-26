import { membershipController } from "@/app/api/features/(pview)/membership";

export const GET = async (request: Request, context: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await context.params;
  return membershipController.getOrder(request, orderId);
};
