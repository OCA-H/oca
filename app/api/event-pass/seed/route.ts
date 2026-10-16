import { eventPassController } from "@/app/api/features/sv/event-pass";

export const POST = (request: Request) => eventPassController.seedPasses(request);
