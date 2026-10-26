import React from 'react';

const ICONS = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  success: <path d="M20 6 9 17l-5-5" />,
  warning: <path d="M12 7v6m0 4h.01" />,
};

interface PasswordRecoveryNoticeProps {
  tone: 'success' | 'warning';
  icon: keyof typeof ICONS;
  title: string;
  lead: React.ReactNode;
  children?: React.ReactNode;
}

/** Result panel that replaces the form: email sent, password changed, or link expired. */
export const PasswordRecoveryNotice: React.FC<PasswordRecoveryNoticeProps> = ({ tone, icon, title, lead, children }) => (
  <div className="si-notice" role="status" aria-live="polite">
    <span className={`si-notice-icon si-notice-${tone}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[icon]}
      </svg>
    </span>
    <h1>{title}</h1>
    <p className="si-notice-lead">{lead}</p>
    {children}
  </div>
);

export default PasswordRecoveryNotice;
