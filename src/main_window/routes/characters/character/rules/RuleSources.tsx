import { compareNumber } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { PublicationTranslation, type PublicationCategory } from "@optolith/database-schema/gen"
import { observer } from "mobx-react"
import { FC, useCallback, useMemo } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import type { CharacterPublicationOverview } from "../../../../../shared/domain/rules.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { ExternalAPI, SharedState } from "../../../../external.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { RuleSourcesListItem } from "./RuleSourcesListItem.tsx"

const publicationCategoryToNumber = (category: PublicationCategory): number => {
  switch (category.kind) {
    case "CoreRules":
      return 0
    case "Adventure":
    case "ExpansionRules":
    case "RegionalSourcebook":
    case "Sourcebook":
      return 1
    default:
      return assertExhaustive(category)
  }
}

/**
 * Returns a page section for managing the publications to use for a character.
 */
export const RuleSources: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const publicationOptions = useMemo(
    () =>
      SharedState.publications
        .map(x => ({ ...x, publicationTranslation: translateMap(x.dbEntry.translations) }))
        .filter(
          (
            x,
          ): x is CharacterPublicationOverview & {
            publicationTranslation: PublicationTranslation
          } => x.publicationTranslation !== undefined,
        )
        .toSorted(
          reduceCompare(
            compareAt(x => publicationCategoryToNumber(x.dbEntry.category), compareNumber),
            compareAt(x => x.publicationTranslation.name, localeCompare),
          ),
        ),
    [localeCompare, SharedState.publications, translateMap],
  )

  const handleSwitchIncludeAllPublications = useCallback(
    () => ExternalAPI.execute("toggleIncludeAllPublications"),
    [dispatch],
  )

  return (
    <>
      <h2>{translate("Rule Sources")}</h2>
      <Checkbox
        checked={SharedState.includeAllPublications}
        onClick={handleSwitchIncludeAllPublications}
        label={translate("Use all publications")}
      />
      <div className="rule-books">
        {publicationOptions.map(e => (
          <RuleSourcesListItem key={e.id} publication={e} />
        ))}
      </div>
    </>
  )
})
