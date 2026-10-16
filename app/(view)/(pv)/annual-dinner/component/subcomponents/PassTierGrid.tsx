'use client';

import React, { useMemo } from 'react';
import type { ApiEventPass } from '../../services/annualDinner.service';
import { PassTierCard, type PassTierGroup } from './PassTierCard';

interface PassTierGridProps {
  passes: ApiEventPass[];
  selectedPass: string | null;
  onSelectPass: (passId: string) => void;
}

export const PassTierGrid: React.FC<PassTierGridProps> = ({ passes, selectedPass, onSelectPass }) => {
  const tierGroups = useMemo<PassTierGroup[]>(() => {
    const map = new Map<string, PassTierGroup>();

    // Sort passes by displayOrder from DB
    const sorted = [...passes].sort((a, b) => a.displayOrder - b.displayOrder);

    for (const p of sorted) {
      const groupKey = p.tierGroup || 'general';
      if (!map.has(groupKey)) {
        map.set(groupKey, {
          tierGroup: p.tierGroup,
          tierTitle: p.tierTitle || p.title,
          batchEligibility: p.batchEligibility,
          status: p.status,
          description: p.description,
          statusNote: p.statusNote,
          passes: [],
        });
      }
      const g = map.get(groupKey)!;
      g.passes.push(p);
      if (p.status !== 'locked') {
        g.status = 'active';
      }
    }

    return Array.from(map.values());
  }, [passes]);

  return (
    <fieldset className="dn-pick">
      <legend className="dn-sr">Pass option</legend>
      <div className="dn-tiers">
        {tierGroups.map((group) => (
          <PassTierCard
            key={group.tierGroup}
            group={group}
            selectedPass={selectedPass}
            onSelectPass={onSelectPass}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default PassTierGrid;
