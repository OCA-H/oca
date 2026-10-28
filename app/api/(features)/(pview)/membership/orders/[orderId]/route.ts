import { membershipController } from "../../controller";

export const GET = async (request: Request, context: { params: Promise<{ orderId: string }> }) => {
  const { orderId } = await context.params;
  return membershipController.getOrder(request, orderId);
};
