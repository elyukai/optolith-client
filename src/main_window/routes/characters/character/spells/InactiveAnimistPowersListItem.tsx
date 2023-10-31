import { FC, memo } from "react"
import {
  ImprovementCost,
  fromRaw,
} from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedInactiveAnimistPower } from "../../../../../shared/domain/spellInactive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { InactiveMagicalActionsListItem } from "./InactiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  animistPower: DisplayedInactiveAnimistPower
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveAnimistPowersListItem: FC<Props> = props => {
  const { insertTopMargin, animistPower, sortOrder, add } = props

  const translate = useTranslate()

  return (
    <InactiveMagicalActionsListItem
      kind="AnimistPower"
      insertTopMargin={insertTopMargin}
      magicalAction={animistPower}
      sortOrder={sortOrder}
      groupName={translate("Animist Powers")}
      improvementCost={(() => {
        switch (animistPower.static.improvement_cost.tag) {
          case "Fixed":
            return fromRaw(animistPower.static.improvement_cost.fixed)
          case "ByPrimaryPatron":
            // TODO: Replace with derived improvement cost
            return ImprovementCost.D
          default:
            return assertExhaustive(animistPower.static.improvement_cost)
        }
      })()}
      add={add}
    />
  )
}

/**
 * Displays a animist power that is currently inactive.
 */
const MemoInactiveAnimistPowersListItem = memo(InactiveAnimistPowersListItem)

export { MemoInactiveAnimistPowersListItem as InactiveAnimistPowersListItem }
