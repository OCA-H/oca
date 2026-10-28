import React from 'react';
import { profileContent } from '../../content';
import { ProfileIcon } from './ProfileIcon';

export const HelpCard: React.FC = () => {
  const { help } = profileContent;
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
        <a href={help.phoneHref}>{help.phone}</a>
        <a href={`mailto:${help.email}`}>{help.email}</a>
      </div>
    </aside>
  );
};

export default HelpCard;
