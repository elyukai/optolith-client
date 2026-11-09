import type {
  RatedIdentifier,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { type MouseEvent, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

type Props = {
  entityName: RatedIdentifier["kind"]
  entry:
    | {
        id: string
        active: false
        isAvailable: boolean
        isIncreasable?: undefined
        isDecreasable?: undefined
        value?: undefined
      }
    | {
        id: string
        active?: true
        isAvailable?: undefined
        isIncreasable: boolean
        isDecreasable: boolean
        value: number
      }
  selectForInfo(): void
}

const isActivatableRated = (
  entityName: RatedIdentifier["kind"],
): entityName is SkillWithEnhancementsIdentifier["kind"] =>
  entityName !== "Skill" &&
  entityName !== "CloseCombatTechnique" &&
  entityName !== "RangedCombatTechnique"

/**
 * Returns a list of buttons for a skill row.
 */
export const SkillButtons: React.FC<Props> = observer(function SkillButtons(props) {
  const { entityName, entry, selectForInfo } = props
  const { active, isAvailable, isIncreasable, isDecreasable, value, id } = entry

  const translate = useTranslate()
  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const handleActivate = useCallback(() => {
    if (isActivatableRated(entityName) && active === false && isAvailable) {
      actions.activateRated(entityName, id)
    }
  }, [actions, active, entityName, id, isAvailable])

  const handleAddPoint = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (active !== false && isIncreasable) {
        // TODO: Check AP
        if (event.shiftKey) {
          actions.incrementRatedToMax(entityName, id)
        } else {
          actions.incrementRated(entityName, id)
        }
      }
    },
    [actions, active, entityName, id, isIncreasable],
  )

  const handleRemovePoint = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (canRemove && active !== false && isDecreasable) {
        if (isActivatableRated(entityName) && active === true && value === 0) {
          actions.deactivateRated(entityName, id)
        } else if (event.shiftKey) {
          actions.decrementRatedToMin(entityName, id)
        } else {
          actions.decrementRated(entityName, id)
        }
      }
    },
    [actions, active, canRemove, entityName, id, isDecreasable, value],
  )

  return (
    <ListItemButtons>
      {active === false ? (
        <IconButton
          icon="&#xE916;"
          onClick={handleActivate}
          disabled={!isAvailable}
          label={translate("Activate")}
          flat
        />
      ) : (
        <>
          <IconButton
            icon="&#xE908;"
            onClick={handleAddPoint}
            disabled={!isIncreasable}
            label={translate("Increment")}
            flat
          />
          {canRemove ? (
            <IconButton
              icon={active === true && value === 0 ? "\uE90b" : "\uE909"}
              onClick={handleRemovePoint}
              disabled={!isDecreasable}
              label={translate("Decrement")}
              flat
            />
          ) : null}
        </>
      )}
      <IconButton icon="&#xE912;" onClick={selectForInfo} label={translate("Show details")} flat />
    </ListItemButtons>
  )
})
