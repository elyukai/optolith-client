import { FC } from "react"
import { DisplayedInactiveAdvantage } from "../../../../../shared/domain/activatable/advantagesInactive.ts"
import { getCreateIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { useInactiveAdvantageAndDisadvantageActions } from "../../../../hooks/activatableActions.ts"
import { addAdvantage } from "../../../../slices/advantagesSlice.ts"
import { InactiveActivatablesListItem } from "../activatable/InactiveActivatableListItem.tsx"

type Props = {
  advantage: DisplayedInactiveAdvantage
}

/**
 * Displays an advantage that is currently inactive.
 */
export const InactiveAdvantagesListItem: FC<Props> = props => {
  const { advantage } = props
  const { handleAdd } = useInactiveAdvantageAndDisadvantageActions("advantage", addAdvantage)

  return (
    <InactiveActivatablesListItem
      activatable={advantage}
      add={handleAdd}
      createActivatableIdentifierObject={getCreateIdentifierObject("Advantage")}
    />
  )
}
