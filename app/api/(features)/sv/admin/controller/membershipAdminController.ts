import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { readManualReference } from "@/app/api/core/paymentReconciliation";
import { readPageRequest } from "@/app/api/core/pagination";
import { membershipRepository, membershipService } from "@/app/api/(features)/(pview)/membership/controller/membershipController";
import type { MembershipApplication } from "@/app/api/(features)/(pview)/membership/schema/membershipSchema";
import { withAdminAuth } from "../middleware/adminAuth";

type OrderContext = { params: Promise<{ orderId: string }> };

/** A membership application as the admin panel lists it. Leaves out the password and raw gateway response. */
const toAdminMembership = (application: MembershipApplication) => ({
  id: application.id,
  orderId: application.orderId,
  membershipType: application.membershipType,
  fullName: [application.title, application.firstName, application.middleName, application.lastName].filter(Boolean).join(" "),
  batchYear: application.batchYear,
  email: application.email,
  mobile: `${application.countryCode} ${application.mobile}`.trim(),
  city: application.city,
  country: application.country,
  amount: application.amount,
  currency: application.currency,
  status: application.status,
  paymentMode: application.paymentMode,
  trackingId: application.trackingId,
  gatewayMessage: application.gatewayMessage,
  /** Whether the member's account exists; made when the payment is confirmed. */
  hasAccount: application.userId !== null,
  paidAt: application.paidAt?.toISOString() ?? null,
  emailSent: Boolean(application.welcomeEmailSentAt),
  createdAt: application.createdAt.toISOString(),
});

// Every action runs behind withAdminAuth: signed in, and an admin in the database.
export class MembershipAdminController extends BaseController {
  /**
   * GET /api/sv/admin/memberships?status=pending&q=raj&page=2: one page of membership applications,
   * newest first, with the totals by payment status.
   */
  listMemberships = withAdminAuth((request) =>
    this.handle(async () => {
      const page = readPageRequest(request);
      const [{ rows, total }, summary] = await Promise.all([membershipRepository.findPage(page), membershipRepository.summary()]);
      return this.ok({ data: rows.map(toAdminMembership), page: page.page, pageSize: page.pageSize, total, summary });
    })
  );

  /**
   * POST /api/sv/admin/memberships/{orderId}/confirm { reference }: marks an unpaid application paid
   * after the admin found the payment in the CCAvenue dashboard, creates the member's account and
   * sends the welcome email.
   */
  confirmMembership = withAdminAuth<OrderContext>((request, admin, _session, context) =>
    this.handle(async () => {
      const { orderId } = await context.params;
      const reference = readManualReference(await this.readJson(request));
      const applied = await membershipService.confirmManually(orderId, reference, { id: admin.id, name: admin.fullName }, this.baseUrl(request));
      // Read again: the account and the welcome email are recorded after the payment.
      const confirmed = (await membershipRepository.findByOrderId(applied.orderId)) ?? applied;
      const message = !confirmed.userId
        ? "Payment confirmed, but the member's account could not be made yet. It is retried automatically."
        : confirmed.welcomeEmailSentAt
          ? `Payment confirmed. The account is ready and the welcome email has been sent to ${confirmed.email}.`
          : `Payment confirmed and the account is ready, but the welcome email to ${confirmed.email} did not go. It is retried automatically.`;
      return this.ok({ message, data: toAdminMembership(confirmed) });
    })
  );
}

export const membershipAdminController = new MembershipAdminController();
