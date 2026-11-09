import type { TinyActivatableIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback } from "react"
import { IconButton } from "../../../../shared/components/iconButton/IconButton.tsx"
import { ListItemButtons } from "../../../../shared/components/list/ListItemButtons.tsx"
import { useTranslate } from "../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../hooks/characterState.ts"

type Props = {
  entityName: TinyActivatableIdentifier["kind"]
  entry: {
    id: string
    isDisabled: boolean
  }
  active?: boolean
  selectForInfo(): void
}

/**
 * Returns a list of buttons for a skill row.
 */
export const TinyActivatableButtons: React.FC<Props> = observer(
  function TinyActivatableButtons(props) {
    const { entityName, entry, active = false, selectForInfo } = props

    const translate = useTranslate()
    const { canRemove } = useCharacterState()
    const actions = useCharacterActions()

    const handleActivate = useCallback(() => {
      if (!active && !entry.isDisabled) {
        // TODO: Check AP
        actions.addTinyActivatable(entityName, entry.id)
      }
    }, [active, entry.isDisabled, entityName, entry.id])

    const handleDeactivate = useCallback(() => {
      if (canRemove && active && !entry.isDisabled) {
        actions.removeTinyActivatable(entityName, entry.id)
      }
    }, [entityName, canRemove, active, entry.isDisabled, entityName, entry.id])

    return (
      <ListItemButtons>
        {!active ? (
          <IconButton
            icon="&#xE916;"
            onClick={handleActivate}
            disabled={entry.isDisabled}
            label={translate("Activate")}
            flat
          />
        ) : (
          <>
            <IconButton
              icon={"\uE90b"}
              onClick={handleDeactivate}
              disabled={entry.isDisabled}
              label={translate("Decrement")}
              flat
            />
          </>
        )}
        <IconButton
          icon="&#xE912;"
          onClick={selectForInfo}
          label={translate("Show details")}
          flat
        />
      </ListItemButtons>
    )
  },
)
