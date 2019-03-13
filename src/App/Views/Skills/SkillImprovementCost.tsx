import * as React from 'react';
import { getICName } from '../../utils/adventurePoints/improvementCostUtils';

export interface SkillImprovementCostProps {
  ic?: number;
}

export function SkillImprovementCost (props: SkillImprovementCostProps) {
  const { ic } = props;

  if (typeof ic === 'number') {
    return (
      <div className="ic">
        {getICName (ic)}
      </div>
    );
  }

  return null;
}
