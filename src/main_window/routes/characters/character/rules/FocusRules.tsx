import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react"
import { type FC, useMemo } from "react"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { FocusRulesItem } from "./FocusRulesItem.tsx"

/**
 * Returns a page section for managing focus rules.
 */
export const FocusRules: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const { focusRules } = useCharacterState()

  const focusRuleOptions = useMemo(
    () => focusRules.toSorted(on(x => x.name, localeCompare)),
    [focusRules, localeCompare, translateMap],
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
