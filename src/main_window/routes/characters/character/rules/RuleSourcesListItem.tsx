import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import type { CharacterPublicationOverview } from "../../../../../shared/domain/rules.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"

type Props = {
  publication: CharacterPublicationOverview
}

/**
 * Returns a single publication item.
 */
export const RuleSourcesListItem: FC<Props> = observer(props => {
  const {
    publication: { id, name, containsAdultContent, active, disabled },
  } = props

  const actions = useCharacterActions()
  const handleSwitch = useCallback(() => actions.togglePublication(id), [id])

  return (
    <li>
      <Checkbox
        className={containsAdultContent ? "adult-content" : undefined}
        checked={active}
        onClick={handleSwitch}
        label={name}
        disabled={disabled}
      />
    </li>
  )
})
