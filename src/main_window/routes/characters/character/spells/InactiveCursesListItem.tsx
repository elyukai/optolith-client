import { FC, memo } from "react"
import { cursesImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedInactiveCurse } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addCurse } from "../../../../slices/magicalActions/cursesSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  curse: DisplayedInactiveCurse
  sortOrder: SpellsSortOrder
}

const InactiveCursesListItem: FC<Props> = props => {
  const { insertTopMargin, curse, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    curse.static.id,
    cursesImprovementCost,
    addCurse,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="Curse"
      insertTopMargin={insertTopMargin}
      magicalAction={curse}
      sortOrder={sortOrder}
      groupName={translate("Curses")}
      checkPenalty={curse.static.check_penalty}
      improvementCost={cursesImprovementCost}
      add={handleAdd}
    />
  )
}

/**
 * Displays a curse that is currently inactive.
 */
const MemoInactiveCursesListItem = memo(InactiveCursesListItem)

export { MemoInactiveCursesListItem as InactiveCursesListItem }
