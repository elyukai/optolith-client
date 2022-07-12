import * as React from "react"
import { isNothing, maybe } from "../../../Data/Maybe"
import { divideBy } from "../../../Data/Num"
import { lookup, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Skill } from "../../Models/Wiki/Skill"
import { minus } from "../../Utilities/Chars"
import { getAPForActivatation, getAPForInc } from "../../Utilities/ImprovementCost"
import { BorderButton } from "../Universal/BorderButton"

const SA = Skill.A

interface Props {
  active: OrderedMap<string, number>
  ap_left: number
  skill: Record<Skill>
  addSkillPoint: (id: string) => void
  removeSkillPoint: (id: string) => void
}

export const SkillSelectionListItem: React.FC<Props> = props => {
  const { active, ap_left, skill, addSkillPoint, removeSkillPoint } = props

  const id = SA.id (skill)
  const name = SA.name (skill)
  const ic = SA.ic (skill)

  const msr = lookup (id) (active)

  const value = maybe (0) (divideBy (getAPForActivatation (ic))) (msr)

  const nextCosts = getAPForInc (ic, value)

  const handleAddPoint = React.useCallback (
    () => addSkillPoint (id),
    [ id, addSkillPoint ]
  )

  const handleRemovePoint = React.useCallback (
    () => removeSkillPoint (id),
    [ id, removeSkillPoint ]
  )

  return (
    <li key={id}>
      <div className="skillname">{name}</div>
      <span>{value}</span>
      <BorderButton
        label="+"
        disabled={ap_left < nextCosts}
        onClick={handleAddPoint}
        />
      <BorderButton
        label={minus}
        disabled={isNothing (msr)}
        onClick={handleRemovePoint}
        />
    </li>
  )
}
