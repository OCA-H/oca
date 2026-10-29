/**
 * Helper to get initial letters for fallback avatars
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Format currency in Indian Rupees
 */
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/** "1988" → "Batch '88" */
export function formatBatch(batchYear: string | null): string {
  return batchYear ? `Batch '${batchYear.slice(-2)}` : 'Old Columban';
}

/** Gmail's compose screen on the web, with the member's address and a birthday wish filled in. */
export function birthdayWishGmailUrl(email: string, name: string, senderName?: string): string {
  const firstName = name.split(' ')[0] || name;
  const subject = `Happy Birthday, ${firstName}!`;
  const body = [
    `Dear ${firstName},`,
    '',
    'Wishing you a very happy birthday! May the year ahead bring you good health, happiness and success.',
    '',
    'Warm wishes from a fellow Columban,',
    senderName || '',
  ].join('\n');
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email, su: subject, body });
  return `https://mail.google.com/mail/?${params}`;
}
