import { FC } from "react"
import type { DisplayedActiveActivatable } from "../../../../../shared/domain/activatable/activatableEntry.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useActiveAdvantageAndDisadvantageActions } from "../../../../hooks/activatableActions.ts"
import {
  changeDisadvantageLevel,
  removeDisadvantage,
} from "../../../../slices/disadvantagesSlice.ts"
import { ActiveActivatablesListItem } from "../activatable/ActiveActivatableListItem.tsx"

type Props = {
  disadvantage: DisplayedActiveActivatable<"Disadvantage">
}

/**
 * Displays a disadvantage that is currently active.
 */
export const ActiveDisadvantagesListItem: FC<Props> = props => {
  const { disadvantage } = props
  const { handleChangeLevel, handleRemove } = useActiveAdvantageAndDisadvantageActions(
    "disadvantage",
    removeDisadvantage,
    changeDisadvantageLevel,
    getCreateIdentifierObject("Disadvantage"),
  )

  return (
    <ActiveActivatablesListItem
      activatable={disadvantage}
      changeLevel={handleChangeLevel}
      remove={handleRemove}
      createActivatableIdentifierObject={getCreateIdentifierObject("Disadvantage")}
    />
  )
}
