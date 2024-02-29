import { FC, memo } from "react"
import { geodeRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedActiveGeodeRitual } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementGeodeRitual,
  incrementGeodeRitual,
  removeGeodeRitual,
  setGeodeRitual,
} from "../../../../slices/magicalActions/geodeRitualsSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  geodeRitual: DisplayedActiveGeodeRitual
  sortOrder: SpellsSortOrder
}

const ActiveGeodeRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, geodeRitual, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    geodeRitual.static.id,
    geodeRitual.dynamic.value,
    geodeRitual.maximum,
    geodeRitual.minimum ?? 0,
    geodeRitualsImprovementCost,
    incrementGeodeRitual,
    decrementGeodeRitual,
    setGeodeRitual,
    removeGeodeRitual,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="GeodeRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={geodeRitual}
      sortOrder={sortOrder}
      groupName={translate("Geode Rituals")}
      improvementCost={geodeRitualsImprovementCost}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a geode ritual that is currently inactive.
 */
const MemoActiveGeodeRitualsListItem = memo(ActiveGeodeRitualsListItem)

export { MemoActiveGeodeRitualsListItem as ActiveGeodeRitualsListItem }
