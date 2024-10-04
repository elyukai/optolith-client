import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getRitualLibraryEntry } from "../../../shared/domain/rated/spell.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a ritual.
 */
export const InlineLibraryRitual: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const getDerivedCharacteristicById = useAppSelector(SelectGetById.Static.DerivedCharacteristic)
  const getSkillModificationLevelById = useAppSelector(SelectGetById.Static.SkillModificationLevel)
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const getPropertyById = useAppSelector(SelectGetById.Static.Property)
  const getMagicalTraditionById = useAppSelector(SelectGetById.Static.MagicalTradition)
  const entry = useAppSelector(SelectGetById.Static.Ritual)(id)

  return (
    <LibraryEntry
      createLibraryEntry={getRitualLibraryEntry(entry, {
        getAttributeById,
        getDerivedCharacteristicById,
        getSkillModificationLevelById,
        getTargetCategoryById,
        getPropertyById,
        getMagicalTraditionById,
      })}
    />
  )
}
