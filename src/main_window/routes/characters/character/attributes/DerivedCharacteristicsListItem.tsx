import { FC } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import type { DisplayedDerivedCharacteristic } from "../../../../../shared/domain/energy.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { sign } from "../../../../../shared/utils/math.ts"
import { ExternalAPI } from "../../../../external.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"
import { DerivedCharacteristicsListItemPermanent } from "./DerivedCharacteristicsListItemPermanent.tsx"

type Props = {
  attribute: DisplayedDerivedCharacteristic
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

/**
 * Returns a single derived characterstics value item with optional buttons to
 * manage the value.
 */
export const DerivedCharacteristicsListItem: FC<Props> = props => {
  const { attribute, isInCharacterCreation, isRemovingEnabled } = props

  const { id, base, value, modifier, purchaseMaximum, purchased } = attribute

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const translation = translateMap(attribute.translations)

  const calculation = attribute.calculation.base // TODO

  return (
    <div className="derived-characteristics-item">
      <AttributeBorder
        label={translation?.abbreviation ?? ""}
        value={value}
        tooltip={
          <div className="calc-attr-overlay">
            <h4>
              <span>{translation?.name ?? ""}</span>
              <span>{value}</span>
            </h4>
            {calculation.kind === "Value" && calculation.Value.kind === "Constant" ? null : (
              <p className="calc-text">
                {`${JSON.stringify(calculation) /* TODO */} = `}
                {base}
              </p>
            )}
            <p>
              <span className="mod">
                {translate("Modifier")}
                {": "}
                {sign(modifier)}
                <br />
              </span>
              {purchased !== undefined && !isInCharacterCreation ? (
                <span className="add">
                  {translate("Bought")}
                  {": "}
                  {purchased}
                  {" / "}
                  {purchaseMaximum}
                </span>
              ) : null}
            </p>
          </div>
        }
        tooltipMargin={7}
      >
        {purchaseMaximum !== undefined && purchaseMaximum > 0 && !isInCharacterCreation ? (
          <NumberBox current={purchased} max={purchaseMaximum} />
        ) : null}
        {!isInCharacterCreation && attribute.type?.kind === "Energy" ? (
          <IconButton
            className="add"
            icon="&#xE908;"
            label={translate("Increment")}
            onClick={() => ExternalAPI.execute("incrementDerivedCharacteristic", id)}
            disabled={!attribute.isPurchasedIncreasable}
          />
        ) : null}
        {!isInCharacterCreation && isRemovingEnabled && attribute.type?.kind === "Energy" ? (
          <IconButton
            className="remove"
            icon="&#xE909;"
            label={translate("Decrement")}
            onClick={() => ExternalAPI.execute("decrementDerivedCharacteristic", id)}
            disabled={!attribute.isPurchasedDecreasable}
          />
        ) : null}
      </AttributeBorder>
      {attribute.type?.kind === "Energy" ? (
        <DerivedCharacteristicsListItemPermanent
          attribute={attribute}
          isRemovingEnabled={isRemovingEnabled}
        />
      ) : null}
    </div>
  )
}
