import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { eventPassRepository, eventPassService } from "@/app/api/(features)/(pview)/event-pass/controller";
import { EventPassBookingRepository } from "@/app/api/(features)/(pview)/event-pass/repository/eventPassBookingRepository";
import type { EventPass } from "@/app/api/(features)/(pview)/event-pass/schema/eventPassSchema";
import type { EventPassBooking } from "@/app/api/(features)/(pview)/event-pass/schema/eventPassBookingSchema";
import { withAdminAuth } from "../middleware/adminAuth";

const BOOKING_STATUSES = ["pending", "paid", "failed", "cancelled"];

type PassContext = { params: Promise<{ id: string }> };

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
  createdAt: booking.createdAt.toISOString(),
});

// Every action runs behind withAdminAuth: signed in, and an admin in the database.
export class EventPassAdminController extends BaseController {
  constructor(private readonly bookings: EventPassBookingRepository) {
    super();
  }

  /** GET /api/sv/admin/event-passes: every pass, with seats and sales. */
  listPasses = withAdminAuth(() =>
    this.handle(async () => {
      const [passes, sales] = await Promise.all([eventPassRepository.findAll(), this.bookings.paidSalesByPass()]);
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
      return this.ok({ message: "Saved. The Annual Dinner page now shows your changes.", data: toAdminPass(pass, sales) });
    })
  );

  /** GET /api/sv/admin/event-pass-bookings?status=paid: bookings, newest first. */
  listBookings = withAdminAuth((request) =>
    this.handle(async () => {
      const status = new URL(request.url).searchParams.get("status") || undefined;
      if (status && !BOOKING_STATUSES.includes(status)) throw HttpError.badRequest("Unknown booking status.");
      const bookings = await this.bookings.findAll({ status });
      return this.ok({ data: bookings.map(toAdminBooking) });
    })
  );
}

export const eventPassAdminController = new EventPassAdminController(new EventPassBookingRepository());
