import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { CharacterFocusRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { InlineLibraryManager } from "../../../../inlineLibrary/InlineLibrary.tsx"

type Props = {
  focusRule: CharacterFocusRuleOverview
  hideInfo?: boolean
}

/**
 * Returns a single focus rule item.
 */
export const FocusRulesItem: FC<Props> = observer(props => {
  const {
    focusRule: { id, name, active, disabled },
    hideInfo,
  } = props

  const translate = useTranslate()
  const actions = useCharacterActions()
  const handleSwitch = useCallback(() => actions.toggleFocusRule(id), [id])
  const handleChangeInlineLibraryEntry = useCallback(
    () => InlineLibraryManager.instance.goTo(["FocusRule", id]),
    [id],
  )

  return (
    <li>
      <Checkbox checked={active} onClick={handleSwitch} label={name} disabled={disabled} />
      {hideInfo === true ? null : (
        <IconButton
          icon="&#xE912;"
          label={translate("Show details")}
          onClick={handleChangeInlineLibraryEntry}
          flat
        />
      )}
    </li>
  )
})
