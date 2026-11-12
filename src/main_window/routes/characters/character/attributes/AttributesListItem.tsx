import { toKebabCase } from "@elyukai/utils/string"
import { observer } from "mobx-react-lite"
import { type FC, type MouseEvent, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"

type Props = {
  attribute: DisplayedAttribute
}

/**
 * Returns a single attribute value item with buttons to adjust the value.
 */
export const AttributeListItem: FC<Props> = observer(props => {
  const { attribute } = props

  const translate = useTranslate()
  const { isInCharacterCreation, canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const {
    id,
    value,
    maxValue: maximum,
    isDecreasable,
    isIncreasable,
    color,
    name,
    abbreviation,
    description,
  } = attribute

  const valueHeader = isInCharacterCreation ? `${value} / ${maximum}` : value

  const handleAdd = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey && maximum !== undefined) {
        actions.incrementRatedToMax("Attribute", id)
      } else {
        actions.incrementRated("Attribute", id)
      }
    },
    [isIncreasable, maximum],
  )

  const handleRemove = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey) {
        actions.decrementRatedToMin("Attribute", id)
      } else {
        actions.decrementRated("Attribute", id)
      }
    },
    [isDecreasable],
  )

  return (
    <AttributeBorder
      className={`attr--${toKebabCase(color.kind)}`}
      label={abbreviation}
      value={value}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{name}</span>
            <span>{valueHeader}</span>
          </h4>
          <p>{description}</p>
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
      {canRemove ? (
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
})
