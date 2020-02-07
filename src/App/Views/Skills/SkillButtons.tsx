import * as React from "react"
import { orN } from "../../../Data/Maybe"
import { isNumber } from "../../Utilities/typeCheckUtils"
import { IconButton } from "../Universal/IconButton"
import { ListItemButtons } from "../Universal/ListItemButtons"

interface Props {
  activateDisabled?: boolean
  addDisabled?: boolean
  ic?: number
  id: string
  isNotActive?: boolean
  removeDisabled?: boolean
  sr?: number
  activate? (id: string): void
  addPoint? (id: string): void
  removePoint? (id: string): void
  selectForInfo (id: string): void
}

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

  const boundSelectForInfo =
    React.useCallback (
      () => selectForInfo (id),
      [ selectForInfo, id ]
    )

  const getRemoveIcon =
    () => (isNumber (sr) && sr === 0 && removeDisabled !== true) || ic === undefined
      ? "\uE90b"
      : "\uE909"

  const handleActivation =
    React.useCallback (
      () => typeof activate === "function"
            ? activate (id)
            : undefined,
      [ activate, id ]
    )

  const handleAddPoint =
    React.useCallback (
      () => addDisabled !== true && typeof addPoint === "function"
            ? addPoint (id)
            : undefined,
      [ addPoint, id, addDisabled ]
    )

  const handleRemovePoint =
    React.useCallback (
      () => removeDisabled !== true && typeof removePoint === "function"
            ? removePoint (id)
            : undefined,
      [ removePoint, id, removeDisabled ]
    )

  return (
    <ListItemButtons>
      {orN (isNotActive)
        ? (
          <IconButton
            icon="&#xE916;"
            onClick={handleActivation}
            disabled={activateDisabled}
            flat
            />
        )
        : (
            <>
              {typeof addPoint === "function"
                ? (
                  <IconButton
                    icon="&#xE908;"
                    onClick={handleAddPoint}
                    disabled={addDisabled}
                    flat
                    />
                )
              : null}
              {typeof removePoint === "function"
                ? (
                  <IconButton
                    icon={getRemoveIcon ()}
                    onClick={handleRemovePoint}
                    disabled={removeDisabled}
                    flat
                    />
                )
              : null}
            </>
          )}
      <IconButton
        icon="&#xE912;"
        onClick={boundSelectForInfo}
        flat
        />
    </ListItemButtons>
  )
}
