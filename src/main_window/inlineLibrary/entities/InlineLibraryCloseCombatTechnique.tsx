import { getCloseCombatTechniqueEntityDescription } from "@optolith/entity-descriptions/entities/combatTechnique"
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
 * Displays all information about a close combat technique.
 */
export const InlineLibraryCloseCombatTechnique: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const entry = useAppSelector(SelectGetById.Static.CloseCombatTechnique)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getCloseCombatTechniqueEntityDescription(
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
