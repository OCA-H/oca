import { userController } from "@/app/api/features/sv/user";

export const GET = (request: Request) => userController.me(request);

