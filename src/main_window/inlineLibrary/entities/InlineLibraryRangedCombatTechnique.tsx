import { getRangedCombatTechniqueEntityDescription } from "@optolith/entity-descriptions/entities/combatTechnique"
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
 * Displays all information about a ranged combat technique.
 */
export const InlineLibraryRangedCombatTechnique: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const entry = useAppSelector(SelectGetById.Static.RangedCombatTechnique)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getRangedCombatTechniqueEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getAttributeById,
        },
        locale,
        entry,
      ),
    [entry, getAttributeById],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
