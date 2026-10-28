import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import { eventPasses, type EventPass, type NewEventPass } from "../schema/eventPassSchema";

export interface EventPassFilter {
  eventName?: string;
  status?: string;
  tierGroup?: string;
}

export const DEFAULT_ANNUAL_DINNER_PASSES: NewEventPass[] = [
  {
    eventName: "annual-dinner",
    passId: "yb-single",
    tierGroup: "younger",
    tierTitle: "Younger Batches",
    title: "Single",
    label: "Younger Batches · Single",
    description: "Single pass for alumni from batch 2015 to 2025",
    batchEligibility: "Batch 2015–25 only",
    price: 2500,
    currency: "INR",
    totalQuantity: 100,
    availableQuantity: 100,
    includesSpouse: false,
    allowsChildren: false,
    allowsTeacherSponsorship: true,
    status: "active",
    statusNote: "100 left",
    displayOrder: 1,
    metadata: {
      teacherSponsorPrice: 5000,
    },
  },
  {
    eventName: "annual-dinner",
    passId: "yb-spouse",
    tierGroup: "younger",
    tierTitle: "Younger Batches",
    title: "With spouse",
    label: "Younger Batches · With spouse",
    description: "Couple pass for alumni from batch 2015 to 2025 and spouse",
    batchEligibility: "Batch 2015–25 only",
    price: 4000,
    currency: "INR",
    totalQuantity: 50,
    availableQuantity: 50,
    includesSpouse: true,
    allowsChildren: false,
    allowsTeacherSponsorship: true,
    status: "active",
    statusNote: "50 left",
    displayOrder: 2,
    metadata: {
      teacherSponsorPrice: 5000,
    },
  },
  {
    eventName: "annual-dinner",
    passId: "eb-single",
    tierGroup: "early",
    tierTitle: "Early Bird",
    title: "Single",
    label: "Early Bird · Single",
    description: "Discounted early bird ticket for all alumni batches",
    batchEligibility: "All batches",
    price: 3500,
    currency: "INR",
    totalQuantity: 100,
    availableQuantity: 100,
    includesSpouse: false,
    allowsChildren: false,
    allowsTeacherSponsorship: true,
    status: "active",
    statusNote: "100 left",
    displayOrder: 3,
    metadata: {
      teacherSponsorPrice: 5000,
    },
  },
  {
    eventName: "annual-dinner",
    passId: "eb-spouse",
    tierGroup: "early",
    tierTitle: "Early Bird",
    title: "With spouse",
    label: "Early Bird · With spouse",
    description: "Discounted early bird ticket for alumni and spouse, all batches",
    batchEligibility: "All batches",
    price: 5000,
    currency: "INR",
    totalQuantity: 50,
    availableQuantity: 50,
    includesSpouse: true,
    allowsChildren: false,
    allowsTeacherSponsorship: true,
    status: "active",
    statusNote: "50 left",
    displayOrder: 4,
    metadata: {
      teacherSponsorPrice: 5000,
    },
  },
  {
    eventName: "annual-dinner",
    passId: "regular",
    tierGroup: "regular",
    tierTitle: "Regular",
    title: "Regular",
    label: "Regular",
    description: "Regular passes open once every Early Bird pass has been taken. Pricing is shown when they open.",
    batchEligibility: "All batches · opens after Early Bird",
    price: 0,
    currency: "INR",
    totalQuantity: 150,
    availableQuantity: 150,
    includesSpouse: false,
    allowsChildren: false,
    allowsTeacherSponsorship: true,
    status: "locked",
    statusNote: "Opens after Early Bird",
    displayOrder: 5,
    metadata: {
      note: "Regular passes open once every Early Bird pass has been taken. Pricing is shown when they open.",
      teacherSponsorPrice: 5000,
    },
  },
  {
    eventName: "annual-dinner",
    passId: "golden",
    tierGroup: "golden",
    tierTitle: "Golden Pass",
    title: "With spouse",
    label: "Golden Pass · With spouse",
    description: "Golden pass with spouse and privileges to bring children under/above 12",
    batchEligibility: "All batches · with spouse",
    price: 15000,
    currency: "INR",
    totalQuantity: 30,
    availableQuantity: 30,
    includesSpouse: true,
    allowsChildren: true,
    allowsTeacherSponsorship: true,
    status: "active",
    statusNote: "With spouse",
    displayOrder: 6,
    metadata: {
      perks: ["Add children, under or above 12"],
      childUnder12Price: 2500,
      childAbove12Price: 3000,
      teacherSponsorPrice: 5000,
    },
  },
];

export class EventPassRepository extends BaseRepository {
  async findAll(filter?: EventPassFilter): Promise<EventPass[]> {
    const conditions = [];

    if (filter?.eventName) {
      conditions.push(eq(eventPasses.eventName, filter.eventName));
    }
    if (filter?.status) {
      conditions.push(eq(eventPasses.status, filter.status));
    }
    if (filter?.tierGroup) {
      conditions.push(eq(eventPasses.tierGroup, filter.tierGroup));
    }

    const query = this.db
      .select()
      .from(eventPasses)
      .orderBy(asc(eventPasses.displayOrder), asc(eventPasses.id));

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async findById(id: number): Promise<EventPass | null> {
    const results = await this.db
      .select()
      .from(eventPasses)
      .where(eq(eventPasses.id, id))
      .limit(1);

    return results[0] ?? null;
  }

  async findByPassId(eventName: string, passId: string): Promise<EventPass | null> {
    const results = await this.db
      .select()
      .from(eventPasses)
      .where(and(eq(eventPasses.eventName, eventName), eq(eventPasses.passId, passId)))
      .limit(1);

    return results[0] ?? null;
  }

  async create(data: NewEventPass): Promise<EventPass> {
    const results = await this.db
      .insert(eventPasses)
      .values(data)
      .returning();

    return results[0];
  }

  async update(id: number, data: Partial<NewEventPass>): Promise<EventPass | null> {
    const results = await this.db
      .update(eventPasses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(eventPasses.id, id))
      .returning();

    return results[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const results = await this.db
      .delete(eventPasses)
      .where(eq(eventPasses.id, id))
      .returning({ id: eventPasses.id });

    return results.length > 0;
  }

  async seedDefaultAnnualDinnerPasses(): Promise<EventPass[]> {
    const existing = await this.findAll({ eventName: "annual-dinner" });
    if (existing.length > 0) {
      return existing;
    }

    const inserted = await this.db
      .insert(eventPasses)
      .values(DEFAULT_ANNUAL_DINNER_PASSES)
      .returning();

    return inserted;
  }
}
