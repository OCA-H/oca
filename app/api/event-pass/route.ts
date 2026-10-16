import { eventPassController } from "@/app/api/features/sv/event-pass";

export const GET = (request: Request) => eventPassController.listPasses(request);
export const POST = (request: Request) => eventPassController.createPass(request);
