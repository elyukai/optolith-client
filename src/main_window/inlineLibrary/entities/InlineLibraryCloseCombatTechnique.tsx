import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getCloseCombatTechniqueLibraryEntry } from "../../../shared/domain/rated/combatTechnique.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a close combat technique.
 */
export const InlineLibraryCloseCombatTechnique: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const entry = useAppSelector(SelectGetById.Static.CloseCombatTechnique)(id)

  return (
    <LibraryEntry
      createLibraryEntry={getCloseCombatTechniqueLibraryEntry(entry, {
        getAttributeById,
      })}
    />
  )
}
