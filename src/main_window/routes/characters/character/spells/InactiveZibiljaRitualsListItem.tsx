import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedInactiveZibiljaRitual } from "../../../../../shared/domain/spellInactive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  zibiljaRitual: DisplayedInactiveZibiljaRitual
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveZibiljaRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, zibiljaRitual, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="ZibiljaRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={zibiljaRitual}
      sortOrder={sortOrder}
      groupName={translate("Zibilja Rituals")}
      checkPenalty={zibiljaRitual.static.check_penalty}
      improvementCost={fromRaw(zibiljaRitual.static.improvement_cost)}
      add={add}
    />
  )
}

/**
 * Displays a zibilja ritual that is currently inactive.
 */
const MemoInactiveZibiljaRitualsListItem = memo(InactiveZibiljaRitualsListItem)

export { MemoInactiveZibiljaRitualsListItem as InactiveZibiljaRitualsListItem }
