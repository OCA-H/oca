import "server-only";
import { eq } from "drizzle-orm";
import { BaseRepository } from "@/app/api/core/baseRepository";
import {
  membershipApplications,
  type MembershipApplication,
  type NewMembershipApplication,
} from "../schema/membershipSchema";

export class MembershipRepository extends BaseRepository {
  async findByOrderId(orderId: string): Promise<MembershipApplication | null> {
    const results = await this.db
      .select()
      .from(membershipApplications)
      .where(eq(membershipApplications.orderId, orderId))
      .limit(1);

    return results[0] ?? null;
  }

  async create(data: NewMembershipApplication): Promise<MembershipApplication> {
    const results = await this.db
      .insert(membershipApplications)
      .values({ ...data, email: data.email.toLowerCase().trim() })
      .returning();

    return results[0];
  }

  async update(id: number, data: Partial<NewMembershipApplication>): Promise<MembershipApplication | null> {
    const results = await this.db
      .update(membershipApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(membershipApplications.id, id))
      .returning();

    return results[0] ?? null;
  }
}
