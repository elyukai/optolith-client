import { FC, useMemo } from "react"
import { useLocaleCompare } from "../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { isNotNullish } from "../../../shared/utils/nullable.ts"
import { assertExhaustive } from "../../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import {
  selectNewApplicationsAndUsesCache,
  selectStaticAttributes,
  selectStaticBlessedTraditions,
  selectStaticDiseases,
  selectStaticRegions,
  selectStaticSkills,
} from "../../slices/databaseSlice.ts"
import { InlineLibraryPlaceholder } from "../InlineLibraryPlaceholder.tsx"
import { InlineLibraryProperties } from "../InlineLibraryProperties.tsx"
import { InlineLibraryTemplate } from "../InlineLibraryTemplate.tsx"
import { Source } from "../shared/Source.tsx"
import { createCheck } from "../shared/check.ts"
import { createImprovementCost } from "../shared/improvementCost.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a skill.
 */
export const InlineLibrarySkill: FC<Props> = ({ id }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const attributes = useAppSelector(selectStaticAttributes)
  const blessedTraditions = useAppSelector(selectStaticBlessedTraditions)
  const diseases = useAppSelector(selectStaticDiseases)
  const regions = useAppSelector(selectStaticRegions)
  const entry = useAppSelector(selectStaticSkills)[id]
  const translation = translateMap(entry?.translations)
  const cache = useAppSelector(selectNewApplicationsAndUsesCache)

  const newApplications = useMemo(
    () =>
      (entry === undefined ? [] : cache.newApplications[entry.id] ?? [])
        .map(x => translateMap(x.data.translations)?.name)
        .filter(isNotNullish)
        .sort(localeCompare),
    [cache.newApplications, entry, localeCompare, translateMap],
  )

  const uses = useMemo(
    () =>
      (entry === undefined ? [] : cache.uses[entry.id] ?? [])
        .map(x => translateMap(x.data.translations)?.name)
        .filter(isNotNullish)
        .sort(localeCompare),
    [cache.uses, entry, localeCompare, translateMap],
  )

  if (entry === undefined || translation === undefined) {
    return <InlineLibraryPlaceholder />
  }

  const applications = (() => {
    switch (entry.applications.tag) {
      case "Derived":
        return (() => {
          switch (entry.applications.derived) {
            case "BlessedTraditions":
              return Object.values(blessedTraditions)
                .map(x => translateMap(x.translations)?.name)
                .filter(isNotNullish)
                .sort(localeCompare)
            case "Diseases":
              return Object.values(diseases)
                .map(x => translateMap(x.translations)?.name)
                .filter(isNotNullish)
                .sort(localeCompare)
            case "Regions":
              return Object.values(regions)
                .map(x => translateMap(x.translations)?.name)
                .filter(isNotNullish)
                .sort(localeCompare)
            default:
              return assertExhaustive(entry.applications.derived)
          }
        })()
      case "Explicit":
        return entry.applications.explicit
          .map(x => translateMap(x.translations)?.name)
          .filter(isNotNullish)
          .sort(localeCompare)
      default:
        return assertExhaustive(entry.applications)
    }
  })()

  return (
    <InlineLibraryTemplate className="Skill" title={translation?.name ?? entry.id.toString()}>
      <InlineLibraryProperties
        list={[
          newApplications.length === 0
            ? undefined
            : {
                label: translate("New Applications"),
                value: newApplications.join(", "),
              },
          uses.length === 0
            ? undefined
            : {
                label: translate("Uses"),
                value: uses.join(", "),
              },
          createCheck(translate, translateMap, attributes, entry.check),
          {
            label: translate("Applications"),
            value: applications.join(", "),
          },
          {
            label: translate("Encumbrance"),
            value:
              entry.encumbrance === "True"
                ? translate("Yes")
                : entry.encumbrance === "False"
                ? translate("No")
                : translation.encumbrance_description ?? translate("Maybe"),
          },
          translation?.tools === undefined
            ? undefined
            : {
                label: translate("Tools"),
                value: translation.tools,
              },
          {
            label: translate("Quality"),
            value: translation.quality,
          },
          {
            label: translate("Failed Check"),
            value: translation.failed,
          },
          {
            label: translate("Critical Success"),
            value: translation.critical,
          },
          {
            label: translate("Botch"),
            value: translation.botch,
          },
          createImprovementCost(translate, entry.improvement_cost),
        ]}
      />
      <Source sources={entry.src} />
    </InlineLibraryTemplate>
  )
}
