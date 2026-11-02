import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react-lite"
import { type FC, useMemo } from "react"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { AlternativeRulesItem } from "./AlternativeRulesItem.tsx"

/**
 * Returns a page section for managing alternative rules.
 */
export const AlternativeRules: FC<{ hideInfo?: boolean }> = observer(({ hideInfo }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const { alternativeRules } = useCharacterState()

  const alternativeRuleOptions = useMemo(
    () => alternativeRules.toSorted(on(x => x.name, localeCompare)),
    [alternativeRules, localeCompare, translateMap],
  )

  return alternativeRuleOptions.length === 0 ? null : (
    <>
      <h2>{translate("Alternative Rules")}</h2>
      <ul className="alternative-rules">
        {alternativeRuleOptions.map(alternativeRule => (
          <AlternativeRulesItem
            key={alternativeRule.id}
            alternativeRule={alternativeRule}
            hideInfo={hideInfo}
          />
        ))}
      </ul>
    </>
  )
})
