import { FC, memo } from "react"
import { cursesImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedActiveCurse } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  curse: DisplayedActiveCurse
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveCursesListItem: FC<Props> = props => {
  const { insertTopMargin, curse, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="Curse"
      insertTopMargin={insertTopMargin}
      magicalAction={curse}
      sortOrder={sortOrder}
      groupName={translate("Curses")}
      checkPenalty={curse.static.check_penalty}
      improvementCost={cursesImprovementCost}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a curse that is currently inactive.
 */
const MemoActiveCursesListItem = memo(ActiveCursesListItem)

export { MemoActiveCursesListItem as ActiveCursesListItem }
