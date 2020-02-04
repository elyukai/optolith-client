import * as React from "react";
import { getICName } from "../../Utilities/AdventurePoints/improvementCostUtils";

interface Props {
  ic?: number
}

export const SkillImprovementCost: React.FC<Props> = props => {
  const { ic } = props

  if (typeof ic === "number") {
    return (
      <div className="ic">
        {getICName (ic)}
      </div>
    )
  }

  return null
}
