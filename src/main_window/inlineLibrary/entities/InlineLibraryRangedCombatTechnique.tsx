import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getRangedCombatTechniqueLibraryEntry } from "../../../shared/domain/rated/combatTechnique.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a ranged combat technique.
 */
export const InlineLibraryRangedCombatTechnique: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const entry = useAppSelector(SelectGetById.Static.RangedCombatTechnique)(id)

  return (
    <LibraryEntry
      createLibraryEntry={getRangedCombatTechniqueLibraryEntry(entry, {
        getAttributeById,
      })}
    />
  )
}
