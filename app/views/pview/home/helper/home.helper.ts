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
