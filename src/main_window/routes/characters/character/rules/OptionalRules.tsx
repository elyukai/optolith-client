import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react-lite"
import { type FC, useMemo } from "react"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { OptionalRulesItem } from "./OptionalRulesItem.tsx"

/**
 * Returns a page section for managing optional rules.
 */
export const OptionalRules: FC<{ hideInfo?: boolean }> = observer(({ hideInfo }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const { optionalRules } = useCharacterState()

  const optionalRuleOptions = useMemo(
    () => optionalRules.toSorted(on(x => x.name, localeCompare)),
    [optionalRules, localeCompare, translateMap],
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
          <OptionalRulesItem
            key={optionalRule.id}
            optionalRule={optionalRule}
            hideInfo={hideInfo}
          />
        ))}
      </ul>
    </>
  )
})
