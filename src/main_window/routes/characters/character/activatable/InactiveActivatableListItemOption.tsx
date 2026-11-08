import { deepEqual } from "@elyukai/utils/equality"
import { on } from "@elyukai/utils/function"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ResolvedSelectOptionIdentifier } from "@optolith/database-schema/cache"
import type { PredefinedOrTextInputSelectOptionRuleValueTranslation } from "@optolith/database-schema/gen"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { type FC, useCallback } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import type { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import type {
  ActivatableOption,
  SelectOptionIdentifier,
} from "../../../../../shared/domain/activatable/activatable.ts"
import type { DisplayedInactiveActivatableOption } from "../../../../../shared/domain/activatable/activatableInactive.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"

type Props = {
  option: DisplayedInactiveActivatableOption
  values: (ActivatableOption | undefined)[]
  value: ActivatableOption | undefined
  onChange: (option: ActivatableOption | undefined, index: number) => void
  index: number
  disabled?: boolean
}

/**
 * Displays controls for handling a single option of an activatable entry.
 */
export const InactiveActivatableListItemOption: FC<Props> = props => {
  const { option, value, values, onChange, index, disabled } = props
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const handleDropdownChange = useCallback(
    (id: SelectOptionIdentifier | "Custom") => {
      onChange(id === "Custom" ? { type: "Custom", value: "" } : { type: "Predefined", id }, index)
    },
    [index, onChange],
  )

  const handleTextfieldChange = useCallback(
    (newText: string) => {
      onChange({ type: "Custom", value: newText }, index)
    },
    [index, onChange],
  )

  switch (option.kind) {
    case "choice": {
      const { options, parentIndex } = option

      const parentOption = parentIndex !== undefined ? values[parentIndex] : undefined
      const filteredOptions =
        parentOption?.type === "Predefined"
          ? options.filter(o => deepEqual(parentOption.id, o.parentSelectOption))
          : options

      const preparedOptions = filteredOptions
        .map(o => ({
          id: o.id,
          name: translateMap(o.content.translations)?.name ?? "…",
        }))
        .toSorted(on(opt => opt.name, localeCompare))

      return (
        <Dropdown<SelectOptionIdentifier>
          options={preparedOptions}
          value={
            (parentIndex !== undefined && parentOption === undefined) || value?.type === "Custom"
              ? undefined
              : value?.id
          }
          onChange={handleDropdownChange}
          getKey={o => o.id[o.id.kind as keyof typeof o.id]}
          equals={deepEqual}
          disabled={(parentIndex !== undefined && parentOption === undefined) || disabled}
        />
      )
    }
    case "choiceOrCustomizableText": {
      const predefinedOptions: DropdownOption<ResolvedSelectOptionIdentifier>[] = option.options
        .map(o => ({
          id: o.id,
          name: translateMap(o.content.translations)?.name ?? MISSING_VALUE,
        }))
        .toSorted(on(opt => opt.name, localeCompare))

      const customOption: DropdownOption<"Custom"> = {
        id: "Custom",
        name:
          translateMap<PredefinedOrTextInputSelectOptionRuleValueTranslation>(option.textLabel)
            ?.optionLabel ?? translate("Custom option"),
      }

      const options: DropdownOption<"Custom" | SelectOptionIdentifier>[] = [
        ...predefinedOptions,
        customOption,
      ]

      return (
        <>
          <Dropdown<SelectOptionIdentifier | "Custom">
            key={index}
            options={options}
            value={value?.type === "Custom" ? undefined : value?.id}
            disabled={disabled || value?.type === "Custom"}
            onChange={handleDropdownChange}
            getKey={o =>
              typeof o.id !== "object" ? undefined : o.id[o.id.kind as keyof typeof o.id]
            }
            equals={deepEqual}
          />
          <TextField
            onChange={handleTextfieldChange}
            value={value?.type === "Custom" ? value.value : ""}
            hint={
              translateMap<PredefinedOrTextInputSelectOptionRuleValueTranslation>(option.textLabel)
                ?.inputLabel ?? translate("Custom option")
            }
            disabled={disabled || value?.type !== "Custom"}
          />
        </>
      )
    }
    case "text":
      return (
        <TextField
          onChange={handleTextfieldChange}
          value={value?.type === "Custom" ? value.value : ""}
          hint={translateMap(option.textLabel)?.inputLabel}
          disabled={disabled}
        />
      )
    default:
      return assertExhaustive(option)
  }
}
