import React from 'react';
import { golfTournamentContent } from '../../content';
import { GolfIcon } from './GolfIcon';

const text = golfTournamentContent.dinner;

/** The card beside the golf passes: the Annual Dinner comes with every one. Information, not a choice. */
export const GolfDinnerIncluded: React.FC = () => (
  <div className="dn-tier tier-gold is-included">
    <div className="dn-tier-head">
      <span className="dn-tier-ico">
        <GolfIcon name="dinner" />
      </span>
      <div>
        <h4>{text.title}</h4>
        <span className="dn-tier-pill">{text.pill}</span>
      </div>
    </div>
    <div className="dn-locked">
      <b>{text.included}</b>
      <p>{text.desc}</p>
      <span className="dn-locked-tag">
        <GolfIcon name="check" />
        {text.tag}
      </span>
    </div>
  </div>
);

/** "Good to know": what buying a golf pass also gets the member. */
export const GolfPassNote: React.FC = () => (
  <div className="gf-note" role="note">
    <span className="gf-note-ico">
      <GolfIcon name="info" />
    </span>
    <p>
      <b>Good to know.</b> {golfTournamentContent.note}
    </p>
  </div>
);

export default GolfDinnerIncluded;
