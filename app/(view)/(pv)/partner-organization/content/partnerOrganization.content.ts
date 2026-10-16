import { ROUTES } from '@/app/(view)/common/helper/routes';

export const partnerOrganizationContent = {
  breadcrumb: {
    homeText: 'Home',
    homeHref: ROUTES.HOME,
    sectionText: 'Sign In',
    pageText: 'Partner Organization',
  },
  eyebrow: 'Partner Organizations',
  title: 'Working with the Old Columbans Association',
  benefits: [
    {
      title: 'Reach Columbans',
      desc: 'Through the OCA Affiliate Programme.',
    },
    {
      title: 'Offer special deals',
      desc: 'Bring special offers to members of the Association.',
    },
    {
      title: 'Already offering deals',
      desc: 'MakeMyTrip, SpiceJet and Samsung are listed for members today.',
    },
  ],
  sideFooter: {
    question: 'Not a partner yet? ',
    linkText: 'Write to the Secretariat →',
    linkHref: 'mailto:info@oldcolumban.net?subject=Becoming%20an%20OCA%20partner',
  },
  main: {
    title: 'Partner Organization Login',
    subtitle: 'Partner Organization exclusive area',
    userLabel: 'Email ID / Mobile',
    userPlaceholder: 'Your email or mobile number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Your password',
    forgotPasswordText: 'Forgot Password?',
    forgotPasswordHref: ROUTES.LOST_PASSWORD,
    loginButtonText: 'Log in',
    troubleText: 'Having trouble signing in? ',
    contactText: 'Contact the Secretariat',
    contactHref: ROUTES.CONTACT,
  },
};
