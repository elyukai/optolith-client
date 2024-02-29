import { FC, memo } from "react"
import { DisplayedActiveAnimistPower } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementAnimistPower,
  incrementAnimistPower,
  removeAnimistPower,
  setAnimistPower,
} from "../../../../slices/magicalActions/animistPowersSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  animistPower: DisplayedActiveAnimistPower
  sortOrder: SpellsSortOrder
}

const ActiveAnimistPowersListItem: FC<Props> = props => {
  const { insertTopMargin, animistPower, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    animistPower.static.id,
    animistPower.dynamic.value,
    animistPower.maximum,
    animistPower.minimum ?? 0,
    animistPower.improvementCost,
    incrementAnimistPower,
    decrementAnimistPower,
    setAnimistPower,
    removeAnimistPower,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="AnimistPower"
      insertTopMargin={insertTopMargin}
      magicalAction={animistPower}
      sortOrder={sortOrder}
      groupName={translate("Animist Powers")}
      improvementCost={animistPower.improvementCost}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays a animist power that is currently inactive.
 */
const MemoActiveAnimistPowersListItem = memo(ActiveAnimistPowersListItem)

export { MemoActiveAnimistPowersListItem as ActiveAnimistPowersListItem }
