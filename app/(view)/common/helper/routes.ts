/**
 * Global Route Constants
 * Maintains all routes across the OCA Hub application to avoid hardcoded strings.
 * Clean Next.js App Router paths for public routes and secure views.
 */

export const ROUTES = {
  // Main Subpages (App Router Routes)
  HOME: '/',
  VISION_MISSION: '/vision-mission',
  EXECUTIVE_COMMITTEE: '/executive-committee',
  MEMBERSHIP: '/membership',
  DONATION: '/donation',
  ANNUAL_DINNER: '/annual-dinner',
  ANNUAL_LUNCH: '/annual-lunch',
  SPORTS: '/sports',
  MEMBER_SIGNIN: '/member-signin',
  PARTNER_ORGANIZATION: '/partner-organization',

  // Section Anchors & Deep Links
  HOME_EVENTS: '/#events',
  HOME_CONNECT: '/#connect',
  HOME_GIVE: '/#give',
  HOME_ABOUT: '/#about',
  HOME_GALLERY: '/#gallery',
  HOME_COMMITTEE: '/#committee',
  HOME_CONTACT: '/#contact',
  DONATION_GIVE_FORM: '/donation#give-form',
  MEMBERSHIP_JOIN: '/membership#join',
  MEMBERSHIP_PAYMENT_STATUS: '/membership/payment-status',
  ANNUAL_DINNER_PASSES: '/annual-dinner#passes',
  ANNUAL_DINNER_DETAILS: '/annual-dinner#details',
  SPORTS_SPONSOR: '/sports#sponsor',
  EXECUTIVE_COMMITTEE_2025_27: '/executive-committee#ec-2025-27',
  EXECUTIVE_COMMITTEE_2023_25: '/executive-committee#ec-2023-25',
  EXECUTIVE_COMMITTEE_2021_23: '/executive-committee#ec-2021-23',
  EXECUTIVE_COMMITTEE_2019_21: '/executive-committee#ec-2019-21',

  // Subpages & Utility Links
  LOST_PASSWORD: '/member-signin#lost-password',
  CONTACT: '/#contact',
  BYLAWS: '/#bylaws',
  NEWS_MAKERS: '/#news-makers',
  TEACHERS_BENEVOLENT_FUND: '/#teachers-benevolent-fund',
  EVENT_PHOTOGRAPHS: '/#event-photographs',
  TOP: '#top',

  // Direct Page Routes
  ROOT: '/',
  PAGE_MEMBER_SIGNIN: '/member-signin',
  PAGE_PARTNER_ORGANIZATION: '/partner-organization',
  PAGE_MEMBER_PORTAL: '/sv/member-portal',
  MEMBER_PORTAL: '/sv/member-portal',
  SV: '/sv',

  // External Portal Links
  PORTAL_LOGIN: 'https://www.oldcolumban.net/members-2/',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const routes = ROUTES;

export async function GET() {
  return Response.json(ROUTES);
}

export default ROUTES;

