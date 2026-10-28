'use client';

import React from 'react';
import type { ApiEventPass } from '../../services/annualDinner.service';

export interface PassTierGroup {
  tierGroup: string;
  tierTitle: string;
  batchEligibility: string | null;
  status: string;
  description: string | null;
  statusNote: string | null;
  passes: ApiEventPass[];
}

interface PassTierCardProps {
  group: PassTierGroup;
  selectedPass: string | null;
  onSelectPass: (passId: string) => void;
}

export const PassTierCard: React.FC<PassTierCardProps> = ({ group, selectedPass, onSelectPass }) => {
  const isSelected = group.passes.some((p) => p.passId === selectedPass);
  const isLocked = group.status === 'locked' || group.passes.every((p) => p.status === 'locked');

  const renderTierIcon = () => {
    switch (group.tierGroup.toLowerCase()) {
      case 'younger':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m12 4 10 5-10 5L2 9l10-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        );
      case 'early':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
            <path
              d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'regular':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7v5l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'golden':
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 17.3 6.2 21l1.6-6.6L2.5 9.9l6.7-.6L12 3l2.8 6.3 6.7.6-5.3 4.5L18 21z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const getTierClass = () => {
    switch (group.tierGroup.toLowerCase()) {
      case 'younger':
        return 'tier-yb';
      case 'early':
        return 'tier-eb';
      case 'regular':
        return 'tier-reg';
      case 'golden':
        return 'tier-gold';
      default:
        return `tier-${group.tierGroup}`;
    }
  };

  // The pill shows only the eligibility; any " · ..." suffix (e.g. "opens after Early Bird") is covered elsewhere in the card
  const pill = group.batchEligibility?.split(' · ')[0];

  // Collect perks from metadata if present
  const perks: string[] = [];
  group.passes.forEach((p) => {
    if (p.metadata && Array.isArray((p.metadata as Record<string, unknown>).perks)) {
      ((p.metadata as Record<string, unknown>).perks as string[]).forEach((item) => {
        if (!perks.includes(item)) perks.push(item);
      });
    }
  });

  return (
    <div
      className={`dn-tier ${getTierClass()} ${isSelected ? 'is-selected' : ''} ${isLocked ? 'is-locked' : ''}`}
    >
      <div className="dn-tier-head">
        <span className="dn-tier-ico">{renderTierIcon()}</span>
        <div>
          <h4>{group.tierTitle}</h4>
          {pill && <span className="dn-tier-pill">{pill}</span>}
        </div>
      </div>

      {isLocked ? (
        <div className="dn-locked">
          <b>{group.statusNote || 'Opens later'}</b>
          <p>
            {group.description ||
              'Passes for this tier will open once earlier allocations are completed. Pricing is updated upon release.'}
          </p>
          <span className="dn-locked-tag">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7v5l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Not open yet
          </span>
        </div>
      ) : (
        <>
          {group.passes.map((pass) => {
            const isChecked = selectedPass === pass.passId;
            const isSoldOut = pass.availableQuantity === 0;
            return (
              <label
                key={pass.passId}
                className={`dn-pass ${isChecked ? 'is-checked' : ''} ${isSoldOut ? 'is-sold-out' : ''}`}
              >
                <input
                  type="radio"
                  name="pass"
                  value={pass.passId}
                  checked={isChecked}
                  onChange={() => onSelectPass(pass.passId)}
                  disabled={isSoldOut}
                  required={!selectedPass}
                />
                <span className="dn-radio" aria-hidden="true"></span>
                <span className="dn-pass-t">
                  <b>{pass.title}</b>
                  {isSoldOut ? (
                    <em className="dn-left">Sold out</em>
                  ) : pass.statusNote && pass.statusNote !== pass.title && (
                    <em className="dn-left">{pass.statusNote}</em>
                  )}
                </span>
                <span className="dn-price">&#8377;{pass.price.toLocaleString('en-IN')}</span>
              </label>
            );
          })}

          {perks.length > 0 && (
            <ul className="dn-perks">
              {perks.map((perk, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5.5 12.5 4.2 4.2L18.5 8"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {perk}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default PassTierCard;
