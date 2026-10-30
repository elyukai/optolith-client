import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react"
import { type FC, useMemo } from "react"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { SharedState } from "../../../../external.ts"
import { OptionalRulesItem } from "./OptionalRulesItem.tsx"

/**
 * Returns a page section for managing optional rules.
 */
export const OptionalRules: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const optionalRuleOptions = useMemo(
    () => SharedState.optionalRules.toSorted(on(x => x.name, localeCompare)),
    [SharedState.optionalRules, localeCompare, translateMap],
  )

  // const higherParadeValues = Rules.A.higherParadeValues(rules)

  // const areHigherParadeValuesEnabled = higherParadeValues > 0

  // const attributeValueLimit = Rules.A.attributeValueLimit(rules)

  // const enableLanguageSpecializations = Rules.A.enableLanguageSpecializations(rules)

  // const handleHigherParadeValues =
  //   React.useCallback(
  //     () => changeHigherParadeValues(Just(areHigherParadeValuesEnabled ? 0 : 2)),
  //     [ changeHigherParadeValues, areHigherParadeValuesEnabled ]
  //   )

  return (
    <>
      <h2>{translate("Optional Rules")}</h2>
      <ul className="optional-rules">
        {optionalRuleOptions.map(optionalRule => (
          <OptionalRulesItem key={optionalRule.id} optionalRule={optionalRule} />
        ))}
      </ul>
    </>
  )
})
