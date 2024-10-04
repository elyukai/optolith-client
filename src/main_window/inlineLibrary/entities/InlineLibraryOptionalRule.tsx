import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getOptionalRuleLibraryEntry } from "../../../shared/domain/rules/optionalRule.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { selectStaticOptionalRules } from "../../slices/databaseSlice.ts"

type Props = {
  id: number
}

/**
 * Displays all information about an optional rule.
 */
export const InlineLibraryOptionalRule: FC<Props> = ({ id }) => {
  const entry = useAppSelector(selectStaticOptionalRules)[id]

  return <LibraryEntry createLibraryEntry={getOptionalRuleLibraryEntry(entry)} />
}
