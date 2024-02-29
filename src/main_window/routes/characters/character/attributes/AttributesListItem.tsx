import { FC, MouseEvent, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import {
  attributeImprovementCost,
  minimumAttributeValue,
} from "../../../../../shared/domain/rated/attribute.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useRatedActions } from "../../../../hooks/ratedActions.ts"
import { DisplayedAttribute } from "../../../../selectors/attributeSelectors.ts"
import {
  decrementAttribute,
  incrementAttribute,
  setAttribute,
} from "../../../../slices/attributesSlice.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"

type Props = {
  attribute: DisplayedAttribute
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

/**
 * Returns a single attribute value item with buttons to adjust the value.
 */
export const AttributeListItem: FC<Props> = props => {
  const { attribute, isInCharacterCreation, isRemovingEnabled } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const translations = translateMap(attribute.static.translations)

  const {
    dynamic: { value },
    static: { id },
    maximum,
    isDecreasable,
    isIncreasable,
  } = attribute

  const valueHeader = isInCharacterCreation ? `${value} / ${maximum}` : value

  const { handleAddPoint, handleRemovePoint, handleSetToMaximumPoints, handleSetToMinimumPoints } =
    useRatedActions(
      id,
      value,
      maximum ?? value,
      minimumAttributeValue,
      attributeImprovementCost,
      incrementAttribute,
      decrementAttribute,
      setAttribute,
    )

  const handleAdd = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isIncreasable) {
        if (event.shiftKey && maximum !== undefined) {
          handleSetToMaximumPoints()
        } else {
          handleAddPoint()
        }
      }
    },
    [handleAddPoint, handleSetToMaximumPoints, isIncreasable, maximum],
  )

  const handleRemove = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isDecreasable) {
        if (event.shiftKey) {
          handleSetToMinimumPoints()
        } else {
          handleRemovePoint()
        }
      }
    },
    [handleRemovePoint, handleSetToMinimumPoints, isDecreasable],
  )

  return (
    <AttributeBorder
      className={`attr--${id.toFixed()}`}
      label={translations?.abbreviation ?? id.toFixed()}
      value={value}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{translations?.name ?? id.toFixed()}</span>
            <span>{valueHeader}</span>
          </h4>
          {translations === undefined ? null : <p>{translations.description}</p>}
        </div>
      }
      tooltipMargin={11}
    >
      {isInCharacterCreation ? <NumberBox max={maximum} /> : null}
      <IconButton
        className="add"
        icon="&#xE908;"
        onClick={handleAdd}
        disabled={!isIncreasable}
        label={translate("Increment")}
      />
      {isRemovingEnabled ? (
        <IconButton
          className="remove"
          icon="&#xE909;"
          onClick={handleRemove}
          disabled={!isDecreasable}
          label={translate("Decrement")}
        />
      ) : null}
    </AttributeBorder>
  )
}
