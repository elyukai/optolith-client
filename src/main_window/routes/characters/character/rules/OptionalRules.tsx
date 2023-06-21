import { OptionalRule, OptionalRuleTranslation } from "optolith-database-schema/types/rule/OptionalRule"
import { FC, useMemo } from "react"
import { compareAt } from "../../../../../shared/utils/sort.ts"
import { useIsEntryAvailable } from "../../../../hooks/isAvailable.ts"
import { useLocaleCompare } from "../../../../hooks/localeCompare.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { useTranslate } from "../../../../hooks/translate.ts"
import { useTranslateMap } from "../../../../hooks/translateMap.ts"
import { selectActiveOptionalRules } from "../../../../slices/characterSlice.ts"
import { selectOptionalRules } from "../../../../slices/databaseSlice.ts"
import { OptionalRulesItem } from "./OptionalRulesItem.tsx"

export const OptionalRules: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()
  const isEntryAvailable = useIsEntryAvailable()

  const optionalRules = useAppSelector(selectOptionalRules)
  const activeOptionalRules = useAppSelector(selectActiveOptionalRules)
  const optionalRuleOptions = useMemo(
    () =>
      Object.values(optionalRules)
        .filter(x => isEntryAvailable(x.src) || Object.hasOwn(activeOptionalRules, x.id))
        .map(x => ({ optionalRule: x, optionalRuleTranslation: translateMap(x.translations) }))
        .filter((x): x is {
          optionalRule: OptionalRule
          optionalRuleTranslation: OptionalRuleTranslation
        } => x.optionalRuleTranslation !== undefined)
        .sort(compareAt(x => translateMap(x.optionalRule.translations)?.name ?? "", localeCompare)),
    [ activeOptionalRules, optionalRules, isEntryAvailable, localeCompare, translateMap ],
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
          <OptionalRulesItem key={optionalRule.optionalRule.id} optionalRule={optionalRule} />
        ))}
      </ul>
    </>
  )
}
