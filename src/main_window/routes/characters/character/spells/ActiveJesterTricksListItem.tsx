import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveJesterTrick } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementJesterTrick,
  incrementJesterTrick,
  removeJesterTrick,
  setJesterTrick,
} from "../../../../slices/magicalActions/jesterTricksSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  jesterTrick: DisplayedActiveJesterTrick
  sortOrder: SpellsSortOrder
}

const ActiveJesterTricksListItem: FC<Props> = props => {
  const { insertTopMargin, jesterTrick, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    jesterTrick.static.id,
    jesterTrick.dynamic.value,
    jesterTrick.maximum,
    jesterTrick.minimum ?? 0,
    fromRaw(jesterTrick.static.improvement_cost),
    incrementJesterTrick,
    decrementJesterTrick,
    setJesterTrick,
    removeJesterTrick,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="JesterTrick"
      insertTopMargin={insertTopMargin}
      magicalAction={jesterTrick}
      sortOrder={sortOrder}
      groupName={translate("Jester Tricks")}
      checkPenalty={jesterTrick.static.check_penalty}
      improvementCost={fromRaw(jesterTrick.static.improvement_cost)}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a jester trick that is currently inactive.
 */
const MemoActiveJesterTricksListItem = memo(ActiveJesterTricksListItem)

export { MemoActiveJesterTricksListItem as ActiveJesterTricksListItem }
