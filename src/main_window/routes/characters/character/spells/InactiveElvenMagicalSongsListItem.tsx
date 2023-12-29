import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveElvenMagicalSong } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  elvenMagicalSong: DisplayedInactiveElvenMagicalSong
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveElvenMagicalSongsListItem: FC<Props> = props => {
  const { insertTopMargin, elvenMagicalSong, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="ElvenMagicalSong"
      insertTopMargin={insertTopMargin}
      magicalAction={elvenMagicalSong}
      sortOrder={sortOrder}
      groupName={translate("Elven Magical Songs")}
      checkPenalty={elvenMagicalSong.static.check_penalty}
      improvementCost={fromRaw(elvenMagicalSong.static.improvement_cost)}
      add={add}
    />
  )
}

/**
 * Displays an Elven magical song that is currently inactive.
 */
const MemoInactiveElvenMagicalSongsListItem = memo(InactiveElvenMagicalSongsListItem)

export { MemoInactiveElvenMagicalSongsListItem as InactiveElvenMagicalSongsListItem }
