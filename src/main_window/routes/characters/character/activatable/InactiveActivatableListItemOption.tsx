import { SelectOptionIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { FC, useCallback } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { ActivatableOption } from "../../../../../shared/domain/activatable/activatableEntry.ts"
import { DisplayedInactiveActivatableOption } from "../../../../../shared/domain/activatable/activatableInactive.ts"
import { identifierObjectToString } from "../../../../../shared/domain/identifier.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt } from "../../../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"

type Props = {
  option: DisplayedInactiveActivatableOption
  value: ActivatableOption | undefined
  onChange: (option: ActivatableOption | undefined, index: number) => void
  index: number
}

const getKey = (option: DropdownOption<SelectOptionIdentifier | undefined>) =>
  option.id === undefined ? "default" : identifierObjectToString(option.id)

/**
 * Displays controls for handling a single option of an activatable entry.
 */
export const InactiveActivatableListItemOption: FC<Props> = props => {
  const { option, value, onChange, index } = props
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const handleDropdownChange = useCallback(
    (id: SelectOptionIdentifier) => {
      onChange({ type: "Predefined", id }, index)
    },
    [index, onChange],
  )

  const handleTextfieldChange = useCallback(
    (newText: string) => {
      onChange(newText === "" ? undefined : { type: "Custom", value: newText }, index)
    },
    [index, onChange],
  )

  switch (option.kind) {
    case "choice":
      return (
        <Dropdown
          options={option.options
            .map(o => ({
              id: o.id,
              name: translateMap(o.translations)?.name ?? "…",
            }))
            .toSorted(compareAt(opt => opt.name, localeCompare))}
          value={value?.type === "Custom" ? undefined : value?.id}
          onChange={handleDropdownChange}
          getKey={getKey}
        />
      )
    case "choiceOrCustomizableText":
      return (
        <>
          <Dropdown
            key={index}
            options={
              value?.type === "Custom"
                ? [{ id: undefined, name: translate("Custom option") }]
                : option.options
                    .map(o => ({
                      id: o.id,
                      name: translateMap(o.translations)?.name ?? "…",
                    }))
                    .toSorted(compareAt(opt => opt.name, localeCompare))
            }
            value={value?.type === "Custom" ? undefined : value?.id}
            disabled={value?.type === "Custom"}
            onChange={handleDropdownChange}
            getKey={getKey}
          />
          <TextField
            onChange={handleTextfieldChange}
            value={value?.type === "Custom" ? value.value : ""}
            hint={translateMap(option.textLabel) ?? translate("Custom option")}
          />
        </>
      )
    case "text":
      return (
        <TextField
          onChange={handleTextfieldChange}
          value={value?.type === "Custom" ? value.value : ""}
          hint={translateMap(option.textLabel)}
        />
      )
    default:
      return assertExhaustive(option)
  }
}
