import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveElvenMagicalSong } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import {
  decrementElvenMagicalSong,
  incrementElvenMagicalSong,
  removeElvenMagicalSong,
  setElvenMagicalSong,
} from "../../../../slices/magicalActions/elvenMagicalSongsSlice.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  elvenMagicalSong: DisplayedActiveElvenMagicalSong
  sortOrder: SpellsSortOrder
}

const ActiveElvenMagicalSongsListItem: FC<Props> = props => {
  const { insertTopMargin, elvenMagicalSong, sortOrder } = props

  const translate = useTranslate()

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    elvenMagicalSong.static.id,
    elvenMagicalSong.dynamic.value,
    elvenMagicalSong.maximum,
    elvenMagicalSong.minimum ?? 0,
    fromRaw(elvenMagicalSong.static.improvement_cost),
    incrementElvenMagicalSong,
    decrementElvenMagicalSong,
    setElvenMagicalSong,
    removeElvenMagicalSong,
  )

  return (
    <ActiveMagicalActionsListItem
      kind="ElvenMagicalSong"
      insertTopMargin={insertTopMargin}
      magicalAction={elvenMagicalSong}
      sortOrder={sortOrder}
      groupName={translate("Elven Magical Songs")}
      checkPenalty={elvenMagicalSong.static.check_penalty}
      improvementCost={fromRaw(elvenMagicalSong.static.improvement_cost)}
      addPoint={handleAddPoint}
      removePoint={handleRemovePoint}
      setToMaximumPoints={handleSetToMaximumPoints}
      setToMinimumPoints={handleSetToMinimumPoints}
      remove={handleRemove}
    />
  )
}

/**
 * Displays an Elven magical song that is currently inactive.
 */
const MemoActiveElvenMagicalSongsListItem = memo(ActiveElvenMagicalSongsListItem)

export { MemoActiveElvenMagicalSongsListItem as ActiveElvenMagicalSongsListItem }
