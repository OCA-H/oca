import React from 'react';
import { useContact } from '@/app/(view)/common/component/ContactProvider';
import { profileContent } from '../../content';
import { ProfileIcon } from './ProfileIcon';

export const HelpCard: React.FC = () => {
  const { help } = profileContent;
  const contact = useContact();
  return (
    <aside className="mp-help" aria-label="Help">
      <span className="mp-help-ico">
        <ProfileIcon name="chat" />
      </span>
      <div className="mp-help-t">
        <b>{help.title}</b>
        <span>{help.desc}</span>
      </div>
      <div className="mp-help-links">
        <a href={contact.tel}>{contact.phone}</a>
        <a href={contact.mailto()}>{contact.email}</a>
      </div>
    </aside>
  );
};

export default HelpCard;
