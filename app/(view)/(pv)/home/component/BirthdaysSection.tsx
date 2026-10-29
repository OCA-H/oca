import React from 'react';
import type { BirthdayMember } from '@/app/api/(features)/(pview)/birthday/schema';
import { useBirthdaysHandler } from '../handler';
import { formatBatch, getInitials } from '../helper';

const RING_COLORS = ['var(--navy)', 'var(--teal-dark)', 'var(--gold-dark)'];

/** Members whose date of birth is today; hidden on days with none. */
export const BirthdaysSection: React.FC<{ birthdays: BirthdayMember[] }> = ({ birthdays }) => {
  const { wishHref } = useBirthdaysHandler();
  if (birthdays.length === 0) return null;

  return (
    <section className="section tint-gold" id="birthdays" style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div className="bday-section-head">
          <div className="bday-lead">
            <div className="icon-circle"><svg viewBox="0 0 24 24" fill="none"><path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v4M4 10h16M4 10l1 10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l1-10M4 10a2 2 0 1 0 4 0 2 2 0 1 0 4 0 2 2 0 1 0 4 0 2 2 0 1 0 4 0" stroke="var(--gold)" strokeWidth="1.5"/></svg></div>
            <div>
              <h3>Today’s Birthdays</h3>
              <p>{birthdays.length} {birthdays.length === 1 ? 'Columban' : 'Columbans'} celebrating today</p>
            </div>
          </div>
        </div>
        <div className="bday-cards">
          {birthdays.map((member, index) => (
            <div className="bday-card" key={member.id}>
              <div className="ring" style={{ background: RING_COLORS[index % RING_COLORS.length] }}>{getInitials(member.name)}</div>
              <div className="bday-info">
                <div className="name">{member.name}</div>
                <div className="batch">{formatBatch(member.batchYear)}</div>
                <a className="bday-wish-btn" href={wishHref(member)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BirthdaysSection;
