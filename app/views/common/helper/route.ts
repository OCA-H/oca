/**
 * Global Route Constants
 * Maintains all routes across the OCA Hub application to avoid hardcoded strings.
 * All internal routes start with a leading slash ('/').
 */

export const ROUTES = {
  // Main Pages
  HOME: '/home',
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
  HOME_EVENTS: '/home#events',
  HOME_CONNECT: '/home#connect',
  HOME_GIVE: '/home#give',
  DONATION_GIVE_FORM: '/donation#give-form',
  ANNUAL_DINNER_PASSES: '/annual-dinner#passes',
  ANNUAL_DINNER_DETAILS: '/annual-dinner#details',
  SPORTS_SPONSOR: '/sports#sponsor',

  // Subpages & Utility Links
  LOST_PASSWORD: '/lost-password',
  CONTACT: '/contact',
  BYLAWS: '/bylaws',
  NEWS_MAKERS: '/news-makers',
  TEACHERS_BENEVOLENT_FUND: '/teachers-benevolent-fund',
  EVENT_PHOTOGRAPHS: '/event-photographs',
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
