/**
 * The events members buy passes for, keyed by event_passes.event_name. Holds what the pass email
 * prints and where the member lands after paying; keep it in step with each event's page and pass
 * artwork. An event not listed here (e.g. a past year's "annual-dinner-2024") reads as the dinner.
 */
export interface EventPassEvent {
  name: string;
  date: string;
  venue: string;
  /** The event's page; its payment status page is under it. */
  page: string;
  /** Start of the attached pass's file name. */
  cardFile: string;
  /** The email's heading, before the member's first name. */
  greeting: string;
  /** Anything else the pass covers, said in the email. */
  includes?: string;
}

export const EVENT_PASS_EVENTS = {
  "annual-dinner": {
    name: "OCA Annual Dinner",
    date: "Friday, 18 December 2026",
    venue: "Qutub Golf Course, New Delhi",
    page: "/annual-dinner",
    cardFile: "OCA-Annual-Dinner-Pass",
    greeting: "See you at the dinner",
  },
  "golf-tournament": {
    name: "OCA Golf Tournament",
    date: "Friday, 18 December 2026, from 11:30 am",
    venue: "Qutub Golf Course, New Delhi",
    page: "/golf-tournament",
    cardFile: "OCA-Golf-Tournament-Pass",
    greeting: "See you on the course",
    includes: "Your pass also covers the OCA Annual Dinner, held the same day, at no extra cost.",
  },
} satisfies Record<string, EventPassEvent>;

export type EventPassEventName = keyof typeof EVENT_PASS_EVENTS;

export const isEventPassEventName = (eventName: string): eventName is EventPassEventName => eventName in EVENT_PASS_EVENTS;

export const eventPassEvent = (eventName: string): EventPassEvent =>
  isEventPassEventName(eventName) ? EVENT_PASS_EVENTS[eventName] : EVENT_PASS_EVENTS["annual-dinner"];

/** Where CCAvenue's response sends the member: the payment status page of the order's event. */
export const paymentStatusPath = (eventName: string | null | undefined) => `${eventPassEvent(eventName ?? "").page}/payment-status`;
