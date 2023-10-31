import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedActiveElvenMagicalSong } from "../../../../../shared/domain/spellActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  elvenMagicalSong: DisplayedActiveElvenMagicalSong
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveElvenMagicalSongsListItem: FC<Props> = props => {
  const { insertTopMargin, elvenMagicalSong, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="ElvenMagicalSong"
      insertTopMargin={insertTopMargin}
      magicalAction={elvenMagicalSong}
      sortOrder={sortOrder}
      groupName={translate("Elven Magical Songs")}
      checkPenalty={elvenMagicalSong.static.check_penalty}
      improvementCost={fromRaw(elvenMagicalSong.static.improvement_cost)}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays an Elven magical song that is currently inactive.
 */
const MemoActiveElvenMagicalSongsListItem = memo(ActiveElvenMagicalSongsListItem)

export { MemoActiveElvenMagicalSongsListItem as ActiveElvenMagicalSongsListItem }
