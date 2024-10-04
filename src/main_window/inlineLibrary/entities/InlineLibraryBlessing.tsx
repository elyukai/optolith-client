import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getBlessingLibraryEntry } from "../../../shared/domain/rated/liturgicalChant.ts"
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

  return (
    <LibraryEntry
      createLibraryEntry={getBlessingLibraryEntry(entry, {
        getTargetCategoryById,
      })}
    />
  )
}
