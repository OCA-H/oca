import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { eventPassBookingService, eventPassRepository, eventPassService } from "@/app/api/(features)/(pview)/event-pass/controller";
import { readManualReference } from "@/app/api/core/paymentReconciliation";
import { readPageRequest } from "@/app/api/core/pagination";
import { EventPassBookingRepository } from "@/app/api/(features)/(pview)/event-pass/repository/eventPassBookingRepository";
import type { EventPass } from "@/app/api/(features)/(pview)/event-pass/schema/eventPassSchema";
import type { EventPassBooking } from "@/app/api/(features)/(pview)/event-pass/schema/eventPassBookingSchema";
import { eventPassEvent, isEventPassEventName } from "@/app/api/(features)/(pview)/event-pass/services/eventPassEvents";
import { withAdminAuth } from "../middleware/adminAuth";

/** ?event=golf-tournament: one event's passes or bookings (with its past years); every event when left out. */
const eventFilter = (request: Request): string | undefined => {
  const event = new URL(request.url).searchParams.get("event") || undefined;
  if (event && !isEventPassEventName(event)) throw HttpError.badRequest("Unknown event.");
  return event;
};

type PassContext = { params: Promise<{ id: string }> };
type OrderContext = { params: Promise<{ orderId: string }> };

/** A pass as the admin panel shows it: its details, plus how many were paid for and what they took. */
const toAdminPass = (pass: EventPass, sales?: { paid: number; revenue: number }) => ({
  id: pass.id,
  eventName: pass.eventName,
  passId: pass.passId,
  tierTitle: pass.tierTitle,
  title: pass.title,
  label: pass.label,
  description: pass.description,
  batchEligibility: pass.batchEligibility,
  price: pass.price,
  currency: pass.currency,
  totalQuantity: pass.totalQuantity,
  availableQuantity: pass.availableQuantity,
  status: pass.status,
  statusNote: pass.statusNote,
  displayOrder: pass.displayOrder,
  updatedAt: pass.updatedAt.toISOString(),
  paid: sales?.paid ?? 0,
  revenue: sales?.revenue ?? 0,
});

/** Leaves out the raw gateway response: the panel has no use for it. */
const toAdminBooking = (booking: EventPassBooking) => ({
  id: booking.id,
  orderId: booking.orderId,
  eventName: booking.eventName,
  passId: booking.passId,
  passLabel: booking.passLabel,
  memberId: booking.memberId,
  fullName: booking.fullName,
  email: booking.email,
  mobile: booking.mobile,
  spouseName: booking.spouseName,
  teachers: booking.teachers,
  childrenUnder12: booking.childrenUnder12,
  childrenAbove12: booking.childrenAbove12,
  amount: booking.amount,
  currency: booking.currency,
  status: booking.status,
  oversold: booking.oversold,
  paymentMode: booking.paymentMode,
  trackingId: booking.trackingId,
  gatewayMessage: booking.gatewayMessage,
  paidAt: booking.paidAt?.toISOString() ?? null,
  /** Whether the pass has been emailed; a paid booking without it is retried by the payment check. */
  emailSent: Boolean(booking.passEmailSentAt),
  createdAt: booking.createdAt.toISOString(),
});

// Every action runs behind withAdminAuth: signed in, and an admin in the database.
export class EventPassAdminController extends BaseController {
  constructor(private readonly bookings: EventPassBookingRepository) {
    super();
  }

  /** GET /api/sv/admin/event-passes?event=golf-tournament: the event's passes, with seats and sales. */
  listPasses = withAdminAuth((request) =>
    this.handle(async () => {
      const event = eventFilter(request);
      // Through the service, so an event's built-in passes are there even before its page is visited.
      const [passes, sales] = await Promise.all([
        event ? eventPassService.list({ event }) : eventPassRepository.findAll(),
        this.bookings.paidSalesByPass(),
      ]);
      return this.ok({ data: passes.map((pass) => toAdminPass(pass, sales.find((s) => s.eventPassId === pass.id))) });
    })
  );

  /** PATCH /api/sv/admin/event-passes/{id}: changes a pass's price, seats, status and wording. */
  updatePass = withAdminAuth<PassContext>((request, _admin, _session, context) =>
    this.handle(async () => {
      const id = Number((await context.params).id);
      if (!Number.isInteger(id) || id <= 0) throw HttpError.badRequest("Invalid pass id.");
      const pass = await eventPassService.updateFromAdmin(id, await this.readJson(request));
      const sales = (await this.bookings.paidSalesByPass()).find((s) => s.eventPassId === pass.id);
      return this.ok({ message: `Saved. The ${eventPassEvent(pass.eventName).name} page now shows your changes.`, data: toAdminPass(pass, sales) });
    })
  );

  /**
   * GET /api/sv/admin/event-pass-bookings?event=golf-tournament&status=paid&q=raj&page=2: one page of
   * the event's bookings, newest first, with the event's totals by payment status.
   */
  listBookings = withAdminAuth((request) =>
    this.handle(async () => {
      const event = eventFilter(request);
      const page = readPageRequest(request);
      const [{ rows, total }, summary] = await Promise.all([this.bookings.findPage(event, page), this.bookings.summary(event)]);
      return this.ok({ data: rows.map(toAdminBooking), page: page.page, pageSize: page.pageSize, total, summary });
    })
  );

  /**
   * POST /api/sv/admin/event-pass-bookings/{orderId}/confirm { reference }: marks an unpaid booking
   * paid after the admin found the payment in the CCAvenue dashboard, and emails the member their pass.
   */
  confirmBooking = withAdminAuth<OrderContext>((request, admin, _session, context) =>
    this.handle(async () => {
      const { orderId } = await context.params;
      const reference = readManualReference(await this.readJson(request));
      const confirmed = await eventPassBookingService.confirmManually(orderId, reference, { id: admin.id, name: admin.fullName }, this.baseUrl(request));
      const booking = (await this.bookings.findByOrderId(confirmed.orderId)) ?? confirmed;
      const message = booking.passEmailSentAt
        ? `Payment confirmed. ${booking.fullName}'s pass has been emailed to ${booking.email}.`
        : `Payment confirmed, but the pass email to ${booking.email} did not go. It is retried automatically.`;
      return this.ok({ message, data: toAdminBooking(booking) });
    })
  );
}

export const eventPassAdminController = new EventPassAdminController(new EventPassBookingRepository());
