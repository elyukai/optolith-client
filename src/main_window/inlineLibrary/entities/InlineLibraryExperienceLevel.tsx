import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getExperienceLevelLibraryEntry } from "../../../shared/domain/experienceLevel.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { selectStaticExperienceLevels } from "../../slices/databaseSlice.ts"

type Props = {
  id: number
}

/**
 * Displays all information about an experience level.
 */
export const InlineLibraryExperienceLevel: FC<Props> = ({ id }) => {
  const entry = useAppSelector(selectStaticExperienceLevels)[id]

  return <LibraryEntry createLibraryEntry={getExperienceLevelLibraryEntry(entry)} />
}
