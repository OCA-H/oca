import { ROUTES } from '@/app/(view)/common/helper/routes';

// Wording that names the fee takes it already formatted ("₹2,000"): the amount is set in the
// admin panel (Membership → Membership fee), so it is never written into this file.

export const MEMBERSHIP_CONTENT = {
  hero: {
    eyebrow: 'Membership',
    title: 'Apply for membership',
    lead: 'Stay connected with generations of Columbans and contribute to the future of our alma mater.',
  },
  aside: {
    eyebrow: 'Membership application',
    title: 'Join the Columban community',
    description: 'Apply in three short steps. The Secretariat will be in touch to confirm your batch and complete your enrolment, and it lasts a lifetime.',
    fee: {
      label: 'Membership fee',
      note: 'A one-time payment, asked at the last step.',
    },
    quote: {
      text: 'Every name on the roll is one more Columban a batchmate can find again.',
      author: 'The OCA Secretariat',
    },
  },
  stepMessages: {
    1: (fee: string) => `A one-time fee of <b>${fee}</b> is asked at the end.`,
    2: (fee: string) => `Payment of <b>${fee}</b> comes next.`,
    3: (fee: string) => `Check your details, then pay <b>${fee}</b> on CCAvenue.`,
  },
  feeText: {
    step: (fee: string) => `${fee}, one-time`,
    lifeMember: (fee: string) => `One payment of ${fee}. On the roll for good.`,
  },
  titles: ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Br.", "Fr."],
  batches: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957", "1956", "1955", "1954", "1953", "1952", "1951", "1950", "1949", "1948", "1947", "1946", "1945", "1944", "1943", "1942", "1941"],
  countries: ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic (CAR)", "Chad", "Chile", "China", "Colombia", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "United States of America (USA)", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City (Holy See)", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"],
  checkout: {
    button: (fee: string) => `Pay ${fee}`,
    redirecting: 'Taking you to CCAvenue…',
    note: 'You will pay on CCAvenue’s secure page by UPI, card, net banking or wallet, and come back here once it is done.',
  },
  paymentStatus: {
    loading: 'Confirming your payment with CCAvenue…',
    receiptTitle: 'Payment summary',
    totalLabel: { paid: 'Amount paid', other: 'Amount due' },
    printLabel: 'Print receipt',
    // Only on the printed receipt. The address and contact line under it come from the contact details.
    print: {
      org: 'Old Columbans Association',
      title: 'Membership payment receipt',
      printedOn: 'Printed on',
      note: 'This is a computer-generated receipt and needs no signature. Payment was processed by CCAvenue in Indian Rupees.',
    },
    help: {
      title: 'Need help?',
      desc: 'Quote your order reference when you write or call, and the Secretariat will look into it.',
    },
    states: {
      paid: {
        tone: 'success',
        badge: 'Payment confirmed',
        title: 'Welcome to the Old Columbans Association, {name}',
        lead: 'Your life membership fee has been received and your account is active. A copy of this receipt is below for your records.',
        receiptStatus: 'Paid',
        nextTitle: 'Get started',
        nextSteps: [
          { title: 'Sign in', desc: 'Use the email and password you chose when you applied.' },
          { title: 'Open the Member Portal', desc: 'Keep your batch, address and profession up to date so batchmates can find you.' },
          { title: 'Join an event', desc: 'Members hear first about the Annual Lunch, the Annual Dinner, sports days and reunions.' },
        ],
        primary: { label: 'Sign in', href: ROUTES.MEMBER_SIGNIN },
        secondary: { label: 'Explore events', href: ROUTES.HOME_EVENTS },
      },
      failed: {
        tone: 'danger',
        badge: 'Payment unsuccessful',
        title: 'Your payment could not be completed',
        lead: 'Your bank or CCAvenue declined the transaction, so your membership is not active yet. You can try again now.',
        receiptStatus: 'Failed',
        nextTitle: 'What you can do',
        nextSteps: [
          { title: 'Try again', desc: 'Most failures are temporary. Apply again, or choose a different card, UPI app or bank.' },
          { title: 'Check with your bank', desc: 'Card limits, OTP timeouts and online-payment settings are the usual causes.' },
          { title: 'Money debited?', desc: 'A failed payment that left your account is normally reversed by your bank within 5–7 working days. Write to us with the order reference if it is not.' },
        ],
        primary: { label: 'Try again', href: ROUTES.MEMBERSHIP_JOIN },
        secondary: { label: 'Back to home', href: ROUTES.HOME },
      },
      cancelled: {
        tone: 'neutral',
        badge: 'Payment cancelled',
        title: 'You cancelled the payment',
        lead: 'No money has been taken and your membership is not active. You can complete it whenever you are ready.',
        receiptStatus: 'Cancelled',
        nextTitle: 'Ready when you are',
        nextSteps: [
          { title: 'Apply again', desc: 'Fill in the short form again and pay the one-time fee to join for life.' },
          { title: 'Have a question first?', desc: 'Write to the Secretariat about eligibility, batches or payment options before you pay.' },
        ],
        primary: { label: 'Apply again', href: ROUTES.MEMBERSHIP_JOIN },
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
          { title: 'Check your bank', desc: 'See whether the amount below has left your account for this order.' },
          { title: 'Contact the Secretariat', desc: 'Send us the order reference below and we will confirm your payment and membership.' },
        ],
        primary: { label: 'Back to membership', href: ROUTES.MEMBERSHIP },
        secondary: { label: 'Back to home', href: ROUTES.HOME },
      },
    },
  },
  benefits: [
    {
      num: '01',
      title: 'Stay connected with alumni',
      desc: 'Your name goes on the roll and into the directory, so batchmates can find you and you can find them — in Delhi and through chapters worldwide.',
    },
    {
      num: '02',
      title: 'Participate in events',
      desc: 'The Annual Lunch Get Together, memorial cricket tournaments, sports days and batch reunions, with notice sent to members first.',
    },
    {
      num: '03',
      title: 'Access the alumni network',
      desc: 'Careers, networking and introductions passed between Columbans, plus the OCA Internships Programme for younger members.',
    },
    {
      num: '04',
      title: 'Support initiatives that matter',
      desc: 'Members carry the Teachers Benevolent Fund, the Secretariat, and the School causes the Association takes on each year.',
    },
    {
      num: '05',
      title: 'Contribute to school development',
      desc: "Funds, amenities and inputs from the alumni go directly to St. Columba’s School, its staff and its students.",
    },
  ],
  cta: {
    eyebrow: 'Already a member?',
    title: 'Keep your details current',
    desc: 'Sign in to update your batch, address and profession so the directory stays accurate for everyone.',
  },
};

export const membershipContent = MEMBERSHIP_CONTENT;
