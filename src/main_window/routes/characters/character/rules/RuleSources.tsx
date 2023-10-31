import {
  Publication,
  PublicationTranslation,
} from "optolith-database-schema/types/source/Publication"
import { FC, useCallback, useMemo } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectIncludeAllPublications } from "../../../../slices/characterSlice.ts"
import { selectStaticPublications } from "../../../../slices/databaseSlice.ts"
import { switchIncludeAllPublications } from "../../../../slices/rulesSlice.ts"
import { RuleSourcesListItem } from "./RuleSourcesListItem.tsx"

export const RuleSources: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const includeAllPublications = useAppSelector(selectIncludeAllPublications)

  const publications = useAppSelector(selectStaticPublications)
  const publicationOptions = useMemo(
    () =>
      Object.values(publications)
        .map(x => ({ publication: x, publicationTranslation: translateMap(x.translations) }))
        .filter(
          (
            x,
          ): x is {
            publication: Publication
            publicationTranslation: PublicationTranslation
          } => x.publicationTranslation !== undefined,
        )
        .sort(
          reduceCompare(
            compareAt(
              x => x.publication.category,
              (a, b) =>
                a === "CoreRules" && b === "CoreRules"
                  ? 0
                  : a === "CoreRules"
                  ? -1
                  : b === "CoreRules"
                  ? 1
                  : 0,
            ),
            compareAt(x => translateMap(x.publication.translations)?.name ?? "", localeCompare),
          ),
        ),
    [localeCompare, publications, translateMap],
  )

  const handleSwitchIncludeAllPublications = useCallback(
    () => dispatch(switchIncludeAllPublications()),
    [dispatch],
  )

  return (
    <>
      <h2>{translate("Rule Sources")}</h2>
      <Checkbox
        checked={includeAllPublications ?? false}
        onClick={handleSwitchIncludeAllPublications}
        label={translate("Use all publications")}
      />
      <div className="rule-books">
        {publicationOptions.map(e => (
          <RuleSourcesListItem key={e.publication.id} publication={e} />
        ))}
      </div>
    </>
  )
}
