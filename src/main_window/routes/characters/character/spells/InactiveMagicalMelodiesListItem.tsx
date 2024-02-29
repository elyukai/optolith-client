import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveMagicalMelody } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addMagicalMelody } from "../../../../slices/magicalActions/magicalMelodiesSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalMelody: DisplayedInactiveMagicalMelody
  sortOrder: SpellsSortOrder
}

const InactiveMagicalMelodiesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalMelody, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    magicalMelody.static.id,
    fromRaw(magicalMelody.static.improvement_cost),
    addMagicalMelody,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="MagicalMelody"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalMelody}
      sortOrder={sortOrder}
      groupName={translate("Magical Melodies")}
      checkPenalty={magicalMelody.static.check_penalty}
      improvementCost={fromRaw(magicalMelody.static.improvement_cost)}
      add={handleAdd}
    />
  )
}

/**
 * Displays a magical melody that is currently inactive.
 */
const MemoInactiveMagicalMelodiesListItem = memo(InactiveMagicalMelodiesListItem)

export { MemoInactiveMagicalMelodiesListItem as InactiveMagicalMelodiesListItem }
