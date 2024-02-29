import {
  OptionalRule,
  OptionalRuleTranslation,
} from "optolith-database-schema/types/rule/OptionalRule"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { OptionalRuleIdentifier } from "../../../../../shared/domain/identifier.ts"
import { isOptionalRuleActive } from "../../../../../shared/domain/rules/optionalRule.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { changeInlineLibraryEntry } from "../../../../slices/inlineWikiSlice.ts"
import { changeOptionalRuleOption, switchOptionalRule } from "../../../../slices/rulesSlice.ts"

type Props = {
  optionalRule: {
    optionalRule: OptionalRule
    optionalRuleTranslation: OptionalRuleTranslation
  }
}

const getKey = (option: DropdownOption<number>) => option.id

/**
 * Returns a single optional rule item.
 */
export const OptionalRulesItem: FC<Props> = props => {
  const {
    optionalRule: { optionalRule, optionalRuleTranslation },
  } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const getDynamicOptionalRuleById = useAppSelector(SelectGetById.Dynamic.OptionalRule)

  const handleSwitch = useCallback(
    () => dispatch(switchOptionalRule(optionalRule.id)),
    [dispatch, optionalRule.id],
  )

  const handleChangeInlineLibraryEntry = useCallback(
    () =>
      dispatch(
        changeInlineLibraryEntry({
          tag: "OptionalRule",
          optional_rule: optionalRule.id,
        }),
      ),
    [dispatch, optionalRule.id],
  )

  const handleChangeOption = useCallback(
    (option: number) =>
      dispatch(
        changeOptionalRuleOption({
          id: optionalRule.id,
          option,
        }),
      ),
    [dispatch, optionalRule.id],
  )

  const isActive = isOptionalRuleActive(getDynamicOptionalRuleById, optionalRule.id)

  return (
    <li>
      <Checkbox
        checked={isActive}
        onClick={handleSwitch}
        label={optionalRuleTranslation.name}
        disabled={optionalRule.is_missing_implementation}
      />
      {optionalRule.id === OptionalRuleIdentifier.HigherDefenseStats ? (
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
      ) : null}
      <IconButton
        icon="&#xE912;"
        label={translate("Show details")}
        onClick={handleChangeInlineLibraryEntry}
        flat
      />
    </li>
  )
}
