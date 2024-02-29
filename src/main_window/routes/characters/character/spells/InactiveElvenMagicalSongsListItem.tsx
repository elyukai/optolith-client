import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveElvenMagicalSong } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addElvenMagicalSong } from "../../../../slices/magicalActions/elvenMagicalSongsSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  elvenMagicalSong: DisplayedInactiveElvenMagicalSong
  sortOrder: SpellsSortOrder
}

const InactiveElvenMagicalSongsListItem: FC<Props> = props => {
  const { insertTopMargin, elvenMagicalSong, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    elvenMagicalSong.static.id,
    fromRaw(elvenMagicalSong.static.improvement_cost),
    addElvenMagicalSong,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="ElvenMagicalSong"
      insertTopMargin={insertTopMargin}
      magicalAction={elvenMagicalSong}
      sortOrder={sortOrder}
      groupName={translate("Elven Magical Songs")}
      checkPenalty={elvenMagicalSong.static.check_penalty}
      improvementCost={fromRaw(elvenMagicalSong.static.improvement_cost)}
      add={handleAdd}
    />
  )
}

/**
 * Displays an Elven magical song that is currently inactive.
 */
const MemoInactiveElvenMagicalSongsListItem = memo(InactiveElvenMagicalSongsListItem)

export { MemoInactiveElvenMagicalSongsListItem as InactiveElvenMagicalSongsListItem }
