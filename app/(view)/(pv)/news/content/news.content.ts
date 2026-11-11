/** A notice page's fixed wording; the notices themselves are edited in the admin panel (Home page → News & Notices). */
export const newsContent = {
  section: 'News & Notices',
  eyebrow: 'News & Notices',
  posted: (date: string) => `Posted ${date}`,
  defaultTag: 'Notice',
  agenda: 'Agenda',
  signedBy: (name: string) => `Signed by ${name}`,
  defaultAction: 'Read more',
  docEyebrow: 'Attached document',
  defaultDocTitle: 'The notice (PDF)',
  scrollLabel: (title: string) => `${title}, scrollable`,
  pdfFallback: 'Your browser cannot show the PDF here.',
  openPdf: 'Open the PDF',
  defaultDownload: 'Download the notice',
  downloadNote: 'Tap to get the PDF',
  downloadAria: 'Download the PDF',
  siteName: 'Old Columbans Association',
};
