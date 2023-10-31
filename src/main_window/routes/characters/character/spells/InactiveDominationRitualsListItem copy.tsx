import { FC, memo } from "react"
import { dominationRitualsImprovementCost } from "../../../../../shared/domain/magicalActions.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedInactiveDominationRitual } from "../../../../../shared/domain/spellInactive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  dominationRitual: DisplayedInactiveDominationRitual
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveDominationRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, dominationRitual, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="DominationRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={dominationRitual}
      sortOrder={sortOrder}
      groupName={translate("Domination Rituals")}
      checkPenalty={dominationRitual.static.check_penalty}
      improvementCost={dominationRitualsImprovementCost}
      add={add}
    />
  )
}

/**
 * Displays a domination ritual that is currently inactive.
 */
const MemoInactiveDominationRitualsListItem = memo(InactiveDominationRitualsListItem)

export { MemoInactiveDominationRitualsListItem as InactiveDominationRitualsListItem }
