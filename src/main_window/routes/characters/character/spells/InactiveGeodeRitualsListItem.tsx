import { FC, memo } from "react"
import { geodeRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedInactiveGeodeRitual } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addGeodeRitual } from "../../../../slices/magicalActions/geodeRitualsSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  geodeRitual: DisplayedInactiveGeodeRitual
  sortOrder: SpellsSortOrder
}

const InactiveGeodeRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, geodeRitual, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    geodeRitual.static.id,
    geodeRitualsImprovementCost,
    addGeodeRitual,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="GeodeRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={geodeRitual}
      sortOrder={sortOrder}
      groupName={translate("Geode Rituals")}
      improvementCost={geodeRitualsImprovementCost}
      add={handleAdd}
    />
  )
}

/**
 * Displays a geode ritual that is currently inactive.
 */
const MemoInactiveGeodeRitualsListItem = memo(InactiveGeodeRitualsListItem)

export { MemoInactiveGeodeRitualsListItem as InactiveGeodeRitualsListItem }
