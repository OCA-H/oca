import { ROUTES } from '@/app/(view)/common/helper/routes';

export const CONTRIBUTION_PAYMENT_STATUS_CONTENT = {
  receiptTitle: 'Contribution receipt',
  totalLabel: { paid: 'Amount contributed', other: 'Amount' },
  printLabel: 'Print receipt',
  emailNote: 'A thank-you note with these details has been emailed to the address you gave us.',
  taxNote: {
    yes: 'Your 80G receipt will be issued by the Secretariat against the PAN you provided.',
    no: 'You did not ask for an 80G receipt. Write to the Secretariat with your PAN and order reference if you would like one.',
  },
  help: {
    title: 'Need help?',
    desc: 'Quote your order reference when you write or call, and the Secretariat will look into it.',
    email: 'info@oldcolumban.net',
    phone: '011-23748666',
  },
  states: {
    paid: {
      tone: 'success',
      badge: 'Contribution received',
      title: 'Thank you for your contribution',
      lead: 'Your generosity keeps the Columban promise alive — for the teachers who taught us, the students who follow, and the School we all share.',
      receiptStatus: 'Paid',
      nextTitle: 'What happens next',
      nextSteps: [
        { title: 'Check your inbox', desc: 'A thank-you email with your payment details is on its way. Keep it as your acknowledgement.' },
        { title: 'Your 80G receipt', desc: 'If you asked for one, the Secretariat issues it against your PAN and sends it to you.' },
        { title: 'See where it goes', desc: 'Every rupee is accounted for in the audited balance sheet presented at each Annual General Meeting.' },
      ],
      primary: { label: 'Back to home', href: ROUTES.HOME },
      secondary: { label: 'Make another contribution', href: ROUTES.DONATION_GIVE_FORM },
    },
    failed: {
      tone: 'danger',
      badge: 'Payment unsuccessful',
      title: 'Your contribution could not be completed',
      lead: 'Your bank or CCAvenue declined the transaction, so no contribution was recorded. You can try again now.',
      receiptStatus: 'Failed',
      nextTitle: 'What you can do',
      nextSteps: [
        { title: 'Try again', desc: 'Most failures are temporary. Try again, or choose a different card, UPI app or bank.' },
        { title: 'Check with your bank', desc: 'Card limits, OTP timeouts and online-payment settings are the usual causes.' },
        { title: 'Money debited?', desc: 'A failed payment that left your account is normally reversed by your bank within 5–7 working days. Write to us with the order reference if it is not.' },
      ],
      primary: { label: 'Try again', href: ROUTES.DONATION_GIVE_FORM },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
    cancelled: {
      tone: 'neutral',
      badge: 'Payment cancelled',
      title: 'You cancelled the payment',
      lead: 'No money has been taken. Whenever you are ready, your contribution is just a few steps away.',
      receiptStatus: 'Cancelled',
      nextTitle: 'Ready when you are',
      nextSteps: [
        { title: 'Contribute again', desc: 'Choose a fund and an amount, and pay securely through CCAvenue.' },
        { title: 'Have a question first?', desc: 'Write to the Secretariat about the funds, 80G receipts or payment options before you give.' },
      ],
      primary: { label: 'Contribute again', href: ROUTES.DONATION_GIVE_FORM },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
    unknown: {
      tone: 'danger',
      badge: 'Status unavailable',
      title: 'We could not confirm your payment',
      lead: 'Something went wrong while reading the result from CCAvenue, or this link has expired. Please do not pay again until you have checked with us.',
      receiptStatus: 'Unconfirmed',
      nextTitle: 'What you can do',
      nextSteps: [
        { title: 'Check your inbox and bank', desc: 'A paid contribution is always followed by a thank-you email from us.' },
        { title: 'Contact the Secretariat', desc: 'Send us the order reference below and we will confirm your contribution.' },
      ],
      primary: { label: 'Back to contribute', href: ROUTES.DONATION },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
  },
} as const;
