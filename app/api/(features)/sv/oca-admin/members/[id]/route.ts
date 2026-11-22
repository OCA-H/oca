import { memberAdminController } from "../../controller";

export const GET = memberAdminController.getMember;
export const PATCH = memberAdminController.updateMember;
export const DELETE = memberAdminController.deleteMember;
