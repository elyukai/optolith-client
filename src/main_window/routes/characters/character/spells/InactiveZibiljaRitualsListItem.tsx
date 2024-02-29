import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveZibiljaRitual } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addZibiljaRitual } from "../../../../slices/magicalActions/zibiljaRitualsSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  zibiljaRitual: DisplayedInactiveZibiljaRitual
  sortOrder: SpellsSortOrder
}

const InactiveZibiljaRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, zibiljaRitual, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    zibiljaRitual.static.id,
    fromRaw(zibiljaRitual.static.improvement_cost),
    addZibiljaRitual,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="ZibiljaRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={zibiljaRitual}
      sortOrder={sortOrder}
      groupName={translate("Zibilja Rituals")}
      checkPenalty={zibiljaRitual.static.check_penalty}
      improvementCost={fromRaw(zibiljaRitual.static.improvement_cost)}
      add={handleAdd}
    />
  )
}

/**
 * Displays a zibilja ritual that is currently inactive.
 */
const MemoInactiveZibiljaRitualsListItem = memo(InactiveZibiljaRitualsListItem)

export { MemoInactiveZibiljaRitualsListItem as InactiveZibiljaRitualsListItem }
