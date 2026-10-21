import { FC } from "react"
import type { DisplayedInactiveActivatable } from "../../../../../shared/domain/activatable/activatableEntry.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useInactiveAdvantageAndDisadvantageActions } from "../../../../hooks/activatableActions.ts"
import { addDisadvantage } from "../../../../slices/disadvantagesSlice.ts"
import { InactiveActivatablesListItem } from "../activatable/InactiveActivatableListItem.tsx"

type Props = {
  disadvantage: DisplayedInactiveActivatable<"Disadvantage">
}

/**
 * Displays an disadvantage that is currently inactive.
 */
export const InactiveDisadvantagesListItem: FC<Props> = props => {
  const { disadvantage } = props
  const { handleAdd } = useInactiveAdvantageAndDisadvantageActions("disadvantage", addDisadvantage)

  return (
    <InactiveActivatablesListItem
      activatable={disadvantage}
      add={handleAdd}
      createActivatableIdentifierObject={getCreateIdentifierObject("Disadvantage")}
    />
  )
}
