import { getExperienceLevelEntityDescription } from "@optolith/entity-descriptions/entities/experienceLevel"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { useAppSelector } from "../../hooks/redux.ts"
import { selectStaticExperienceLevels } from "../../slices/databaseSlice.ts"

type Props = {
  id: number
}

/**
 * Displays all information about an experience level.
 */
export const InlineLibraryExperienceLevel: FC<Props> = ({ id }) => {
  const entry = useAppSelector(selectStaticExperienceLevels)[id]

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getExperienceLevelEntityDescription(defaultDatabaseAccessors, locale, entry),
    [entry],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
