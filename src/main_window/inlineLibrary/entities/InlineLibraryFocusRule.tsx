import { FC } from "react"
import { LibraryEntry } from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { getFocusRuleLibraryEntry } from "../../../shared/domain/rules/focusRule.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"
import { selectStaticFocusRules } from "../../slices/databaseSlice.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a focus rule.
 */
export const InlineLibraryFocusRule: FC<Props> = ({ id }) => {
  const entry = useAppSelector(selectStaticFocusRules)[id]
  const getSubjectById = useAppSelector(SelectGetById.Static.Subject)

  return <LibraryEntry createLibraryEntry={getFocusRuleLibraryEntry(entry, { getSubjectById })} />
}
