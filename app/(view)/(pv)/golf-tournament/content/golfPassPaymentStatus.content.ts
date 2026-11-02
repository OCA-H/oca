import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { PassPaymentStatusContent } from '@/app/(view)/(pv)/annual-dinner/content/passPaymentStatus.content';

export const GOLF_PASS_PAYMENT_STATUS_CONTENT: PassPaymentStatusContent = {
  event: { label: 'Golf Tournament', href: ROUTES.GOLF_TOURNAMENT },
  loading: 'Confirming your payment with CCAvenue…',
  receiptTitle: 'Golf Tournament pass',
  totalLabel: { paid: 'Amount paid', other: 'Amount due' },
  printLabel: 'Print receipt',
  help: {
    title: 'Need help?',
    desc: 'Quote your order reference when you write or call, and the Secretariat will look into it.',
  },
  states: {
    paid: {
      tone: 'success',
      badge: 'Pass confirmed',
      title: 'See you on the course, {name}',
      lead: 'Your payment has been received and your OCA Golf Tournament pass is booked, with entry to the OCA Annual Dinner. Your pass is on its way to your email.',
      receiptStatus: 'Paid',
      nextTitle: 'Before the day',
      nextSteps: [
        { title: 'Check your email', desc: 'Your digital pass, with your name on it, is attached. Show it on your phone or bring a printout.' },
        { title: 'Save the date', desc: 'Friday, 18 December 2026. Tee off from 11:30 am at the Qutub Golf Course, New Delhi.' },
        { title: 'Stay for the dinner', desc: 'Your pass also covers the OCA Annual Dinner the same day, at no extra cost.' },
      ],
      primary: { label: 'Back to the Golf Tournament', href: ROUTES.GOLF_TOURNAMENT },
      secondary: { label: 'See the Annual Dinner', href: ROUTES.ANNUAL_DINNER },
    },
    failed: {
      tone: 'danger',
      badge: 'Payment unsuccessful',
      title: 'Your payment could not be completed',
      lead: 'Your bank or CCAvenue declined the transaction, so your pass is not booked yet. You can try again now.',
      receiptStatus: 'Failed',
      nextTitle: 'What you can do',
      nextSteps: [
        { title: 'Try again', desc: 'Most failures are temporary. Choose your pass again, or use a different card, UPI app or bank.' },
        { title: 'Check with your bank', desc: 'Card limits, OTP timeouts and online-payment settings are the usual causes.' },
        { title: 'Money debited?', desc: 'A failed payment that left your account is normally reversed by your bank within 5–7 working days. Write to us with the order reference if it is not.' },
      ],
      primary: { label: 'Try again', href: ROUTES.GOLF_TOURNAMENT_PASSES },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
    cancelled: {
      tone: 'neutral',
      badge: 'Payment cancelled',
      title: 'You cancelled the payment',
      lead: 'No money has been taken and your pass is not booked. You can come back for it while passes last.',
      receiptStatus: 'Cancelled',
      nextTitle: 'Ready when you are',
      nextSteps: [
        { title: 'Choose your pass again', desc: 'Single or Couple; every pass includes entry to the OCA Annual Dinner.' },
        { title: 'Have a question first?', desc: 'Write to the Secretariat about passes or payment options before you pay.' },
      ],
      primary: { label: 'Choose a pass', href: ROUTES.GOLF_TOURNAMENT_PASSES },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
    pending: {
      tone: 'warning',
      badge: 'Payment pending',
      title: 'We are waiting for your bank to confirm',
      lead: 'Your payment has not been confirmed yet. Please do not pay again — if money has left your account, this order will be updated shortly.',
      receiptStatus: 'Awaiting confirmation',
      nextTitle: 'What happens next',
      nextSteps: [
        { title: 'Give it a few minutes', desc: 'Some banks take a while to confirm. Refresh this page to see the latest status.' },
        { title: 'Still pending?', desc: 'Write to the Secretariat with your order reference and we will check it with CCAvenue.' },
      ],
      primary: { label: 'Refresh status', href: '' },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
    unknown: {
      tone: 'danger',
      badge: 'Status unavailable',
      title: 'We could not confirm your payment',
      lead: 'Something went wrong while reading the result from CCAvenue. Please do not pay again until you have checked with us.',
      receiptStatus: 'Unconfirmed',
      nextTitle: 'What you can do',
      nextSteps: [
        { title: 'Check your bank', desc: 'See whether the pass amount has left your account for this order.' },
        { title: 'Contact the Secretariat', desc: 'Send us the order reference below and we will confirm your payment and pass.' },
      ],
      primary: { label: 'Back to the Golf Tournament', href: ROUTES.GOLF_TOURNAMENT },
      secondary: { label: 'Back to home', href: ROUTES.HOME },
    },
  },
};
