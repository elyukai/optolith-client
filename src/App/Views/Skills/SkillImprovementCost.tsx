import * as React from "react"
import { icToStr, ImprovementCost } from "../../Utilities/ImprovementCost"

interface Props {
  ic?: ImprovementCost
}

export const SkillImprovementCost: React.FC<Props> = props => {
  const { ic } = props

  if (typeof ic === "number") {
    return (
      <div className="ic">
        {icToStr (ic)}
      </div>
    )
  }

  return null
}
