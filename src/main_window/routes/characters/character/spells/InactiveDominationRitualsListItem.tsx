import { FC, memo } from "react"
import { dominationRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedInactiveDominationRitual } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addDominationRitual } from "../../../../slices/magicalActions/dominationRitualsSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  dominationRitual: DisplayedInactiveDominationRitual
  sortOrder: SpellsSortOrder
}

const InactiveDominationRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, dominationRitual, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    dominationRitual.static.id,
    dominationRitualsImprovementCost,
    addDominationRitual,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="DominationRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={dominationRitual}
      sortOrder={sortOrder}
      groupName={translate("Domination Rituals")}
      checkPenalty={dominationRitual.static.check_penalty}
      improvementCost={dominationRitualsImprovementCost}
      add={handleAdd}
    />
  )
}

/**
 * Displays a domination ritual that is currently inactive.
 */
const MemoInactiveDominationRitualsListItem = memo(InactiveDominationRitualsListItem)

export { MemoInactiveDominationRitualsListItem as InactiveDominationRitualsListItem }
