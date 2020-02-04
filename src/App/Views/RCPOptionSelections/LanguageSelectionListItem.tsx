import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe, Nothing } from "../../../Data/Maybe"
import { findWithDefault, member, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { LanguagesSelectionListItemOptions } from "../../Models/View/LanguagesSelectionListItemOptions"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { getLevelElements } from "../../Utilities/levelUtils"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"

const LSLIOA = LanguagesSelectionListItemOptions.A

interface Props {
  l10n: L10nRecord
  apLeft: number
  active: OrderedMap<number, number>
  options: Record<LanguagesSelectionListItemOptions>
  adjustLanguage: (id: number) => (mlevel: Maybe<number>) => void
}

export const LanguagesSelectionListItem: React.FC<Props> = props => {
  const { active, apLeft, l10n, options, adjustLanguage } = props

  const id = LSLIOA.id (options)
  const name = LSLIOA.name (options)
  const native = LSLIOA.native (options)

  const is_active = member (id) (active)

  const disabled = native || (!is_active && apLeft <= 0)

  const active_level = findWithDefault (0) (id) (active)

  const handleToggle = React.useCallback (
    () => adjustLanguage (id) (is_active ? Nothing : Just (1)),
    [ id, adjustLanguage, is_active ]
  )

  const handleSetLevel = React.useCallback (
    (level: number) => adjustLanguage (id) (Just (level)),
    [ id, adjustLanguage ]
  )

  const levelOptions = React.useMemo (
    () => getLevelElements (apLeft - active_level * 2),
    [ active_level, apLeft ]
  )

  return (
    <li className={disabled ? "disabled" : undefined}>
      <Checkbox
        checked={is_active || native}
        disabled={disabled}
        onClick={handleToggle}
        >
        {name}
      </Checkbox>
      {(() => {
        if (native) {
          return (
            <Dropdown
              className="levels"
              value={4}
              options={List (
                DropdownOption ({
                  id: Just (4),
                  name: translate (l10n) ("nativetongue.short"),
                })
              )}
              disabled
              />
          )
        }
        else if (is_active) {
          return (
            <Dropdown
              className="levels"
              value={active_level}
              onChangeJust={handleSetLevel}
              options={levelOptions}
              />
          )
        }

        return null
      }) ()}
    </li>
  )
}
