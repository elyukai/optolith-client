import * as React from "react"
import { member, notMember, OrderedSet, size } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection"
import { Checkbox } from "../Universal/Checkbox"

const CSA = CantripsSelection.A

export interface CantripSelectionListItemProps {
  cantrip: Record<Cantrip>
  active: OrderedSet<string>
  selection: Record<CantripsSelection>
  toggleCantripId (id: string): void
}

export const CantripSelectionListItem: React.FC<CantripSelectionListItemProps> = props => {
  const { cantrip, active, selection, toggleCantripId } = props

  const id = Cantrip.A.id (cantrip)
  const name = Cantrip.A.name (cantrip)

  const handleToggle = React.useCallback (
    () => toggleCantripId (id),
    [ id, toggleCantripId ]
  )

  const amount = CSA.amount (selection)

  return (
    <li>
      <Checkbox
        key={id}
        checked={member (id) (active)}
        disabled={notMember (id) (active) && size (active) >= amount}
        label={name}
        onClick={handleToggle}
        />
    </li>
  )
}
