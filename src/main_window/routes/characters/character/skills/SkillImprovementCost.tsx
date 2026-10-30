import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { FC } from "react"

type Props = {
  ic?: ImprovementCost
}

/**
 * Returns a row section that displays an improvement cost.
 */
export const SkillImprovementCost: FC<Props> = props => {
  const { ic } = props

  if (ic !== undefined) {
    return <div className="ic">{ic}</div>
  }

  return null
}
