import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { SystemService } from "../services/systemService";
import { SystemRepository } from "../repository/systemRepository";

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

export const systemRepository = new SystemRepository();
export const systemService = new SystemService(systemRepository);
export const systemController = new SystemController(systemService);
