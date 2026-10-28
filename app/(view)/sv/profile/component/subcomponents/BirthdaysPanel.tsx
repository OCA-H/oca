import React from 'react';
import { profileContent } from '../../content';
import { profileHelper } from '../../helper';
import { PanelHead } from './PanelHead';

interface BirthdaysPanelProps {
  hidden: boolean;
  onBack: () => void;
  sentWishes: string[];
  onWish: (name: string) => void;
}

export const BirthdaysPanel: React.FC<BirthdaysPanelProps> = ({ hidden, onBack, sentWishes, onWish }) => {
  const { birthdays } = profileContent;
  return (
    <section className="mp-panel" id="mp-birthdays" aria-labelledby="mp-t-birthdays" hidden={hidden}>
      <PanelHead panel="birthdays" title={birthdays.title} lead={birthdays.lead} onBack={onBack} />
      <ul className="mp-people mp-people--lg">
        {birthdays.people.map((person) => {
          const isSent = sentWishes.includes(person.name);
          return (
            <li className="mp-person" key={person.name}>
              <span className="mp-ava">{profileHelper.getInitials(person.name)}</span>
              <span className="mp-person-t">
                <b>{person.name}</b>
                <small>
                  Batch of {person.batch} &middot; {person.city}
                </small>
              </span>
              <button
                className={`btn btn-secondary btn-sm mp-wish${isSent ? ' is-sent' : ''}`}
                type="button"
                aria-disabled={isSent || undefined}
                onClick={() => onWish(person.name)}
              >
                {isSent ? 'Wish sent' : 'Send wish'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default BirthdaysPanel;
