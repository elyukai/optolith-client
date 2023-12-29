import { FC, memo } from "react"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveMagicalMelody } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ActiveMagicalActionsListItem } from "./ActiveMagicalActionsListItem.tsx"

type Props = {
  insertTopMargin?: boolean
  magicalMelody: DisplayedActiveMagicalMelody
  sortOrder: SpellsSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveMagicalMelodiesListItem: FC<Props> = props => {
  const { insertTopMargin, magicalMelody, sortOrder, addPoint, removePoint, remove } = props

  const translate = useTranslate()

  return (
    <ActiveMagicalActionsListItem
      kind="MagicalMelody"
      insertTopMargin={insertTopMargin}
      magicalAction={magicalMelody}
      sortOrder={sortOrder}
      groupName={translate("Magical Melodies")}
      checkPenalty={magicalMelody.static.check_penalty}
      improvementCost={fromRaw(magicalMelody.static.improvement_cost)}
      addPoint={addPoint}
      removePoint={removePoint}
      remove={remove}
    />
  )
}

/**
 * Displays a magical melody that is currently inactive.
 */
const MemoActiveMagicalMelodiesListItem = memo(ActiveMagicalMelodiesListItem)

export { MemoActiveMagicalMelodiesListItem as ActiveMagicalMelodiesListItem }
