import { getCantripEntityDescription } from "@optolith/entity-descriptions/entities/spell"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a cantrip.
 */
export const InlineLibraryCantrip: FC<Props> = ({ id }) => {
  const getCurriculumById = useAppSelector(SelectGetById.Static.Curriculum)
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const getPropertyById = useAppSelector(SelectGetById.Static.Property)
  const getMagicalTraditionById = useAppSelector(SelectGetById.Static.MagicalTradition)
  const entry = useAppSelector(SelectGetById.Static.Cantrip)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getCantripEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getTargetCategoryById,
          getPropertyById,
          getCurriculumById,
          getMagicalTraditionById,
        },
        locale,
        entry,
      ),
    [entry, getCurriculumById, getMagicalTraditionById, getPropertyById, getTargetCategoryById],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
