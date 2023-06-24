import { FC } from "react"
import { ImprovementCost, toString } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"

type Props = {
  ic?: ImprovementCost
}

export const SkillImprovementCost: FC<Props> = props => {
  const { ic } = props

  if (ic !== undefined) {
    return (
      <div className="ic">
        {toString(ic)}
      </div>
    )
  }

  return null
}
