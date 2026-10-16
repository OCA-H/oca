import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { EventPassService } from "../services/eventPassService";
import { EventPassRepository } from "../repository/eventPassRepository";

export class EventPassController extends BaseController {
  constructor(private readonly service: EventPassService) {
    super();
  }

  async listPasses(request: Request): Promise<Response> {
    return this.handle(async () => {
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || undefined;
      const status = url.searchParams.get("status") || undefined;
      const tierGroup = url.searchParams.get("tierGroup") || url.searchParams.get("tier_group") || undefined;

      const passes = await this.service.list({ eventName, status, tierGroup });
      return this.ok({ count: passes.length, data: passes });
    });
  }

  async getPass(request: Request, idOrPassId: string): Promise<Response> {
    return this.handle(async () => {
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || undefined;

      const pass = await this.service.get(idOrPassId, eventName);
      return this.ok({ data: pass });
    });
  }

  async createPass(request: Request): Promise<Response> {
    return this.handle(async () => {
      const body = await this.readJson(request);
      const pass = await this.service.create(body);
      return this.ok({ data: pass }, 201);
    });
  }

  async updatePass(request: Request, id: string): Promise<Response> {
    return this.handle(async () => {
      const numericId = Number(id);
      if (Number.isNaN(numericId) || numericId <= 0) {
        throw HttpError.badRequest("Invalid pass id.");
      }
      const body = await this.readJson(request);
      const pass = await this.service.update(numericId, body);
      return this.ok({ data: pass });
    });
  }

  async deletePass(_request: Request, id: string): Promise<Response> {
    return this.handle(async () => {
      const numericId = Number(id);
      if (Number.isNaN(numericId) || numericId <= 0) {
        throw HttpError.badRequest("Invalid pass id.");
      }
      await this.service.delete(numericId);
      return this.ok({ message: `Pass with id ${numericId} deleted successfully.` });
    });
  }

  async seedPasses(request: Request): Promise<Response> {
    return this.handle(async () => {
      const url = new URL(request.url);
      const eventName = url.searchParams.get("eventName") || url.searchParams.get("event_name") || "annual-dinner";
      const passes = await this.service.seed(eventName);
      return this.ok({ message: `Default passes for "${eventName}" seeded successfully.`, count: passes.length, data: passes });
    });
  }
}

export const eventPassRepository = new EventPassRepository();
export const eventPassService = new EventPassService(eventPassRepository);
export const eventPassController = new EventPassController(eventPassService);

