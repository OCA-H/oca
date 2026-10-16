import { ROUTES } from "@/app/(view)/common/helper/route";

export const memberPortalContent = {
  breadcrumb: {
    homeText: "Home",
    homeHref: ROUTES.HOME,
    sectionText: "Member Area",
    pageText: "Member Portal",
  },
  title: "OCA Member Portal",
  tagline: "Old Columbans Association Official Member Dashboard",
  quickLinks: [
    {
      title: "Batch Directory",
      desc: "Connect with classmates and batchmates worldwide",
      badge: "Active",
      href: ROUTES.HOME_CONNECT,
      icon: "users",
    },
    {
      title: "Annual Dinner Passes",
      desc: "Access exclusive Columban pass tiers and booking",
      badge: "Open Now",
      href: ROUTES.ANNUAL_DINNER,
      icon: "ticket",
    },
    {
      title: "OCA Sports & Teams",
      desc: "Cricket, football, golf, and tennis fixtures",
      badge: "Upcoming",
      href: ROUTES.SPORTS,
      icon: "award",
    },
    {
      title: "Teachers Benevolent Fund",
      desc: "Support our revered retired Columban masters & teachers",
      badge: "Support",
      href: ROUTES.DONATION,
      icon: "heart",
    },
  ],
};
