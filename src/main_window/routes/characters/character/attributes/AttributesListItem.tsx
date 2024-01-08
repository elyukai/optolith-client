import { FC, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { DisplayedAttribute } from "../../../../selectors/attributeSelectors.ts"
import { decrementAttribute, incrementAttribute } from "../../../../slices/attributesSlice.ts"
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

  const dispatch = useAppDispatch()

  const {
    dynamic: { value },
    static: { id },
    maximum: max,
    isDecreasable,
    isIncreasable,
  } = attribute

  const valueHeader = isInCharacterCreation ? `${value} / ${max}` : value

  const handleAdd = useCallback(() => dispatch(incrementAttribute(id)), [dispatch, id])

  const handleRemove = useCallback(() => dispatch(decrementAttribute(id)), [dispatch, id])

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
      {isInCharacterCreation ? <NumberBox max={max} /> : null}
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
