import * as React from "react"
import { icFromJs } from "../../Constants/Groups"
import { icToStr } from "../../Utilities/IC.gen"

interface Props {
  ic?: number
}

export const SkillImprovementCost: React.FC<Props> = props => {
  const { ic } = props

  if (typeof ic === "number") {
    return (
      <div className="ic">
        {icToStr (icFromJs (ic))}
      </div>
    )
  }

  return null
}
