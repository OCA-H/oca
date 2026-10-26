/** ₹2,000 — rupees with Indian digit grouping, no paise. */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** 26 Oct 2026, 1:15 pm (IST), or null when there is no date. */
export function formatPaymentDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })} IST`;
}

/** CCAvenue's payment_mode ("Credit Card", "Net Banking", "Unified Payments") as members know it. */
export function formatPaymentMode(mode: string | null): string | null {
  if (!mode) return null;
  return mode === 'Unified Payments' ? 'UPI' : mode;
}
