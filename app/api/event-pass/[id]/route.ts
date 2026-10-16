import { eventPassController } from "@/app/api/features/sv/event-pass";

export const GET = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return eventPassController.getPass(request, id);
};

export const PATCH = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return eventPassController.updatePass(request, id);
};

export const DELETE = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  return eventPassController.deletePass(request, id);
};
