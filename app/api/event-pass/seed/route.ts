import { eventPassController } from "@/app/api/features/event-pass/eventPassModule";

export const POST = (request: Request) => eventPassController.seedPasses(request);
