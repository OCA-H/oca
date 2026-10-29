import React from 'react';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { MEMBERSHIP_CONTENT } from '../../content/membership.content';

interface PaymentHelpCardProps {
  orderId: string | null;
}

export const PaymentHelpCard: React.FC<PaymentHelpCardProps> = ({ orderId }) => {
  const help = MEMBERSHIP_CONTENT.paymentStatus.help;
  const contact = useContact();

  return (
    <aside className="ps-help">
      <h4>{help.title}</h4>
      <p>{help.desc}</p>
      <a href={contact.mailto(`Membership payment${orderId ? ` – ${orderId}` : ''}`)}>{contact.email}</a>
      <a href={contact.tel}>{contact.phone}</a>
    </aside>
  );
};

export default PaymentHelpCard;
