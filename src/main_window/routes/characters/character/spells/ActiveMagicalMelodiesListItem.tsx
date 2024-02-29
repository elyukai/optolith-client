import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveMagicalMelody } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementMagicalMelody,
  incrementMagicalMelody,
  removeMagicalMelody,
  setMagicalMelody,
} from "../../../../slices/magicalActions/magicalMelodiesSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalMelody: DisplayedActiveMagicalMelody
  sortOrder: SpellsSortOrder
}

const ActiveMagicalMelodiesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalMelody, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    magicalMelody.static.id,
    magicalMelody.dynamic.value,
    magicalMelody.maximum,
    magicalMelody.minimum ?? 0,
    fromRaw(magicalMelody.static.improvement_cost),
    incrementMagicalMelody,
    decrementMagicalMelody,
    setMagicalMelody,
    removeMagicalMelody,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="MagicalMelody"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalMelody}
      sortOrder={sortOrder}
      groupName={translate("Magical Melodies")}
      checkPenalty={magicalMelody.static.check_penalty}
      improvementCost={fromRaw(magicalMelody.static.improvement_cost)}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a magical melody that is currently inactive.
 */
const MemoActiveMagicalMelodiesListItem = memo(ActiveMagicalMelodiesListItem)

export { MemoActiveMagicalMelodiesListItem as ActiveMagicalMelodiesListItem }
