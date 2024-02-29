import { FC, memo } from "react"
import { DisplayedInactiveAnimistPower } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { addAnimistPower } from "../../../../slices/magicalActions/animistPowersSlice.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  animistPower: DisplayedInactiveAnimistPower
  sortOrder: SpellsSortOrder
}

const InactiveAnimistPowersListItem: FC<Props> = props => {
  const { insertTopMargin, animistPower, sortOrder } = props

  const translate = useTranslate()

  const { handleAdd } = useInactiveActivatableActions(
    animistPower.static.id,
    animistPower.improvementCost,
    addAnimistPower,
  )

  return (
    <InactiveMagicalActionsListItem
      kind="AnimistPower"
      insertTopMargin={insertTopMargin}
      magicalAction={animistPower}
      sortOrder={sortOrder}
      groupName={translate("Animist Powers")}
      improvementCost={animistPower.improvementCost}
      add={handleAdd}
    />
  )
}

/**
 * Displays a animist power that is currently inactive.
 */
const MemoInactiveAnimistPowersListItem = memo(InactiveAnimistPowersListItem)

export { MemoInactiveAnimistPowersListItem as InactiveAnimistPowersListItem }
