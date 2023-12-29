import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveMagicalDance } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalDance: DisplayedActiveMagicalDance
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveMagicalDancesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalDance, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="MagicalDance"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalDance}
      sortOrder={sortOrder}
      groupName={translate("Magical Dances")}
      improvementCost={fromRaw(magicalDance.static.improvement_cost)}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a magical dance that is currently inactive.
 */
const MemoActiveMagicalDancesListItem = memo(ActiveMagicalDancesListItem)

export { MemoActiveMagicalDancesListItem as ActiveMagicalDancesListItem }
