'use client';

import React from 'react';
import type { PassTier } from '../../content';

interface PassAddonsProps {
  currentTier: PassTier | null;
  teachers: number;
  setTeachers: (num: number) => void;
  spouseName: string;
  setSpouseName: (name: string) => void;
  under12: number;
  setUnder12: (num: number) => void;
  above12: number;
  setAbove12: (num: number) => void;
}

export const PassAddons: React.FC<PassAddonsProps> = ({
  currentTier,
  teachers,
  setTeachers,
  spouseName,
  setSpouseName,
  under12,
  setUnder12,
  above12,
  setAbove12,
}) => {
  if (!currentTier) return null;

  return (
    <div id="dn-step2">
      <div className="cf-step">
        <span className="cf-num">2</span>
        <h3>Add-ons</h3>
      </div>

      <div className="dn-sponsor">
        <span className="dn-sponsor-ico">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </span>
        <div className="dn-sponsor-t">
          <b>Sponsor a teacher</b>
          <span>&#8377;5,000 per teacher &middot; available with every pass</span>
        </div>
        <div className="field">
          <label htmlFor="ad-teachers" className="dn-sr">
            Number of teachers to sponsor
          </label>
          <select
            id="ad-teachers"
            name="teachers"
            value={teachers}
            onChange={(e) => setTeachers(parseInt(e.target.value, 10))}
          >
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>
                {i === 0 ? 'None' : i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dn-extras" id="dn-spouse" hidden={!currentTier.spouse}>
        <div className="field">
          <label htmlFor="ad-spouse">Spouse name</label>
          <input
            id="ad-spouse"
            name="spouse"
            type="text"
            placeholder="Please enter name"
            value={spouseName}
            onChange={(e) => setSpouseName(e.target.value)}
          />
        </div>
      </div>

      <div
        className="dn-extras dn-addons"
        id="dn-addons"
        hidden={currentTier.group !== 'golden'}
      >
        <h4>Golden Pass extras</h4>
        <div className="field-row">
          <div className="field">
            <label htmlFor="ad-under12">
              Children under 12 <span className="dn-note">&#8377;2,500 per child</span>
            </label>
            <select
              id="ad-under12"
              name="under12"
              value={under12}
              onChange={(e) => setUnder12(parseInt(e.target.value, 10))}
            >
              {[...Array(7)].map((_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? 'None' : i}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ad-above12">
              Children above 12 <span className="dn-note">&#8377;3,000 per child</span>
            </label>
            <select
              id="ad-above12"
              name="above12"
              value={above12}
              onChange={(e) => setAbove12(parseInt(e.target.value, 10))}
            >
              {[...Array(7)].map((_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? 'None' : i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassAddons;
