import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveZibiljaRitual } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementZibiljaRitual,
  incrementZibiljaRitual,
  removeZibiljaRitual,
  setZibiljaRitual,
} from "../../../../slices/magicalActions/zibiljaRitualsSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  zibiljaRitual: DisplayedActiveZibiljaRitual
  sortOrder: SpellsSortOrder
}

const ActiveZibiljaRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, zibiljaRitual, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    zibiljaRitual.static.id,
    zibiljaRitual.dynamic.value,
    zibiljaRitual.maximum,
    zibiljaRitual.minimum ?? 0,
    fromRaw(zibiljaRitual.static.improvement_cost),
    incrementZibiljaRitual,
    decrementZibiljaRitual,
    setZibiljaRitual,
    removeZibiljaRitual,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="ZibiljaRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={zibiljaRitual}
      sortOrder={sortOrder}
      groupName={translate("Zibilja Rituals")}
      checkPenalty={zibiljaRitual.static.check_penalty}
      improvementCost={fromRaw(zibiljaRitual.static.improvement_cost)}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a zibilja ritual that is currently inactive.
 */
const MemoActiveZibiljaRitualsListItem = memo(ActiveZibiljaRitualsListItem)

export { MemoActiveZibiljaRitualsListItem as ActiveZibiljaRitualsListItem }
