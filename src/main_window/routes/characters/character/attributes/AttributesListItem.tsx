import { toKebabCase } from "@elyukai/utils/string"
import { FC, MouseEvent, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { ExternalAPI } from "../../../../external.ts"
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
  const translations = translateMap(attribute.translations)

  const { id, value, maxValue: maximum, isDecreasable, isIncreasable, color } = attribute

  const valueHeader = isInCharacterCreation ? `${value} / ${maximum}` : value

  const handleAdd = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey && maximum !== undefined) {
        ExternalAPI.execute("incrementAttributeToMax", id)
      } else {
        ExternalAPI.execute("incrementAttribute", id)
      }
    },
    [isIncreasable, maximum],
  )

  const handleRemove = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.shiftKey) {
        ExternalAPI.execute("decrementAttributeToMin", id)
      } else {
        ExternalAPI.execute("decrementAttribute", id)
      }
    },
    [isDecreasable],
  )

  return (
    <AttributeBorder
      className={`attr--${toKebabCase(color.kind)}`}
      label={translations?.abbreviation ?? id}
      value={value}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{translations?.name ?? id}</span>
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
