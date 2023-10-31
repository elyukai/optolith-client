import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedInactiveJesterTrick } from "../../../../../shared/domain/spellInactive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  jesterTrick: DisplayedInactiveJesterTrick
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveJesterTricksListItem: FC<Props> = props => {
  const { insertTopMargin, jesterTrick, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="JesterTrick"
      insertTopMargin={insertTopMargin}
      magicalAction={jesterTrick}
      sortOrder={sortOrder}
      groupName={translate("Jester Tricks")}
      checkPenalty={jesterTrick.static.check_penalty}
      improvementCost={fromRaw(jesterTrick.static.improvement_cost)}
      add={add}
    />
  )
}

/**
 * Displays a jester trick that is currently inactive.
 */
const MemoInactiveJesterTricksListItem = memo(InactiveJesterTricksListItem)

export { MemoInactiveJesterTricksListItem as InactiveJesterTricksListItem }
