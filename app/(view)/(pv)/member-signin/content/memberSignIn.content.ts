import { ROUTES } from '@/app/(view)/common/helper/routes';

export const memberSignInContent = {
  breadcrumb: {
    homeText: 'Home',
    homeHref: ROUTES.HOME,
    sectionText: 'Sign In',
    pageText: 'OCA Member',
  },
  eyebrow: 'OCA Members',
  title: 'Welcome back to the Columban community',
  benefits: [
    {
      title: 'Find your batchmates',
      desc: 'Search the directory by batch, city or name.',
    },
    {
      title: 'Keep your details current',
      desc: "Update your entry so the Association’s database stays accurate.",
    },
    {
      title: 'Track your contributions',
      desc: 'See your payment status and confirmations.',
    },
    {
      title: 'Member offers',
      desc: 'Exclusive offers for members who hold a donor pass.',
    },
  ],
  sideFooter: {
    question: 'Not a member yet? ',
    linkText: 'Apply for membership →',
    linkHref: ROUTES.MEMBERSHIP,
  },
  main: {
    title: 'OCA Member Login',
    subtitle: 'OCA Member exclusive area',
    userLabel: 'Member ID / User ID / Email ID / Mobile',
    userPlaceholder: 'Your member ID, user ID, email or mobile number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Your password',
    forgotPasswordText: 'Forgot Password?',
    forgotPasswordHref: ROUTES.FORGOT_PASSWORD,
    loginButtonText: 'Log in',
    orText: 'or',
    registerButtonText: 'Register',
    registerHref: ROUTES.MEMBERSHIP,
    troubleText: 'Having trouble signing in? ',
    contactText: 'Contact the Secretariat',
    contactHref: ROUTES.CONTACT,
  },
};

export const forgotPasswordContent = {
  breadcrumb: { signInText: 'Sign In', signInHref: ROUTES.MEMBER_SIGNIN, pageText: 'Forgot password' },
  side: {
    eyebrow: 'Account recovery',
    title: 'Back into your account in three steps',
    steps: [
      { title: 'Tell us who you are', desc: 'Your member ID, user ID, email or the mobile number on your account.' },
      { title: 'Check your inbox', desc: 'We email a secure link to the address on your account.' },
      { title: 'Choose a new password', desc: 'The link works once and expires in 30 minutes.' },
    ],
    footQuestion: 'Remembered it? ',
    footLinkText: 'Back to sign in →',
    footLinkHref: ROUTES.MEMBER_SIGNIN,
  },
  form: {
    title: 'Forgot your password?',
    subtitle: 'Enter the details you signed up with and we will email you a link to reset it.',
    label: 'Member ID / User ID / Email ID / Mobile',
    placeholder: 'Your member ID, user ID, email or mobile number',
    submitText: 'Email me a reset link',
    submittingText: 'Sending…',
    backText: '← Back to sign in',
    backHref: ROUTES.MEMBER_SIGNIN,
  },
  sent: {
    title: 'Check your email',
    lead: 'If an account matches {identifier}, a link to reset your password is on its way to the email address on that account.',
    tips: [
      'The link expires in 30 minutes and can be used once.',
      'Not in your inbox after a few minutes? Check your spam or promotions folder.',
      'Signed up with a different email? Try again with your member ID or mobile number.',
    ],
    retryText: 'Try different details',
    signInText: 'Back to sign in',
    signInHref: ROUTES.MEMBER_SIGNIN,
  },
  trouble: {
    text: 'No longer have access to that email? ',
    linkText: 'Contact the Secretariat',
    /** Written to the contact email set in the admin panel. */
    linkSubject: 'Help signing in',
  },
};

export const resetPasswordContent = {
  breadcrumb: { signInText: 'Sign In', signInHref: ROUTES.MEMBER_SIGNIN, pageText: 'Reset password' },
  side: {
    eyebrow: 'Account recovery',
    title: 'Choose a strong new password',
    steps: [
      { title: 'At least 8 characters', desc: 'Longer is stronger — a short phrase works well.' },
      { title: 'Mix it up', desc: 'Combine letters, numbers and a symbol or two.' },
      { title: 'Keep it to yourself', desc: 'The Secretariat will never ask you for your password.' },
    ],
    footQuestion: 'Link not working? ',
    footLinkText: 'Request a new one →',
    footLinkHref: ROUTES.FORGOT_PASSWORD,
  },
  form: {
    title: 'Set a new password',
    subtitle: 'Choose the password you will use to sign in from now on.',
    passwordLabel: 'New password',
    passwordPlaceholder: 'At least 8 characters',
    confirmLabel: 'Confirm new password',
    confirmPlaceholder: 'Type it again',
    submitText: 'Save new password',
    submittingText: 'Saving…',
    mismatch: 'The two passwords do not match.',
    tooShort: 'Password must be at least 8 characters.',
  },
  invalid: {
    title: 'This link has expired',
    lead: 'Password reset links work once and expire after 30 minutes. Request a new one and use the latest email we send.',
    retryText: 'Request a new link',
    retryHref: ROUTES.FORGOT_PASSWORD,
  },
  done: {
    title: 'Password changed',
    lead: 'Your password has been updated. Sign in with your new password to continue.',
    signInText: 'Sign in',
    signInHref: ROUTES.MEMBER_SIGNIN,
  },
};
