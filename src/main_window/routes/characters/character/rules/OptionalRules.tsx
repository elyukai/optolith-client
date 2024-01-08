import {
  OptionalRule,
  OptionalRuleTranslation,
} from "optolith-database-schema/types/rule/OptionalRule"
import { FC, useMemo } from "react"
import { isOptionalRuleActive } from "../../../../../shared/domain/rules/optionalRule.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt } from "../../../../../shared/utils/compare.ts"
import { useIsEntryAvailable } from "../../../../hooks/isAvailable.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectStaticOptionalRules } from "../../../../slices/databaseSlice.ts"
import { OptionalRulesItem } from "./OptionalRulesItem.tsx"

/**
 * Returns a page section for managing optional rules.
 */
export const OptionalRules: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()
  const isEntryAvailable = useIsEntryAvailable()

  const optionalRules = useAppSelector(selectStaticOptionalRules)
  const getDynamicOptionalRuleById = useAppSelector(SelectGetById.Dynamic.OptionalRule)
  const optionalRuleOptions = useMemo(
    () =>
      Object.values(optionalRules)
        .filter(
          x => isEntryAvailable(x.src) || isOptionalRuleActive(getDynamicOptionalRuleById, x.id),
        )
        .map(x => ({ optionalRule: x, optionalRuleTranslation: translateMap(x.translations) }))
        .filter(
          (
            x,
          ): x is {
            optionalRule: OptionalRule
            optionalRuleTranslation: OptionalRuleTranslation
          } => x.optionalRuleTranslation !== undefined,
        )
        .sort(compareAt(x => translateMap(x.optionalRule.translations)?.name ?? "", localeCompare)),
    [optionalRules, localeCompare, isEntryAvailable, getDynamicOptionalRuleById, translateMap],
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
