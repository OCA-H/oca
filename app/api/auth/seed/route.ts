import { userController } from "@/app/api/features/sv/user";

export const POST = (request: Request) => userController.seed(request);
export const GET = (request: Request) => userController.seed(request);
