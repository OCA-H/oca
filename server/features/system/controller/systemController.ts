import "server-only";
import { BaseController } from "@/server/core/baseController";
import type { SystemService } from "../service/systemService";

export class SystemController extends BaseController {
  private readonly service: SystemService;

  constructor(service: SystemService) {
    super();
    this.service = service;
  }

  /** GET /api/system - Returns server and database status */
  getStatus(_request: Request) {
    return this.handle(async () => {
      const status = await this.service.getServerStatus();
      return this.ok(status, 200);
    });
  }
}
