import {
  Publication,
  PublicationTranslation,
} from "optolith-database-schema/types/source/Publication"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import {
  selectIncludeAllPublications,
  selectIncludePublications,
} from "../../../../slices/characterSlice.ts"
import { switchIncludePublication } from "../../../../slices/rulesSlice.ts"

type Props = {
  publication: {
    publication: Publication
    publicationTranslation: PublicationTranslation
  }
}

/**
 * Returns a single publication item.
 */
export const RuleSourcesListItem: FC<Props> = props => {
  const {
    publication: { publication, publicationTranslation },
  } = props

  const dispatch = useAppDispatch()
  const includeAllPublications = useAppSelector(selectIncludeAllPublications) === true
  const includePublications = useAppSelector(selectIncludePublications)

  const handleSwitch = useCallback(
    () => dispatch(switchIncludePublication(publication.id)),
    [dispatch, publication.id],
  )

  return (
    <Checkbox
      className={publication.contains_adult_content ? "adult-content" : undefined}
      checked={
        publication.category === "CoreRules" ||
        (includePublications?.includes(publication.id) ?? false) ||
        (!publication.contains_adult_content && includeAllPublications)
      }
      onClick={handleSwitch}
      label={publicationTranslation.name}
      disabled={
        (includeAllPublications && !publication.contains_adult_content) ||
        publication.category === "CoreRules"
      }
    />
  )
}
