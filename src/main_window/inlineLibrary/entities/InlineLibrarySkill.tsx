import { FC } from "react"
import { isNotNullish } from "../../../shared/utils/nullable.ts"
import { assertExhaustive } from "../../../shared/utils/typeSafety.ts"
import { useLocaleCompare } from "../../hooks/localeCompare.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { useTranslate } from "../../hooks/translate.ts"
import { useTranslateMap } from "../../hooks/translateMap.ts"
import { selectAttributes, selectBlessedTraditions, selectDiseases, selectRegions, selectSkills } from "../../slices/databaseSlice.ts"
import { InlineLibraryPlaceholder } from "../InlineLibraryPlaceholder.tsx"
import { InlineLibraryProperties } from "../InlineLibraryProperties.tsx"
import { InlineLibraryTemplate } from "../InlineLibraryTemplate.tsx"
import { Source } from "../shared/Source.tsx"
import { createCheck } from "../shared/check.ts"
import { createImprovementCost } from "../shared/improvementCost.ts"

type Props = {
  id: number
}

export const InlineLibrarySkill: FC<Props> = ({ id }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const localeCompare = useLocaleCompare()

  const attributes = useAppSelector(selectAttributes)
  const blessedTraditions = useAppSelector(selectBlessedTraditions)
  const diseases = useAppSelector(selectDiseases)
  const regions = useAppSelector(selectRegions)
  const entry = useAppSelector(selectSkills)[id]
  const translation = translateMap(entry?.translations)

  if (entry === undefined || translation === undefined) {
    return <InlineLibraryPlaceholder />
  }

  const applications = (() => {
    switch (entry.applications.tag) {
      case "Derived": return (() => {
        switch (entry.applications.derived) {
          case "BlessedTraditions": return Object.values(blessedTraditions)
            .map(x => translateMap(x.translations)?.name)
            .filter(isNotNullish)
            .sort(localeCompare)
          case "Diseases": return Object.values(diseases)
            .map(x => translateMap(x.translations)?.name)
            .filter(isNotNullish)
            .sort(localeCompare)
          case "Regions": return Object.values(regions)
            .map(x => translateMap(x.translations)?.name)
            .filter(isNotNullish)
            .sort(localeCompare)
          default: return assertExhaustive(entry.applications.derived)
        }
      })()
      case "Explicit": return entry.applications.explicit
        .map(x => translateMap(x.translations)?.name)
        .filter(isNotNullish)
        .sort(localeCompare)
      default: return assertExhaustive(entry.applications)
    }
  })()

  return (
    <InlineLibraryTemplate
      className="Skill"
      title={translation?.name ?? entry.id.toString()}
      >
      <InlineLibraryProperties
        list={[
          createCheck(translate, translateMap, attributes, entry.check),
          {
            label: translate("Applications"),
            value: applications.join(", "),
          },
          {
            label: translate("Encumbrance"),
            value: entry.encumbrance === "True"
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
        {/* <WikiApplications
          advantages={advantages}
          specialAbilities={specialAbilities}
          staticData={staticData}
          x={x}
          acc={Skill.A}
          showNewApplications
          />
        <WikiUses
          advantages={advantages}
          specialAbilities={specialAbilities}
          staticData={staticData}
          x={x}
          acc={Skill.A}
          />
        <WikiSkillCheck
          staticData={staticData}
          x={x}
          acc={Skill.A}
          />
        <WikiApplications
          advantages={advantages}
          specialAbilities={specialAbilities}
          staticData={staticData}
          x={x}
          acc={Skill.A}
          />
        <WikiEncumbrance staticData={staticData} x={x} acc={Skill.A} />
        <WikiTools staticData={staticData} x={x} acc={Skill.A} />
        <WikiQuality staticData={staticData} x={x} acc={Skill.A} />
        <WikiFailedCheck staticData={staticData} x={x} acc={Skill.A} />
        <WikiCriticalSuccess staticData={staticData} x={x} acc={Skill.A} />
        <WikiBotch staticData={staticData} x={x} acc={Skill.A} />
        <WikiImprovementCost staticData={staticData} x={x} acc={Skill.A} />
        <WikiSource
          staticData={staticData}
          x={x}
          acc={Skill.A}
          /> */}
    </InlineLibraryTemplate>
  )
}
