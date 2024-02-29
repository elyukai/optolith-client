import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveMagicalDance } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementMagicalDance,
  incrementMagicalDance,
  removeMagicalDance,
  setMagicalDance,
} from "../../../../slices/magicalActions/magicalDancesSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalDance: DisplayedActiveMagicalDance
  sortOrder: SpellsSortOrder
}

const ActiveMagicalDancesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalDance, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    magicalDance.static.id,
    magicalDance.dynamic.value,
    magicalDance.maximum,
    magicalDance.minimum ?? 0,
    fromRaw(magicalDance.static.improvement_cost),
    incrementMagicalDance,
    decrementMagicalDance,
    setMagicalDance,
    removeMagicalDance,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="MagicalDance"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalDance}
      sortOrder={sortOrder}
      groupName={translate("Magical Dances")}
      improvementCost={fromRaw(magicalDance.static.improvement_cost)}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a magical dance that is currently inactive.
 */
const MemoActiveMagicalDancesListItem = memo(ActiveMagicalDancesListItem)

export { MemoActiveMagicalDancesListItem as ActiveMagicalDancesListItem }
