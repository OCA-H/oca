/**
 * Global Route Constants
 * Maintains all routes across the OCA Hub application to avoid hardcoded strings.
 * Public subpages use hash-based routing on the root SPA (`/#/<page>`),
 * while standalone App Router pages use direct paths (`/member-signin`, `/partner-organization`).
 */

export const ROUTES = {
  // Main Subpages (Handled by HomeView hash router)
  HOME: '#/home',
  VISION_MISSION: '#/vision-mission',
  EXECUTIVE_COMMITTEE: '#/executive-committee',
  MEMBERSHIP: '#/membership',
  DONATION: '#/donation',
  ANNUAL_DINNER: '#/annual-dinner',
  ANNUAL_LUNCH: '#/annual-lunch',
  SPORTS: '#/sports',
  MEMBER_SIGNIN: '#/member-signin',
  PARTNER_ORGANIZATION: '#/partner-organization',

  // Section Anchors & Deep Links
  HOME_EVENTS: '#/home!events',
  HOME_CONNECT: '#/home!connect',
  HOME_GIVE: '#/home!give',
  DONATION_GIVE_FORM: '#/donation!give-form',
  ANNUAL_DINNER_PASSES: '#/annual-dinner!passes',
  ANNUAL_DINNER_DETAILS: '#/annual-dinner!details',
  SPORTS_SPONSOR: '#/sports!sponsor',
  EXECUTIVE_COMMITTEE_2023_25: '#/executive-committee!ec-2023-25',
  EXECUTIVE_COMMITTEE_2021_23: '#/executive-committee!ec-2021-23',
  EXECUTIVE_COMMITTEE_2019_21: '#/executive-committee!ec-2019-21',

  // Subpages & Utility Links
  LOST_PASSWORD: '#/lost-password',
  CONTACT: '#/contact',
  BYLAWS: '#/bylaws',
  NEWS_MAKERS: '#/news-makers',
  TEACHERS_BENEVOLENT_FUND: '#/teachers-benevolent-fund',
  EVENT_PHOTOGRAPHS: '#/event-photographs',
  TOP: '#top',

  // Direct Page Routes
  ROOT: '/',
  PAGE_MEMBER_SIGNIN: '/member-signin',
  PAGE_PARTNER_ORGANIZATION: '/partner-organization',

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
