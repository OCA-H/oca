import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { contributionRepository, contributionService } from "@/app/api/(features)/sv/contribution/controller/contributionController";
import type { FundTotals } from "@/app/api/(features)/sv/contribution/repository/contributionRepository";
import type { ContributionFund, ContributionWithFund } from "@/app/api/(features)/sv/contribution/schema/contributionSchema";
import { readManualReference } from "@/app/api/core/paymentReconciliation";
import { withAdminAuth } from "../middleware/adminAuth";

type FundContext = { params: Promise<{ id: string }> };
type OrderContext = { params: Promise<{ orderId: string }> };

const PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled"];

/** A contribution as the admin panel lists it. Leaves out the PAN, documents and raw gateway response. */
const toAdminContribution = (contribution: ContributionWithFund) => ({
  id: contribution.id,
  orderId: contribution.orderId,
  fundLabel: contribution.fund.label,
  units: contribution.units,
  unitLabel: contribution.fund.unitLabel,
  donorName: contribution.donorName,
  batch: contribution.batch,
  email: contribution.email,
  mobile: contribution.mobile,
  wants80g: contribution.wants80g,
  amount: contribution.amount,
  currency: contribution.currency,
  status: contribution.status,
  paymentMode: contribution.paymentMode,
  trackingId: contribution.trackingId,
  gatewayMessage: contribution.gatewayMessage,
  paidAt: contribution.paidAt?.toISOString() ?? null,
  emailSent: Boolean(contribution.thankYouEmailSentAt),
  createdAt: contribution.createdAt.toISOString(),
});

/** A contribution head as the admin panel shows it, with what has been given to it. */
const toAdminFund = (fund: ContributionFund, totals?: FundTotals) => ({
  id: fund.id,
  code: fund.code,
  label: fund.label,
  note: fund.note,
  unitAmount: fund.unitAmount,
  unitLabel: fund.unitLabel,
  maxUnits: fund.maxUnits,
  minAmount: fund.minAmount,
  maxAmount: fund.maxAmount,
  status: fund.status,
  sortOrder: fund.sortOrder,
  updatedAt: fund.updatedAt.toISOString(),
  contributions: totals?.contributions ?? 0,
  paid: totals?.paid ?? 0,
  raised: totals?.raised ?? 0,
});

const fundId = async (context: FundContext) => {
  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) throw HttpError.badRequest("Invalid contribution head id.");
  return id;
};

// Every action runs behind withAdminAuth: signed in, and an admin in the database.
export class ContributionAdminController extends BaseController {
  /** GET /api/sv/admin/contribution-funds: every contribution head, with its totals. */
  listFunds = withAdminAuth(() =>
    this.handle(async () => {
      const [funds, totals] = await Promise.all([contributionRepository.listFunds(), contributionRepository.totalsByFund()]);
      return this.ok({ data: funds.map((fund) => toAdminFund(fund, totals.find((t) => t.fundId === fund.id))) });
    })
  );

  /** GET /api/sv/admin/contributions?status=pending: contributions, newest first. */
  listContributions = withAdminAuth((request) =>
    this.handle(async () => {
      const status = new URL(request.url).searchParams.get("status") || undefined;
      if (status && !PAYMENT_STATUSES.includes(status)) throw HttpError.badRequest("Unknown payment status.");
      const contributions = await contributionRepository.findAll({ status });
      return this.ok({ data: contributions.map(toAdminContribution) });
    })
  );

  /**
   * POST /api/sv/admin/contributions/{orderId}/confirm { reference }: marks an unpaid contribution
   * paid after the admin found the payment in the CCAvenue dashboard, and sends the thank-you email.
   */
  confirmContribution = withAdminAuth<OrderContext>((request, admin, _session, context) =>
    this.handle(async () => {
      const { orderId } = await context.params;
      const reference = readManualReference(await this.readJson(request));
      const applied = await contributionService.confirmManually(orderId, reference, { id: admin.id, name: admin.fullName }, this.baseUrl(request));
      // Read again: the thank-you email is recorded after the payment.
      const confirmed = (await contributionRepository.findByOrderId(applied.orderId)) ?? applied;
      const message = confirmed.thankYouEmailSentAt
        ? `Payment confirmed. The thank-you email has been sent to ${confirmed.email}.`
        : `Payment confirmed, but the thank-you email to ${confirmed.email} did not go. It is retried automatically.`;
      return this.ok({ message, data: toAdminContribution(confirmed) });
    })
  );

  /** POST /api/sv/admin/contribution-funds: adds a contribution head. */
  createFund = withAdminAuth((request) =>
    this.handle(async () => {
      const fund = await contributionService.createFundFromAdmin(await this.readJson(request));
      return this.ok({ message: "Added. The contribution form now shows this head.", data: toAdminFund(fund) }, 201);
    })
  );

  /** PATCH /api/sv/admin/contribution-funds/{id}: changes a head's wording, order or status. */
  updateFund = withAdminAuth<FundContext>((request, _admin, _session, context) =>
    this.handle(async () => {
      const fund = await contributionService.updateFundFromAdmin(await fundId(context), await this.readJson(request));
      const totals = (await contributionRepository.totalsByFund()).find((t) => t.fundId === fund.id);
      return this.ok({ message: "Saved. The contribution form now shows your changes.", data: toAdminFund(fund, totals) });
    })
  );

  /** DELETE /api/sv/admin/contribution-funds/{id}: only for a head nobody has contributed to. */
  deleteFund = withAdminAuth<FundContext>((_request, _admin, _session, context) =>
    this.handle(async () => {
      await contributionService.deleteFund(await fundId(context));
      return this.ok({ message: "Deleted." });
    })
  );
}

export const contributionAdminController = new ContributionAdminController();
