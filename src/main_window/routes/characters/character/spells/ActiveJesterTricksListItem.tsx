import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedActiveJesterTrick } from "../../../../../shared/domain/spellActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  jesterTrick: DisplayedActiveJesterTrick
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveJesterTricksListItem: FC<Props> = props => {
  const { insertTopMargin, jesterTrick, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="JesterTrick"
      insertTopMargin={insertTopMargin}
      magicalAction={jesterTrick}
      sortOrder={sortOrder}
      groupName={translate("Jester Tricks")}
      checkPenalty={jesterTrick.static.check_penalty}
      improvementCost={fromRaw(jesterTrick.static.improvement_cost)}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a jester trick that is currently inactive.
 */
const MemoActiveJesterTricksListItem = memo(ActiveJesterTricksListItem)

export { MemoActiveJesterTricksListItem as ActiveJesterTricksListItem }
