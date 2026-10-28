import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { adminContent } from '../../content';
import { AdminIcon } from './AdminIcon';

/** Signed in, but not an admin: say so, and offer the way back. */
export const AdminDenied: React.FC<{ message?: string | null }> = ({ message }) => {
  const { denied } = adminContent;
  return (
    <section className="mp-shell mp-fade" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="mp-soon" style={{ maxWidth: 520, padding: 32 }}>
        <span className="mp-soon-ico" aria-hidden="true">
          <AdminIcon name="shield" />
        </span>
        <h2 style={{ margin: 0, color: 'var(--navy)' }}>{message ? 'Something went wrong' : denied.title}</h2>
        <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }} role={message ? 'alert' : undefined}>
          {message || denied.body}
        </p>
        <Link href={ROUTES.PROFILE} className="btn btn-primary">
          {denied.cta}
        </Link>
      </div>
    </section>
  );
};

export default AdminDenied;
