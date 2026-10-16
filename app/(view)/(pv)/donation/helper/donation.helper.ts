import { donationContent } from '../content/donation.content';

export function formatCurrency(amount: number): string {
  const n = isNaN(amount) ? 0 : amount;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function getHeadLabel(headId: string): string {
  const head = donationContent.heads.find((h) => h.id === headId);
  return head ? head.label : '';
}

export function calculateSponsorAmount(teachers: number, perTeacher: number = 5000): number {
  return (teachers || 1) * perTeacher;
}
