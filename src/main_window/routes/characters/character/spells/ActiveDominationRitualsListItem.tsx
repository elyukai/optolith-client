import { FC, memo } from "react"
import { dominationRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedActiveDominationRitual } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementDominationRitual,
  incrementDominationRitual,
  removeDominationRitual,
  setDominationRitual,
} from "../../../../slices/magicalActions/dominationRitualsSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  dominationRitual: DisplayedActiveDominationRitual
  sortOrder: SpellsSortOrder
}

const ActiveDominationRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, dominationRitual, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    dominationRitual.static.id,
    dominationRitual.dynamic.value,
    dominationRitual.maximum,
    dominationRitual.minimum ?? 0,
    dominationRitualsImprovementCost,
    incrementDominationRitual,
    decrementDominationRitual,
    setDominationRitual,
    removeDominationRitual,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="DominationRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={dominationRitual}
      sortOrder={sortOrder}
      groupName={translate("Domination Rituals")}
      checkPenalty={dominationRitual.static.check_penalty}
      improvementCost={dominationRitualsImprovementCost}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a domination ritual that is currently inactive.
 */
const MemoActiveDominationRitualsListItem = memo(ActiveDominationRitualsListItem)

export { MemoActiveDominationRitualsListItem as ActiveDominationRitualsListItem }
