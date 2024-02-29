import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveMagicalDance } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addMagicalDance } from "../../../../slices/magicalActions/magicalDancesSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalDance: DisplayedInactiveMagicalDance
  sortOrder: SpellsSortOrder
}

const InactiveMagicalDancesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalDance, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    magicalDance.static.id,
    fromRaw(magicalDance.static.improvement_cost),
    addMagicalDance,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="MagicalDance"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalDance}
      sortOrder={sortOrder}
      groupName={translate("Magical Dances")}
      improvementCost={fromRaw(magicalDance.static.improvement_cost)}
      add={handleAdd}
    />
  )
}

/**
 * Displays a magical dance that is currently inactive.
 */
const MemoInactiveMagicalDancesListItem = memo(InactiveMagicalDancesListItem)

export { MemoInactiveMagicalDancesListItem as InactiveMagicalDancesListItem }
