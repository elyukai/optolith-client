import { type FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import type { CharacterPublicationOverview } from "../../../../../shared/domain/rules.ts"
import { SharedActions } from "../../../../external.ts"

type Props = {
  publication: CharacterPublicationOverview
}

/**
 * Returns a single publication item.
 */
export const RuleSourcesListItem: FC<Props> = props => {
  const {
    publication: { id, name, containsAdultContent, active, disabled },
  } = props

  const handleSwitch = useCallback(() => SharedActions.togglePublication(id), [id])

  return (
    <Checkbox
      className={containsAdultContent ? "adult-content" : undefined}
      checked={active}
      onClick={handleSwitch}
      label={name}
      disabled={disabled}
    />
  )
}
