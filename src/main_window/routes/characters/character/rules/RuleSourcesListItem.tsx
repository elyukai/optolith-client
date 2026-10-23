import { PublicationTranslation } from "@optolith/database-schema/gen"
import { FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import type { CharacterPublicationOverview } from "../../../../../shared/domain/rules.ts"
import { ExternalAPI } from "../../../../external.ts"

type Props = {
  publication: CharacterPublicationOverview & {
    publicationTranslation: PublicationTranslation
  }
}

/**
 * Returns a single publication item.
 */
export const RuleSourcesListItem: FC<Props> = props => {
  const {
    publication: { id, dbEntry: publication, publicationTranslation, active, disabled },
  } = props

  const handleSwitch = useCallback(() => ExternalAPI.execute("togglePublication", id), [id])

  return (
    <Checkbox
      className={publication.containsAdultContent ? "adult-content" : undefined}
      checked={active}
      onClick={handleSwitch}
      label={publicationTranslation.name}
      disabled={disabled}
    />
  )
}
