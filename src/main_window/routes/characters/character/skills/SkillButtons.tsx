import { useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ImprovementCost } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"

type Props = {
  activateDisabled?: boolean
  addDisabled?: boolean
  ic?: ImprovementCost
  id: number
  isNotActive?: boolean
  removeDisabled?: boolean
  sr?: number
  activate?(id: number): void
  addPoint?(id: number): void
  removePoint?(id: number): void
  selectForInfo(id: number): void
}

/**
 * Returns a list of buttons for a skill row.
 */
export const SkillButtons: React.FC<Props> = props => {
  const {
    activateDisabled,
    addDisabled,
    ic,
    id,
    isNotActive,
    removeDisabled,
    sr,
    activate,
    addPoint,
    removePoint,
    selectForInfo,
  } = props

  const translate = useTranslate()

  const boundSelectForInfo = useCallback(() => selectForInfo(id), [selectForInfo, id])

  const getRemoveIcon = () =>
    (sr !== undefined && sr === 0 && removeDisabled !== true) || ic === undefined
      ? "\uE90b"
      : "\uE909"

  const handleActivation = useCallback(
    () => (typeof activate === "function" ? activate(id) : undefined),
    [activate, id],
  )

  const handleAddPoint = useCallback(
    () => (addDisabled !== true && typeof addPoint === "function" ? addPoint(id) : undefined),
    [addPoint, id, addDisabled],
  )

  const handleRemovePoint = useCallback(
    () =>
      removeDisabled !== true && typeof removePoint === "function" ? removePoint(id) : undefined,
    [removePoint, id, removeDisabled],
  )

  return (
    <ListItemButtons>
      {isNotActive === true ? (
        <IconButton
          icon="&#xE916;"
          onClick={handleActivation}
          disabled={activateDisabled}
          label={translate("Activate")}
          flat
        />
      ) : (
        <>
          {typeof addPoint === "function" ? (
            <IconButton
              icon="&#xE908;"
              onClick={handleAddPoint}
              disabled={addDisabled}
              label={translate("Increment")}
              flat
            />
          ) : null}
          {typeof removePoint === "function" ? (
            <IconButton
              icon={getRemoveIcon()}
              onClick={handleRemovePoint}
              disabled={removeDisabled}
              label={translate("Decrement")}
              flat
            />
          ) : null}
        </>
      )}
      <IconButton
        icon="&#xE912;"
        onClick={boundSelectForInfo}
        label={translate("Show details")}
        flat
      />
    </ListItemButtons>
  )
}
