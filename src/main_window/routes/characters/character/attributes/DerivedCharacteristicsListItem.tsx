import { FC, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { NumberBox } from "../../../../../shared/components/numberBox/NumberBox.tsx"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { sign } from "../../../../../shared/utils/math.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { DisplayedDerivedCharacteristic, isDisplayedEnergy } from "../../../../selectors/derivedCharacteristicsSelectors.ts"
import { decrementArcaneEnergy, decrementKarmaPoints, decrementLifePoints, incrementArcaneEnergy, incrementKarmaPoints, incrementLifePoints } from "../../../../slices/derivedCharacteristicsSlice.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"
import { DerivedCharacteristicsListItemPermanent } from "./DerivedCharacteristicsListItemPermanent.tsx"

type Props = {
  attribute: DisplayedDerivedCharacteristic
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

export const DerivedCharacteristicsListItem: FC<Props> = props => {
  const {
    attribute,
    isInCharacterCreation,
    isRemovingEnabled,
  } = props

  const {
    id,
    base,
    value,
    modifier,
    purchaseMaximum,
    purchased,
  } = attribute

  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const translations = translateMap(attribute.static.translations)

  const handleAddMaxEnergyPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: dispatch(incrementLifePoints); break
        case DCId.ArcaneEnergy: dispatch(incrementArcaneEnergy); break
        case DCId.KarmaPoints: dispatch(incrementKarmaPoints); break
        default: break
      }
    },
    [ dispatch, id ]
  )

  const handleRemoveMaxEnergyPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: dispatch(decrementLifePoints); break
        case DCId.ArcaneEnergy: dispatch(decrementArcaneEnergy); break
        case DCId.KarmaPoints: dispatch(decrementKarmaPoints); break
        default: break
      }
    },
    [ dispatch, id ]
  )

  const calculation = translations?.calculation?.[attribute.calculation ?? "default"]

  return (
    <div className="derived-characteristics-item">
      <AttributeBorder
        label={translations?.abbreviation ?? ""}
        value={value}
        tooltip={(
          <div className="calc-attr-overlay">
            <h4>
              <span>{translations?.name ?? ""}</span>
              <span>{value}</span>
            </h4>
            {calculation === undefined
              ? null
              : (
                <p className="calc-text">
                  {`${calculation} = `}
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
              {purchased !== undefined && !isInCharacterCreation
                ? (
                  <span className="add">
                    {translate("Bought")}
                    {": "}
                    {purchased}
                    {" / "}
                    {purchaseMaximum}
                  </span>
                )
              : null}
            </p>
          </div>
        )}
        tooltipMargin={7}
        >
        {purchaseMaximum !== undefined && purchaseMaximum > 0 && !isInCharacterCreation
          ? <NumberBox current={purchased} max={purchaseMaximum} />
          : null}
        {
          !isInCharacterCreation && isDisplayedEnergy(attribute)
          ? (
            <IconButton
              className="add"
              icon="&#xE908;"
              label={translate("Increment")}
              onClick={handleAddMaxEnergyPoint}
              disabled={!attribute.isIncreasable}
              />
          )
          : null
        }
        {
          !isInCharacterCreation && isRemovingEnabled && isDisplayedEnergy(attribute)
            ? (
              <IconButton
                className="remove"
                icon="&#xE909;"
                label={translate("Decrement")}
                onClick={handleRemoveMaxEnergyPoint}
                disabled={!attribute.isDecreasable}
                />
            )
            : null
        }
      </AttributeBorder>
      {
        isDisplayedEnergy(attribute)
        ? (
          <DerivedCharacteristicsListItemPermanent
            attribute={attribute}
            isRemovingEnabled={isRemovingEnabled}
            />
        )
        : null
      }
    </div>
  )
}
