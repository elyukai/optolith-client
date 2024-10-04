import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getCantripLibraryEntry } from "../../../shared/domain/rated/spell.ts"
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

  return (
    <LibraryEntry
      createLibraryEntry={getCantripLibraryEntry(entry, {
        getTargetCategoryById,
        getPropertyById,
        getMagicalTraditionById,
        getCurriculumById,
      })}
    />
  )
}
