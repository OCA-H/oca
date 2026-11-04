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
  GOLF_TOURNAMENT: '/golf-tournament',
  ANNUAL_LUNCH: '/annual-lunch',
  SPORTS: '/sports',
  MEMBER_SIGNIN: '/member-signin',
  FORGOT_PASSWORD: '/member-signin/forgot-password',
  RESET_PASSWORD: '/member-signin/reset-password',
  PARTNER_ORGANIZATION: '/partner-organization',

  // About OCA
  BATCH_COORDINATORS: '/batch-coordinators',
  SOCIAL_CONSCIENCE: '/social-conscience',
  TEACHERS_BENEVOLENT_FUND: '/teachers-benevolent-fund',
  BYLAWS: '/bylaws',

  // Gallery
  SCHOOL_ANTHEM: '/school-anthem',
  SCHOOL_HISTORY: '/school-history',
  OUR_PRINCIPAL: '/our-principal',
  SCHOOL_MAGAZINE: '/school-magazine',
  EVENT_PHOTOGRAPHS: '/event-photographs',

  // Directory
  FIND_YOUR_BATCHMATES: '/find-your-batchmates',
  WORLDWIDE_CHAPTERS: '/worldwide-chapters',

  // OCA Connect
  NEWS_MAKERS: '/news-makers',
  ALUMNI_SERVICES: '/alumni-services',
  CAREERS: '/careers',
  NETWORKING: '/networking',
  INTERNSHIPS: '/internships',
  NEWSLETTERS: '/newsletters',
  REMEMBRANCE: '/remembrance',

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
  ANNUAL_DINNER_PAYMENT_STATUS: '/annual-dinner/payment-status',
  ANNUAL_DINNER_PASSES: '/annual-dinner#passes',
  ANNUAL_DINNER_DETAILS: '/annual-dinner#details',
  GOLF_TOURNAMENT_PAYMENT_STATUS: '/golf-tournament/payment-status',
  GOLF_TOURNAMENT_PASSES: '/golf-tournament#passes',
  GOLF_TOURNAMENT_DETAILS: '/golf-tournament#details',
  SPORTS_SPONSOR: '/sports#sponsor',
  EXECUTIVE_COMMITTEE_2025_27: '/executive-committee#ec-2025-27',
  EXECUTIVE_COMMITTEE_2023_25: '/executive-committee#ec-2023-25',
  EXECUTIVE_COMMITTEE_2021_23: '/executive-committee#ec-2021-23',
  EXECUTIVE_COMMITTEE_2019_21: '/executive-committee#ec-2019-21',

  // Subpages & Utility Links
  LOST_PASSWORD: '/member-signin#lost-password',
  CONTACT: '/#contact',
  SOCIAL_CONSCIENCE_CAUSES: '/social-conscience#causes',
  TEACHERS_FUND_COMMITTEE: '/teachers-benevolent-fund#tbf-committee',
  SCHOOL_ANTHEM_LYRICS: '/school-anthem#lyrics',
  SCHOOL_ANTHEM_DOWNLOAD: '/school-anthem#download',
  TOP: '#top',

  // Direct Page Routes
  ROOT: '/',
  PAGE_MEMBER_SIGNIN: '/member-signin',
  PAGE_PARTNER_ORGANIZATION: '/partner-organization',
  PAGE_MEMBER_PORTAL: '/sv/member-portal',
  MEMBER_PORTAL: '/sv/member-portal',
  PROFILE: '/sv/profile',
  ADMIN: '/sv/admin',
  CONTRIBUTION_PAYMENT_STATUS: '/sv/contribution/payment-status',
  SV: '/sv',

  // External Portal Links
  PORTAL_LOGIN: 'https://www.oldcolumban.net/members-2/',
} as const;

/** The contribution form with a fund already chosen, e.g. "/donation?fund=tbf#give-form". */
export const donationFundHref = (fund: string) => `${ROUTES.DONATION}?fund=${encodeURIComponent(fund)}#give-form`;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const routes = ROUTES;

export async function GET() {
  return Response.json(ROUTES);
}

export default ROUTES;

