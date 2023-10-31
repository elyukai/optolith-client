import { FC, memo } from "react"
import { dominationRitualsImprovementCost } from "../../../../../shared/domain/magicalActions.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedActiveDominationRitual } from "../../../../../shared/domain/spellActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  dominationRitual: DisplayedActiveDominationRitual
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveDominationRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, dominationRitual, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="DominationRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={dominationRitual}
      sortOrder={sortOrder}
      groupName={translate("Domination Rituals")}
      checkPenalty={dominationRitual.static.check_penalty}
      improvementCost={dominationRitualsImprovementCost}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a domination ritual that is currently inactive.
 */
const MemoActiveDominationRitualsListItem = memo(ActiveDominationRitualsListItem)

export { MemoActiveDominationRitualsListItem as ActiveDominationRitualsListItem }
