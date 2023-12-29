import { FC, memo } from "react"
import { cursesImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedInactiveCurse } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  curse: DisplayedInactiveCurse
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveCursesListItem: FC<Props> = props => {
  const { insertTopMargin, curse, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="Curse"
      insertTopMargin={insertTopMargin}
      magicalAction={curse}
      sortOrder={sortOrder}
      groupName={translate("Curses")}
      checkPenalty={curse.static.check_penalty}
      improvementCost={cursesImprovementCost}
      add={add}
    />
  )
}

/**
 * Displays a curse that is currently inactive.
 */
const MemoInactiveCursesListItem = memo(InactiveCursesListItem)

export { MemoInactiveCursesListItem as InactiveCursesListItem }
