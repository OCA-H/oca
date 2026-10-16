import "server-only";
import { HttpError, type FieldErrors } from "@/app/api/core/httpError";
import { EventPassRepository, type EventPassFilter } from "../repository/eventPassRepository";
import type { EventPass, NewEventPass } from "../schema/eventPassSchema";

export class EventPassService {
  constructor(private readonly repository: EventPassRepository) {}

  async list(filter?: EventPassFilter): Promise<EventPass[]> {
    // If requesting annual-dinner (or all) and no records exist yet, auto-seed defaults so the UI is ready
    if (!filter?.eventName || filter.eventName === "annual-dinner") {
      const existing = await this.repository.findAll({ eventName: "annual-dinner" });
      if (existing.length === 0) {
        await this.repository.seedDefaultAnnualDinnerPasses();
      }
    }

    return await this.repository.findAll(filter);
  }

  async get(idOrPassId: string, eventName?: string): Promise<EventPass> {
    const numericId = Number(idOrPassId);
    if (!Number.isNaN(numericId) && numericId > 0) {
      const pass = await this.repository.findById(numericId);
      if (!pass) throw HttpError.notFound(`Pass with id ${numericId} not found.`);
      return pass;
    }

    // Try finding by pass_id and optional eventName
    const resolvedEventName = eventName || "annual-dinner";
    const pass = await this.repository.findByPassId(resolvedEventName, idOrPassId);
    if (!pass) {
      throw HttpError.notFound(`Pass with pass_id "${idOrPassId}" for event "${resolvedEventName}" not found.`);
    }
    return pass;
  }

  async create(payload: Record<string, unknown>): Promise<EventPass> {
    const fields: FieldErrors = {};

    const eventName = typeof payload.eventName === "string" ? payload.eventName.trim() : "";
    if (!eventName) fields.eventName = "Event name is required.";

    const passId = typeof payload.passId === "string" ? payload.passId.trim() : "";
    if (!passId) fields.passId = "Pass ID is required.";

    const tierGroup = typeof payload.tierGroup === "string" ? payload.tierGroup.trim() : "";
    if (!tierGroup) fields.tierGroup = "Tier group is required.";

    const tierTitle = typeof payload.tierTitle === "string" ? payload.tierTitle.trim() : "";
    if (!tierTitle) fields.tierTitle = "Tier title is required.";

    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    if (!title) fields.title = "Title is required.";

    const label = typeof payload.label === "string" ? payload.label.trim() : "";
    if (!label) fields.label = "Label is required.";

    const price = typeof payload.price === "number" ? payload.price : Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      fields.price = "Price must be a non-negative number.";
    }

    if (Object.keys(fields).length > 0) {
      throw HttpError.badRequest("Invalid pass details.", fields);
    }

    // Check duplicate
    const existing = await this.repository.findByPassId(eventName, passId);
    if (existing) {
      throw HttpError.conflict(`A pass with pass_id "${passId}" already exists for event "${eventName}".`);
    }

    const newPassData: NewEventPass = {
      eventName,
      passId,
      tierGroup,
      tierTitle,
      title,
      label,
      description: typeof payload.description === "string" ? payload.description : null,
      batchEligibility: typeof payload.batchEligibility === "string" ? payload.batchEligibility : null,
      price,
      originalPrice: typeof payload.originalPrice === "number" ? payload.originalPrice : null,
      currency: typeof payload.currency === "string" ? payload.currency : "INR",
      totalQuantity: typeof payload.totalQuantity === "number" ? payload.totalQuantity : null,
      availableQuantity: typeof payload.availableQuantity === "number" ? payload.availableQuantity : null,
      includesSpouse: Boolean(payload.includesSpouse),
      allowsChildren: Boolean(payload.allowsChildren),
      allowsTeacherSponsorship: payload.allowsTeacherSponsorship !== undefined ? Boolean(payload.allowsTeacherSponsorship) : true,
      status: typeof payload.status === "string" ? payload.status : "active",
      statusNote: typeof payload.statusNote === "string" ? payload.statusNote : null,
      displayOrder: typeof payload.displayOrder === "number" ? payload.displayOrder : 0,
      metadata: payload.metadata && typeof payload.metadata === "object" ? (payload.metadata as Record<string, unknown>) : null,
    };

    return await this.repository.create(newPassData);
  }

  async update(id: number, payload: Record<string, unknown>): Promise<EventPass> {
    const existing = await this.repository.findById(id);
    if (!existing) throw HttpError.notFound(`Pass with id ${id} not found.`);

    const updateData: Partial<NewEventPass> = {};

    if (payload.title !== undefined && typeof payload.title === "string") updateData.title = payload.title;
    if (payload.label !== undefined && typeof payload.label === "string") updateData.label = payload.label;
    if (payload.description !== undefined) updateData.description = typeof payload.description === "string" ? payload.description : null;
    if (payload.batchEligibility !== undefined) updateData.batchEligibility = typeof payload.batchEligibility === "string" ? payload.batchEligibility : null;
    if (payload.tierGroup !== undefined && typeof payload.tierGroup === "string") updateData.tierGroup = payload.tierGroup;
    if (payload.tierTitle !== undefined && typeof payload.tierTitle === "string") updateData.tierTitle = payload.tierTitle;
    if (payload.price !== undefined) {
      const price = Number(payload.price);
      if (Number.isNaN(price) || price < 0) throw HttpError.badRequest("Price must be a non-negative number.");
      updateData.price = price;
    }
    if (payload.originalPrice !== undefined) updateData.originalPrice = Number(payload.originalPrice);
    if (payload.totalQuantity !== undefined) updateData.totalQuantity = Number(payload.totalQuantity);
    if (payload.availableQuantity !== undefined) updateData.availableQuantity = Number(payload.availableQuantity);
    if (payload.includesSpouse !== undefined) updateData.includesSpouse = Boolean(payload.includesSpouse);
    if (payload.allowsChildren !== undefined) updateData.allowsChildren = Boolean(payload.allowsChildren);
    if (payload.allowsTeacherSponsorship !== undefined) updateData.allowsTeacherSponsorship = Boolean(payload.allowsTeacherSponsorship);
    if (payload.status !== undefined && typeof payload.status === "string") updateData.status = payload.status;
    if (payload.statusNote !== undefined) updateData.statusNote = typeof payload.statusNote === "string" ? payload.statusNote : null;
    if (payload.displayOrder !== undefined) updateData.displayOrder = Number(payload.displayOrder);
    if (payload.metadata !== undefined && typeof payload.metadata === "object") {
      updateData.metadata = payload.metadata as Record<string, unknown>;
    }

    const updated = await this.repository.update(id, updateData);
    if (!updated) throw HttpError.notFound(`Could not update pass with id ${id}.`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw HttpError.notFound(`Pass with id ${id} not found.`);
    await this.repository.delete(id);
  }

  async seed(eventName?: string): Promise<EventPass[]> {
    if (!eventName || eventName === "annual-dinner") {
      return await this.repository.seedDefaultAnnualDinnerPasses();
    }
    return [];
  }
}
