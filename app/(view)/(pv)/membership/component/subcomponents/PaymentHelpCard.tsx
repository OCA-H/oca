import React from 'react';
import { MEMBERSHIP_CONTENT } from '../../content/membership.content';

interface PaymentHelpCardProps {
  orderId: string | null;
}

export const PaymentHelpCard: React.FC<PaymentHelpCardProps> = ({ orderId }) => {
  const help = MEMBERSHIP_CONTENT.paymentStatus.help;
  const subject = encodeURIComponent(`Membership payment${orderId ? ` – ${orderId}` : ''}`);

  return (
    <aside className="ps-help">
      <h4>{help.title}</h4>
      <p>{help.desc}</p>
      <a href={`mailto:${help.email}?subject=${subject}`}>{help.email}</a>
      <a href={`tel:${help.phone.replace(/-/g, '')}`}>{help.phone}</a>
    </aside>
  );
};

export default PaymentHelpCard;
