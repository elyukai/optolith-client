import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getCeremonyLibraryEntry } from "../../../shared/domain/rated/liturgicalChant.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a ceremony.
 */
export const InlineLibraryCeremony: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const getDerivedCharacteristicById = useAppSelector(SelectGetById.Static.DerivedCharacteristic)
  const getSkillModificationLevelById = useAppSelector(SelectGetById.Static.SkillModificationLevel)
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const getBlessedTraditionById = useAppSelector(SelectGetById.Static.BlessedTradition)
  const getAspectById = useAppSelector(SelectGetById.Static.Aspect)
  const entry = useAppSelector(SelectGetById.Static.Ceremony)(id)

  return (
    <LibraryEntry
      createLibraryEntry={getCeremonyLibraryEntry(entry, {
        getAttributeById,
        getDerivedCharacteristicById,
        getSkillModificationLevelById,
        getTargetCategoryById,
        getBlessedTraditionById,
        getAspectById,
      })}
    />
  )
}
