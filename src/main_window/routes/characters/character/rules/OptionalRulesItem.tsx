import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { CharacterOptionalRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"

type Props = {
  optionalRule: CharacterOptionalRuleOverview
  hideInfo?: boolean
}

// const getKey = (option: DropdownOption<number>) => option.id

/**
 * Returns a single optional rule item.
 */
export const OptionalRulesItem: FC<Props> = observer(props => {
  const {
    optionalRule: { id, name, active, disabled, options, activeOptions },
    hideInfo,
  } = props

  const translate = useTranslate()
  const actions = useCharacterActions()
  const handleSwitch = useCallback(() => actions.toggleOptionalRule(id), [id])
  const { displayInlineLibraryEntry } = useInlineLibrary("OptionalRule", id)

  return (
    <li>
      <Checkbox checked={active} onClick={handleSwitch} label={name} disabled={disabled} />
      {options === undefined ? null : (
        <Dropdown<string>
          options={options}
          value={activeOptions[0] ?? options[0]?.id}
          onChange={optionId => actions.setOptionalRuleOption(id, optionId)}
          getKey={option => option.id}
          disabled={!active || disabled}
        />
      )}
      {hideInfo === true ? null : (
        <IconButton
          icon="&#xE912;"
          label={translate("Show details")}
          onClick={displayInlineLibraryEntry}
          flat
        />
      )}
    </li>
  )
})
