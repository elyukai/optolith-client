import * as React from "react"
import { member, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ScriptsSelectionListItemOptions } from "../../Models/View/ScriptsSelectionListItemOptions"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { Checkbox } from "../Universal/Checkbox"

const SSLIOA = ScriptsSelectionListItemOptions.A

interface Props {
  l10n: L10nRecord
  active: OrderedMap<number, number>
  apLeft: number
  options: Record<ScriptsSelectionListItemOptions>
  toggleScript: (id: number) => (cost: number) => void
}

export const ScriptSelectionListItem: React.FC<Props> = props => {
  const { active, apLeft, l10n, options, toggleScript } = props

  const id = SSLIOA.id (options)
  const name = SSLIOA.name (options)
  const cost = SSLIOA.cost (options)
  const native = SSLIOA.native (options)

  const is_active = member (id) (active)

  const disabled = native || (!is_active && apLeft - cost < 0)

  const handleToggle = React.useCallback (
    () => toggleScript (id) (cost),
    [ id, cost, toggleScript ]
  )

  return (
    <li className={disabled ? "disabled" : undefined}>
      <Checkbox
        checked={is_active || native}
        disabled={disabled}
        onClick={handleToggle}
        >
        {name}
        {" ("}
        {cost}
        {translate (l10n) ("adventurepoints.short")}
        {")"}
      </Checkbox>
    </li>
  )
}
