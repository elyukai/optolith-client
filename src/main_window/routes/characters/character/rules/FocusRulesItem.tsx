import { FocusRuleTranslation } from "@optolith/database-schema/gen"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { CharacterFocusRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { ExternalAPI } from "../../../../external.ts"
import { InlineLibraryManager } from "../../../../inlineLibrary/InlineLibrary.tsx"

type Props = {
  focusRule: CharacterFocusRuleOverview & {
    focusRuleTranslation: FocusRuleTranslation
  }
}

/**
 * Returns a single focus rule item.
 */
export const FocusRulesItem: FC<Props> = props => {
  const {
    focusRule: { id, focusRuleTranslation, active, disabled },
  } = props

  const translate = useTranslate()
  const handleSwitch = useCallback(() => ExternalAPI.execute("toggleFocusRule", id), [id])
  const handleChangeInlineLibraryEntry = useCallback(
    () => InlineLibraryManager.instance.goTo(["FocusRule", id]),
    [id],
  )

  return (
    <li>
      <Checkbox
        checked={active}
        onClick={handleSwitch}
        label={focusRuleTranslation.name}
        disabled={disabled}
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
