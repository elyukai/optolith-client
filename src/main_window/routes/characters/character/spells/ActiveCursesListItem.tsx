import { FC, memo } from "react"
import { cursesImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedActiveCurse } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementCurse,
  incrementCurse,
  removeCurse,
  setCurse,
} from "../../../../slices/magicalActions/cursesSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  curse: DisplayedActiveCurse
  sortOrder: SpellsSortOrder
}

const ActiveCursesListItem: FC<Props> = props => {
  const { insertTopMargin, curse, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    curse.static.id,
    curse.dynamic.value,
    curse.maximum,
    curse.minimum ?? 0,
    cursesImprovementCost,
    incrementCurse,
    decrementCurse,
    setCurse,
    removeCurse,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="Curse"
      insertTopMargin={insertTopMargin}
      magicalAction={curse}
      sortOrder={sortOrder}
      groupName={translate("Curses")}
      checkPenalty={curse.static.check_penalty}
      improvementCost={cursesImprovementCost}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a curse that is currently inactive.
 */
const MemoActiveCursesListItem = memo(ActiveCursesListItem)

export { MemoActiveCursesListItem as ActiveCursesListItem }
