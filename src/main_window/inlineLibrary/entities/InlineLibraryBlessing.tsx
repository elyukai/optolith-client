import { getBlessingEntityDescription } from "@optolith/entity-descriptions/entities/liturgicalChant"
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
 * Displays all information about a blessing.
 */
export const InlineLibraryBlessing: FC<Props> = ({ id }) => {
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const entry = useAppSelector(SelectGetById.Static.Blessing)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getBlessingEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getTargetCategoryById,
        },
        locale,
        entry,
      ),
    [entry, getTargetCategoryById],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
