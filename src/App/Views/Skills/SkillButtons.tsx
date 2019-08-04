import * as React from "react";
import { orN } from "../../../Data/Maybe";
import { isNumber } from "../../Utilities/typeCheckUtils";
import { IconButton } from "../Universal/IconButton";
import { ListItemButtons } from "../Universal/ListItemButtons";

export interface SkillButtonsProps {
  activateDisabled?: boolean
  addDisabled?: boolean
  ic?: number
  id: string
  isNotActive?: boolean
  removeDisabled?: boolean
  sr?: number
  activate? (): void
  addPoint? (): void
  removePoint? (): void
  selectForInfo (id: string): void
}

export function SkillButtons (props: SkillButtonsProps) {
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

  const boundSelectForInfo = () => selectForInfo (id)

  const getRemoveIcon =
    () => isNumber (sr) && sr === 0 && removeDisabled !== true || ic === undefined
            ? "\uE90b"
            : "\uE909"

  return (
    <ListItemButtons>
      {orN (isNotActive)
        ? (
          <IconButton
            icon="&#xE916;"
            onClick={activate}
            disabled={activateDisabled}
            flat
            />
        )
        : (
            <>
              {addPoint
                ? (
                  <IconButton
                    icon="&#xE908;"
                    onClick={addPoint}
                    disabled={addDisabled}
                    flat
                    />
                )
              : null}
              {removePoint
                ? (
                  <IconButton
                    icon={getRemoveIcon ()}
                    onClick={removePoint}
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
