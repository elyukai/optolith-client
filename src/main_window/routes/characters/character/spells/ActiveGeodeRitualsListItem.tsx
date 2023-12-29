import { FC, memo } from "react"
import { geodeRitualsImprovementCost } from "../../../../../shared/domain/rated/magicalActions.ts"
import { DisplayedActiveGeodeRitual } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  geodeRitual: DisplayedActiveGeodeRitual
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveGeodeRitualsListItem: FC<Props> = props => {
  const { insertTopMargin, geodeRitual, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="GeodeRitual"
      insertTopMargin={insertTopMargin}
      magicalAction={geodeRitual}
      sortOrder={sortOrder}
      groupName={translate("Geode Rituals")}
      improvementCost={geodeRitualsImprovementCost}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a geode ritual that is currently inactive.
 */
const MemoActiveGeodeRitualsListItem = memo(ActiveGeodeRitualsListItem)

export { MemoActiveGeodeRitualsListItem as ActiveGeodeRitualsListItem }
