import { MouseEvent, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"

type Props = {
  activateDisabled?: boolean
  addDisabled?: boolean
  isNotActive?: boolean
  removeDisabled?: boolean
  decrementIsRemove?: boolean
  activate?(): void
  addPoint?(): void
  setToMax?(): void
  removePoint?(): void
  setToMin?(): void
  selectForInfo(): void
}

/**
 * Returns a list of buttons for a skill row.
 */
export const SkillButtons: React.FC<Props> = props => {
  const {
    activateDisabled,
    addDisabled,
    isNotActive,
    removeDisabled,
    decrementIsRemove,
    activate,
    addPoint,
    setToMax,
    setToMin,
    removePoint,
    selectForInfo,
  } = props

  const translate = useTranslate()

  const handleAddPoint = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (addDisabled !== true && typeof addPoint === "function") {
        if (event.shiftKey && typeof setToMax === "function") {
          setToMax()
        } else {
          addPoint()
        }
      }
    },
    [addDisabled, addPoint, setToMax],
  )

  const handleRemovePoint = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (removeDisabled !== true && typeof removePoint === "function") {
        if (event.shiftKey && typeof setToMin === "function") {
          setToMin()
        } else {
          removePoint()
        }
      }
    },
    [removeDisabled, removePoint, setToMin],
  )

  return (
    <ListItemButtons>
      {isNotActive === true ? (
        <IconButton
          icon="&#xE916;"
          onClick={activate}
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
              icon={decrementIsRemove === true ? "\uE90b" : "\uE909"}
              onClick={handleRemovePoint}
              disabled={removeDisabled}
              label={translate("Decrement")}
              flat
            />
          ) : null}
        </>
      )}
      <IconButton icon="&#xE912;" onClick={selectForInfo} label={translate("Show details")} flat />
    </ListItemButtons>
  )
}
