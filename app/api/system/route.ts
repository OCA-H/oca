import { systemController } from "@/server/features/system/module/systemModule";

export const GET = (request: Request) => systemController.getStatus(request);
