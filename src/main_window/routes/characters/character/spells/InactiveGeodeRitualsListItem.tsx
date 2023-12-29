import { FC, memo } from "react"
import { geodeRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedInactiveGeodeRitual } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  geodeRitual: DisplayedInactiveGeodeRitual
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveGeodeRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, geodeRitual, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="GeodeRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={geodeRitual}
      sortOrder={sortOrder}
      groupName={translate("Geode Rituals")}
      improvementCost={geodeRitualsImprovementCost}
      add={add}
    />
  )
}

/**
 * Displays a geode ritual that is currently inactive.
 */
const MemoInactiveGeodeRitualsListItem = memo(InactiveGeodeRitualsListItem)

export { MemoInactiveGeodeRitualsListItem as InactiveGeodeRitualsListItem }
