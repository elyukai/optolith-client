import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { FC } from "react"

type Props = {
  entry: {
    improvementCost?: ImprovementCost
  }
}

/**
 * Returns a row section that displays an improvement cost.
 */
export const SkillImprovementCost: FC<Props> = props => {
  const { improvementCost } = props.entry

  if (improvementCost !== undefined) {
    return <div className="ic">{improvementCost}</div>
  }

  return null
}
