import { FocusRule, FocusRuleTranslation } from "optolith-database-schema/types/rule/FocusRule"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { isFocusRuleActive } from "../../../../../shared/domain/rules/focusRule.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { changeInlineLibraryEntry } from "../../../../slices/inlineWikiSlice.ts"
import { switchFocusRule } from "../../../../slices/rulesSlice.ts"

type Props = {
  focusRule: {
    focusRule: FocusRule
    focusRuleTranslation: FocusRuleTranslation
  }
}

/**
 *
 */
export const FocusRulesItem: FC<Props> = props => {
  const {
    focusRule: { focusRule, focusRuleTranslation },
  } = props

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const getDynamicFocusRuleById = useAppSelector(SelectGetById.Dynamic.FocusRule)

  const handleSwitch = useCallback(
    () => dispatch(switchFocusRule(focusRule.id)),
    [dispatch, focusRule.id],
  )

  const handleChangeInlineLibraryEntry = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "FocusRule", focus_rule: focusRule.id })),
    [dispatch, focusRule.id],
  )

  return (
    <li>
      <Checkbox
        checked={isFocusRuleActive(getDynamicFocusRuleById, focusRule.id)}
        onClick={handleSwitch}
        label={focusRuleTranslation.name}
        disabled
      />
      <IconButton
        icon="&#xE912;"
        label={translate("Show details")}
        onClick={handleChangeInlineLibraryEntry}
        flat
      />
    </li>
  )
}
