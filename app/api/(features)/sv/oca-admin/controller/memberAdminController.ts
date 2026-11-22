import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { withStaffAuth } from "../middleware";
import { memberAdminService, readMemberQuery, readPassQuery } from "../services";
import type { StaffUser } from "../schema";

type IdContext = { params: Promise<{ id: string }> };
type KindContext = { params: Promise<{ kind: string }> };

const staffOf = (user: { id: number; fullName: string; memberId: string; role: string }): StaffUser => ({
  id: user.id,
  fullName: user.fullName,
  memberId: user.memberId,
  role: user.role,
});

// Every action runs behind withStaffAuth: signed in, and a super admin or admin in the database.
export class MemberAdminController extends BaseController {
  /** GET /api/sv/oca-admin/summary: who is signed in, and the dashboard's numbers. */
  summary = withStaffAuth((_request, staff) =>
    this.handle(async () => this.ok({ me: staffOf(staff), data: await memberAdminService.summary() }))
  );

  /** GET /api/sv/oca-admin/members?page=2&pageSize=25&batch=1989&q=raj&missing=email&sort=name&dir=asc */
  listMembers = withStaffAuth((request) =>
    this.handle(async () => this.ok(await memberAdminService.membersPage(readMemberQuery(request))))
  );

  /** GET /api/sv/oca-admin/members/duplicates */
  duplicates = withStaffAuth(() => this.handle(async () => this.ok({ data: await memberAdminService.duplicates() })));

  /** GET /api/sv/oca-admin/members/occasions: birthdays and anniversaries in the next 7 days. */
  occasions = withStaffAuth(() => this.handle(async () => this.ok({ data: await memberAdminService.occasions() })));

  /** POST /api/sv/oca-admin/members: Create Account. */
  createMember = withStaffAuth((request, staff) =>
    this.handle(async () => {
      const member = await memberAdminService.createMember(await this.readJson(request), staff);
      return this.ok({ message: `Account created for ${member.name}. Membership ID: ${member.memberId}.`, data: member }, 201);
    })
  );

  /** GET /api/sv/oca-admin/members/{id}: one account in full. */
  getMember = withStaffAuth<IdContext>((_request, _staff, _session, context) =>
    this.handle(async () => this.ok({ data: await memberAdminService.getMember(Number((await context.params).id)) }))
  );

  /** PATCH /api/sv/oca-admin/members/{id}: Update Account. */
  updateMember = withStaffAuth<IdContext>((request, staff, _session, context) =>
    this.handle(async () => {
      const id = Number((await context.params).id);
      const member = await memberAdminService.updateMember(id, await this.readJson(request), staff);
      return this.ok({ message: `Saved changes for ${member.name}.`, data: member });
    })
  );

  /** DELETE /api/sv/oca-admin/members/{id}: Delete Account. */
  deleteMember = withStaffAuth<IdContext>((_request, staff, _session, context) =>
    this.handle(async () => {
      const member = await memberAdminService.deleteMember(Number((await context.params).id), staff);
      return this.ok({ message: `${member.name}’s account was deleted.`, data: member });
    })
  );

  /** PUT /api/sv/oca-admin/members/{id}/role { role: "admin" | "member" }: Create Sub Admins. */
  setRole = withStaffAuth<IdContext>((request, staff, _session, context) =>
    this.handle(async () => {
      const id = Number((await context.params).id);
      const member = await memberAdminService.setRole(id, await this.readJson(request), staff);
      const message = member.role === "admin" ? `${member.name} is now a sub admin.` : `${member.name} is no longer a sub admin.`;
      return this.ok({ message, data: member });
    })
  );

  /** GET /api/sv/oca-admin/donor-passes?page&batch&type&q&sort&dir: paid pass bookings, a page at a time. */
  listDonorPasses = withStaffAuth((request) =>
    this.handle(async () => this.ok(await memberAdminService.passesPage(readPassQuery(request))))
  );

  /** GET /api/sv/oca-admin/donor-passes/export?...&teachers=1: every matching pass as CSV. */
  exportDonorPasses = withStaffAuth((request) =>
    this.handle(async () => {
      const { name, csv, count } = await memberAdminService.passesCsv(readPassQuery(request));
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${name}"`,
          "X-Record-Count": String(count),
          "Cache-Control": "no-store",
        },
      });
    })
  );

  /** GET /api/sv/oca-admin/export: how many rows each export file has. */
  exportCounts = withStaffAuth(() => this.handle(async () => this.ok({ data: await memberAdminService.exportCounts() })));

  /** GET /api/sv/oca-admin/export/{kind}: the CSV file itself. */
  exportFile = withStaffAuth<KindContext>((_request, _staff, _session, context) =>
    this.handle(async () => {
      const { name, csv } = await memberAdminService.exportCsv((await context.params).kind);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${name}"`,
          "Cache-Control": "no-store",
        },
      });
    })
  );
}

export const memberAdminController = new MemberAdminController();
