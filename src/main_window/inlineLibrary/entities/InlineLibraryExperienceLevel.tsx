import { FC } from "react"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../shared/hooks/translateMap.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { selectExperienceLevels } from "../../slices/databaseSlice.ts"
import { InlineLibraryPlaceholder } from "../InlineLibraryPlaceholder.tsx"
import { InlineLibraryProperties } from "../InlineLibraryProperties.tsx"
import { InlineLibraryTemplate } from "../InlineLibraryTemplate.tsx"

type Props = {
  id: number
}

export const InlineLibraryExperienceLevel: FC<Props> = ({ id }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()

  const entry = useAppSelector(selectExperienceLevels)[id]
  const translation = translateMap(entry?.translations)

  if (entry === undefined || translation === undefined) {
    return <InlineLibraryPlaceholder />
  }

  return (
    <InlineLibraryTemplate
      className="experience-level"
      title={translation.name}
      >
      <InlineLibraryProperties
        list={[
          {
            label: translate("Adventure Points"),
            value: entry.adventure_points,
          },
          {
            label: translate("Maximum Attribute Value"),
            value: entry.max_attribute_value,
          },
          {
            label: translate("Maximum Skill Value"),
            value: entry.max_skill_rating,
          },
          {
            label: translate("Maximum Combat Technique"),
            value: entry.max_combat_technique_rating,
          },
          {
            label: translate("Maximum Attribute Total"),
            value: entry.max_attribute_total,
          },
          {
            label: translate("Number of Spells/Liturgical Chants"),
            value: entry.max_number_of_spells_liturgical_chants,
          },
          {
            label: translate("Number from other Traditions"),
            value: entry.max_number_of_unfamiliar_spells,
          },
        ]}
        />
    </InlineLibraryTemplate>
  )
}
