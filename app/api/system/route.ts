import { systemController } from "@/app/api/features/system/systemModule";

export const GET = (request: Request) => systemController.getStatus(request);
