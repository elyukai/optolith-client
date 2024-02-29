import { FC } from "react"
import { DisplayedActiveAdvantage } from "../../../../../shared/domain/activatable/advantagesActive.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useActiveAdvantageAndDisadvantageActions } from "../../../../hooks/activatableActions.ts"
import { changeAdvantageLevel, removeAdvantage } from "../../../../slices/advantagesSlice.ts"
import { ActiveActivatablesListItem } from "../activatable/ActiveActivatableListItem.tsx"

type Props = {
  advantage: DisplayedActiveAdvantage
}

/**
 * Displays an advantage that is currently active.
 */
export const ActiveAdvantagesListItem: FC<Props> = props => {
  const { advantage } = props
  const { handleChangeLevel, handleRemove } = useActiveAdvantageAndDisadvantageActions(
    "advantage",
    removeAdvantage,
    changeAdvantageLevel,
    getCreateIdentifierObject("Advantage"),
  )

  return (
    <ActiveActivatablesListItem
      activatable={advantage}
      changeLevel={handleChangeLevel}
      remove={handleRemove}
      createActivatableIdentifierObject={getCreateIdentifierObject("Advantage")}
    />
  )
}
