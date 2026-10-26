import { userController } from "@/app/api/features/sv/user";

export const POST = (request: Request) => userController.resetPassword(request);
