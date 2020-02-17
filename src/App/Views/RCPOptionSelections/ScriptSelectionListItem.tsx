import * as React from "react"
import { List } from "../../../Data/List"
import { member, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ScriptsSelectionListItemOptions } from "../../Models/View/ScriptsSelectionListItemOptions"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"
import { Checkbox } from "../Universal/Checkbox"

const SSLIOA = ScriptsSelectionListItemOptions.A

interface Props {
  staticData: StaticDataRecord
  active: OrderedMap<number, number>
  apLeft: number
  options: Record<ScriptsSelectionListItemOptions>
  toggleScript: (id: number) => (cost: number) => void
}

export const ScriptSelectionListItem: React.FC<Props> = props => {
  const { active, apLeft, staticData, options, toggleScript } = props

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
        {translateP (staticData) ("general.withapvalue") (List<string | number> (name, cost))}
      </Checkbox>
    </li>
  )
}
