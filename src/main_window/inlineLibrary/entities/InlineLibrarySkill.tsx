import { getSkillEntityDescription } from "@optolith/entity-descriptions/entities/skill"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectAll, SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"
import { selectNewApplicationsAndUsesCache } from "../../slices/databaseSlice.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a skill.
 */
export const InlineLibrarySkill: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const blessedTraditions = useAppSelector(SelectAll.Static.BlessedTraditions)
  const diseases = useAppSelector(SelectAll.Static.Diseases)
  const regions = useAppSelector(SelectAll.Static.Regions)
  const entry = useAppSelector(SelectGetById.Static.Skill)(id)
  const cache = useAppSelector(selectNewApplicationsAndUsesCache)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getSkillEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getAttributeById,
          blessedTraditions,
          diseases,
          regions,
          cache,
        },
        locale,
        entry,
      ),
    [blessedTraditions, cache, diseases, entry, getAttributeById, regions],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
