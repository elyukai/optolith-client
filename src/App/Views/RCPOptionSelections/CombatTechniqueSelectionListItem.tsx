import * as React from "react";
import { maybe, Maybe } from "../../../Data/Maybe";
import { member, notMember, OrderedSet, size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Checkbox } from "../Universal/Checkbox";

const CTA = CombatTechnique.A

interface Props {
  active: OrderedSet<string>
  amount: number
  combatTechnique: Record<CombatTechnique>
  disabled: Maybe<OrderedSet<string>>
  toggleCombatTechniqueId (id: string): void
}

export const CombatTechniqueSelectionListItem: React.FC<Props> = props => {
  const { active, amount, combatTechnique, disabled, toggleCombatTechniqueId } = props

  const id = CTA.id (combatTechnique)
  const name = CTA.name (combatTechnique)

  const handleSetCombatTechniqueId = React.useCallback (
    () => toggleCombatTechniqueId (id),
    [ id, toggleCombatTechniqueId ]
  )

  return (
    <Checkbox
      key={id}
      checked={member (id) (active)}
      disabled={
        (notMember (id) (active) && size (active) >= amount)
        || maybe (false) (member (id)) (disabled)
      }
      label={name}
      onClick={handleSetCombatTechniqueId}
      />
  )
}
