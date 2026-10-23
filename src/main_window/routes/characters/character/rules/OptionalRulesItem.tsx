import { OptionalRuleTranslation } from "@optolith/database-schema/gen"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { CharacterOptionalRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ExternalAPI } from "../../../../external.ts"
import { InlineLibraryManager } from "../../../../inlineLibrary/InlineLibrary.tsx"

type Props = {
  optionalRule: CharacterOptionalRuleOverview & {
    optionalRuleTranslation: OptionalRuleTranslation
  }
}

// const getKey = (option: DropdownOption<number>) => option.id

/**
 * Returns a single optional rule item.
 */
export const OptionalRulesItem: FC<Props> = props => {
  const {
    optionalRule: { id, optionalRuleTranslation, active, disabled },
  } = props

  const translate = useTranslate()
  const handleSwitch = useCallback(() => ExternalAPI.execute("toggleOptionalRule", id), [id])
  const handleChangeInlineLibraryEntry = useCallback(
    () => InlineLibraryManager.instance.goTo(["OptionalRule", id]),
    [id],
  )

  // const handleChangeOption = useCallback(
  //   (option: number) =>
  //     dispatch(
  //       changeOptionalRuleOption({
  //         id: optionalRule.id,
  //         option,
  //       }),
  //     ),
  //   [dispatch, optionalRule.id],
  // )

  // const isActive = isOptionalRuleActive(getDynamicOptionalRuleById, optionalRule.id)

  return (
    <li>
      <Checkbox
        checked={active}
        onClick={handleSwitch}
        label={optionalRuleTranslation.name}
        disabled={disabled}
      />
      {/* TODO: optionalRule.id === OptionalRuleIdentifier.HigherDefenseStats ? (
        <Dropdown
          options={[
            { id: 2, name: "+2" },
            { id: 4, name: "+4" },
          ]}
          value={getDynamicOptionalRuleById(optionalRule.id)?.options?.[0] ?? 2}
          onChange={handleChangeOption}
          disabled={!isActive}
          getKey={getKey}
        />
      ) : null */}
      <IconButton
        icon="&#xE912;"
        label={translate("Show details")}
        onClick={handleChangeInlineLibraryEntry}
        flat
      />
    </li>
  )
}
