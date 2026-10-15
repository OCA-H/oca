import { eventPassController } from "@/app/api/features/event-pass/eventPassModule";

export const GET = (request: Request) => eventPassController.listPasses(request);
export const POST = (request: Request) => eventPassController.createPass(request);
