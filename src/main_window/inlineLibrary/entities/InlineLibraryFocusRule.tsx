import { getFocusRuleEntityDescription } from "@optolith/entity-descriptions/entities/focusRule"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
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

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getFocusRuleEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getSubjectById,
        },
        locale,
        entry,
      ),
    [entry, getSubjectById],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
