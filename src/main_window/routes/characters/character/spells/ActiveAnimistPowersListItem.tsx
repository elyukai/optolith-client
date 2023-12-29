import { FC, memo } from "react"
import {
  ImprovementCost,
  fromRaw,
} from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveAnimistPower } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  animistPower: DisplayedActiveAnimistPower
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveAnimistPowersListItem: FC<Props> = props => {
  const { insertTopMargin, animistPower, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
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
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a animist power that is currently inactive.
 */
const MemoActiveAnimistPowersListItem = memo(ActiveAnimistPowersListItem)

export { MemoActiveAnimistPowersListItem as ActiveAnimistPowersListItem }
