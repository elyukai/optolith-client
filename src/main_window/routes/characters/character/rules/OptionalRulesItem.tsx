import { OptionalRule, OptionalRuleTranslation } from "optolith-database-schema/types/rule/OptionalRule"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { useTranslate } from "../../../../hooks/translate.ts"
import { selectActiveOptionalRules } from "../../../../slices/characterSlice.ts"
import { changeInlineLibraryEntry } from "../../../../slices/inlineWikiSlice.ts"
import { switchOptionalRule } from "../../../../slices/rulesSlice.ts"

type Props = {
  optionalRule: {
    optionalRule: OptionalRule
    optionalRuleTranslation: OptionalRuleTranslation
  }
}

export const OptionalRulesItem: FC<Props> = props => {
  const { optionalRule: { optionalRule, optionalRuleTranslation } } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const activeOptionalRules = useAppSelector(selectActiveOptionalRules)

  const handleSwitch = useCallback(
    () => dispatch(switchOptionalRule(optionalRule.id)),
    [ dispatch, optionalRule.id ],
  )

  const handleChangeInlineLibraryEntry = useCallback(
    () => dispatch(changeInlineLibraryEntry({
      tag: "OptionalRule",
      optional_rule: optionalRule.id,
    })),
    [ dispatch, optionalRule.id ],
  )

  return (
    <li>
      <Checkbox
        checked={Object.hasOwn(activeOptionalRules, optionalRule.id)}
        onClick={handleSwitch}
        label={optionalRuleTranslation.name}
        disabled={optionalRule.is_missing_implementation}
        />
      {/* TODO: <Dropdown
        options={List(
          DropdownOption({ id: Just(2), name: "+2" }),
          DropdownOption({ id: Just(4), name: "+4" })
        )}
        value={higherParadeValues}
        onChange={changeHigherParadeValues}
        disabled={higherParadeValues === 0}
        /> */}
      <IconButton
        icon="&#xE912;"
        label={translate("Show details")}
        onClick={handleChangeInlineLibraryEntry}
        flat
        />
    </li>
  )
}
