import { FocusRuleTranslation } from "@optolith/database-schema/gen"
import { observer } from "mobx-react"
import { FC, useMemo } from "react"
import type { CharacterFocusRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt } from "../../../../../shared/utils/compare.ts"
import { SharedState } from "../../../../external.ts"
import { FocusRulesItem } from "./FocusRulesItem.tsx"

/**
 * Returns a page section for managing focus rules.
 */
export const FocusRules: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const focusRuleOptions = useMemo(
    () =>
      SharedState.focusRules
        .map(x => ({ ...x, focusRuleTranslation: translateMap(x.dbEntry.translations) }))
        .filter(
          (
            x,
          ): x is CharacterFocusRuleOverview & {
            focusRuleTranslation: FocusRuleTranslation
          } => x.focusRuleTranslation !== undefined,
        )
        .toSorted(compareAt(x => x.focusRuleTranslation.name, localeCompare)),
    [SharedState.focusRules, localeCompare, translateMap],
  )

  return (
    <>
      <h2>{translate("Focus Rules")}</h2>
      <ul className="focus-rules">
        {focusRuleOptions.map(focusRule => (
          <FocusRulesItem key={focusRule.id} focusRule={focusRule} />
        ))}
      </ul>
    </>
  )
})
