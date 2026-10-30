import { deepEqual } from "@elyukai/utils/equality"
import { on } from "@elyukai/utils/function"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ResolvedSelectOptionIdentifier } from "@optolith/database-schema/cache"
import type { PredefinedOrTextInputSelectOptionRuleValueTranslation } from "@optolith/database-schema/gen"
import { type FC, useCallback } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import type { ActivatableOption } from "../../../../../shared/domain/activatable/activatable.ts"
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
}

/**
 * Displays controls for handling a single option of an activatable entry.
 */
export const InactiveActivatableListItemOption: FC<Props> = props => {
  const { option, value, values, onChange, index } = props
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const handleDropdownChange = useCallback(
    (id: ResolvedSelectOptionIdentifier | "Custom") => {
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
        <Dropdown<ResolvedSelectOptionIdentifier>
          options={preparedOptions}
          value={value?.type === "Custom" ? undefined : value?.id}
          onChange={handleDropdownChange}
          getKey={o => o.id[o.id.kind as keyof typeof o.id]}
          equals={deepEqual}
        />
      )
    }
    case "choiceOrCustomizableText":
      return (
        <>
          <Dropdown<ResolvedSelectOptionIdentifier | "Custom" | undefined>
            key={index}
            options={[
              ...option.options
                .map(o => ({
                  id: o.id,
                  name: translateMap(o.content.translations)?.name ?? "…",
                }))
                .toSorted(on(opt => opt.name, localeCompare)),
              {
                id: "Custom" as const,
                name:
                  translateMap<PredefinedOrTextInputSelectOptionRuleValueTranslation>(
                    option.textLabel,
                  )?.optionLabel ?? translate("Custom option"),
              },
            ]}
            value={value?.type === "Custom" ? undefined : value?.id}
            disabled={value?.type === "Custom"}
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
            disabled={value?.type !== "Custom"}
          />
        </>
      )
    case "text":
      return (
        <TextField
          onChange={handleTextfieldChange}
          value={value?.type === "Custom" ? value.value : ""}
          hint={translateMap(option.textLabel)?.inputLabel}
        />
      )
    default:
      return assertExhaustive(option)
  }
}
