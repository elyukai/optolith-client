import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { DisplayedActiveZibiljaRitual } from "../../../../../shared/domain/spellActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  zibiljaRitual: DisplayedActiveZibiljaRitual
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveZibiljaRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, zibiljaRitual, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="ZibiljaRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={zibiljaRitual}
      sortOrder={sortOrder}
      groupName={translate("Zibilja Rituals")}
      checkPenalty={zibiljaRitual.static.check_penalty}
      improvementCost={fromRaw(zibiljaRitual.static.improvement_cost)}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a zibilja ritual that is currently inactive.
 */
const MemoActiveZibiljaRitualsListItem = memo(ActiveZibiljaRitualsListItem)

export { MemoActiveZibiljaRitualsListItem as ActiveZibiljaRitualsListItem }
