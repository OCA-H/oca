'use client';

import React from 'react';
import { golfTournamentContent, type GolfPassOption } from '../../content';
import { GolfDinnerIncluded } from './GolfDinnerIncluded';
import { GolfIcon } from './GolfIcon';

interface GolfPassGridProps {
  tier: { title: string; pill: string };
  passes: GolfPassOption[];
  selectedPass: string | null;
  onSelectPass: (passId: string) => void;
}

/** The golf pass card (Single or Couple), joined by a "+" to the dinner it includes. */
export const GolfPassGrid: React.FC<GolfPassGridProps> = ({ tier, passes, selectedPass, onSelectPass }) => {
  const isSelected = passes.some((p) => p.passId === selectedPass);
  const isLocked = passes.every((p) => p.locked);
  const text = golfTournamentContent.locked;

  return (
    <fieldset className="dn-pick">
      <legend className="dn-sr">Pass option</legend>
      <div className="dn-tiers">
        <div className={`dn-tier tier-yb${isSelected ? ' is-selected' : ''}${isLocked ? ' is-locked' : ''}`}>
          <div className="dn-tier-head">
            <span className="dn-tier-ico">
              <GolfIcon name="flag" />
            </span>
            <div>
              <h4>{tier.title}</h4>
              {tier.pill && <span className="dn-tier-pill">{tier.pill}</span>}
            </div>
          </div>

          {isLocked ? (
            <div className="dn-locked">
              <b>{text.title}</b>
              <p>{text.desc}</p>
              <span className="dn-locked-tag">
                <GolfIcon name="clock" />
                {text.tag}
              </span>
            </div>
          ) : (
            passes
              .filter((pass) => !pass.locked)
              .map((pass) => {
                const isChecked = selectedPass === pass.passId;
                return (
                  <label
                    key={pass.passId}
                    className={`dn-pass${isChecked ? ' is-checked' : ''}${pass.soldOut ? ' is-sold-out' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gpass"
                      value={pass.passId}
                      checked={isChecked}
                      onChange={() => onSelectPass(pass.passId)}
                      disabled={pass.soldOut}
                      required={!selectedPass}
                    />
                    <span className="dn-radio" aria-hidden="true"></span>
                    <span className="dn-pass-t">
                      <b>{pass.title}</b>
                      {pass.soldOut ? <em className="dn-left">Sold out</em> : pass.note && <em className="dn-left">{pass.note}</em>}
                    </span>
                    <span className="dn-price">&#8377;{pass.price.toLocaleString('en-IN')}</span>
                  </label>
                );
              })
          )}
        </div>

        <GolfDinnerIncluded />
      </div>
    </fieldset>
  );
};

export default GolfPassGrid;
