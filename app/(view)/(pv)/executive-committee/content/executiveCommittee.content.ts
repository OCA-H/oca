import { ROUTES } from '@/app/(view)/common/helper/routes';

export interface OfficeBearer {
  name: string;
  role: string;
  roleSub?: string;
  batch: string;
  email?: string;
  photo?: string;
  photoAlt?: string;
  initials?: string;
  profession?: string;
}

export interface CommitteeMember {
  initials?: string;
  name: string;
  batch: string;
  role: string;
  roleSub?: string;
  profession?: string;
  email?: string;
}

export interface CommitteeTerm {
  id: string;
  jumpLabel: string;
  isCurrent?: boolean;
  eyebrow: string;
  title: string;
  pill?: string;
  tintClass?: string;
  isFourColumns?: boolean;
  officeBearers: OfficeBearer[];
  members: CommitteeMember[];
}

export interface ExecutiveCommitteeContent {
  breadcrumbs: {
    homeLabel: string;
    parentLabel: string;
    currentLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryBtn: {
      text: string;
      href: string;
    };
    /** In place of primaryBtn for a signed-in member. */
    memberPrimaryBtn: {
      text: string;
      href: string;
    };
    secondaryBtn: {
      text: string;
      href: string;
    };
    image: string;
    imageAlt: string;
    caption: string;
  };
  jumpAriaLabel: string;
  cta: ExecutiveCommitteeCtaContent;
  /** The CTA band for a signed-in member, who has no membership left to buy. */
  memberCta: ExecutiveCommitteeCtaContent;
}

export interface ExecutiveCommitteeCtaContent {
  eyebrow: string;
  title: string;
  lead: string;
  primaryBtn: {
    text: string;
    href: string;
  };
  secondaryBtn: {
    text: string;
    href: string;
  };
}

export const executiveCommitteeContent: ExecutiveCommitteeContent = {
  breadcrumbs: {
    homeLabel: 'Home',
    parentLabel: 'About OCA',
    currentLabel: 'Executive Committee',
  },
  hero: {
    eyebrow: 'Governance',
    title: 'Executive Committee',
    lead: 'The leaders who guide OCA’s mission and strengthen the Columban community.',
    primaryBtn: {
      text: 'Join the OCA community',
      href: ROUTES.MEMBERSHIP,
    },
    memberPrimaryBtn: {
      text: 'My Profile',
      href: ROUTES.PROFILE,
    },
    secondaryBtn: {
      text: 'Read our mission',
      href: ROUTES.VISION_MISSION,
    },
    image: 'https://www.oldcolumban.net/wp-content/uploads/2017/10/b38eafcb-e18b-484c-b1c6-1d1782b1b92a.jpg',
    imageAlt: 'Columbans gathered at an Association event',
    caption: 'The Association at work',
  },
  jumpAriaLabel: 'Committee term jump links',
  cta: {
    eyebrow: 'Get involved',
    title: 'Join the OCA community',
    lead: 'Members elect the committee, stand for it, and shape what the Association does next.',
    primaryBtn: {
      text: 'Become a Member',
      href: ROUTES.MEMBERSHIP,
    },
    secondaryBtn: {
      text: 'Support OCA',
      href: ROUTES.DONATION,
    },
  },
  memberCta: {
    eyebrow: 'Get involved',
    title: 'Have your say in the Association',
    lead: 'As a member you elect the committee, can stand for it, and help shape what the Association does next.',
    primaryBtn: {
      text: 'My Profile',
      href: ROUTES.PROFILE,
    },
    secondaryBtn: {
      text: 'Support OCA',
      href: ROUTES.DONATION,
    },
  },
};
