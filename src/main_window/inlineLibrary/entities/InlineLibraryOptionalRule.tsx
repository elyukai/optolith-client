import { getOptionalRuleEntityDescription } from "@optolith/entity-descriptions/entities/optionalRule"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
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

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getOptionalRuleEntityDescription(defaultDatabaseAccessors, locale, entry),
    [entry],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
