import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveJesterTrick } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addJesterTrick } from "../../../../slices/magicalActions/jesterTricksSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  jesterTrick: DisplayedInactiveJesterTrick
  sortOrder: SpellsSortOrder
}

const InactiveJesterTricksListItem: FC<Props> = props => {
  const { insertTopMargin, jesterTrick, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    jesterTrick.static.id,
    fromRaw(jesterTrick.static.improvement_cost),
    addJesterTrick,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="JesterTrick"
      insertTopMargin={insertTopMargin}
      magicalAction={jesterTrick}
      sortOrder={sortOrder}
      groupName={translate("Jester Tricks")}
      checkPenalty={jesterTrick.static.check_penalty}
      improvementCost={fromRaw(jesterTrick.static.improvement_cost)}
      add={handleAdd}
    />
  )
}

/**
 * Displays a jester trick that is currently inactive.
 */
const MemoInactiveJesterTricksListItem = memo(InactiveJesterTricksListItem)

export { MemoInactiveJesterTricksListItem as InactiveJesterTricksListItem }
