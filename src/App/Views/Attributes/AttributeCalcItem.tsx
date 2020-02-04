import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { bindF, ensure, fromJust, fromMaybe, isJust, liftM2, maybe, Maybe, or } from "../../../Data/Maybe"
import { gt, subtractBy } from "../../../Data/Num"
import { Record } from "../../../Data/Record"
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { sign, signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { IconButton } from "../Universal/IconButton"
import { NumberBox } from "../Universal/NumberBox"
import { AttributeBorder } from "./AttributeBorder"

export interface AttributeCalcItemProps {
  attribute: Record<DerivedCharacteristic>
  l10n: L10nRecord
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  addLifePoint (): void
  addArcaneEnergyPoint (): void
  addKarmaPoint (): void
  removeLifePoint (): void
  removeArcaneEnergyPoint (): void
  removeKarmaPoint (): void
}

const DCA = DerivedCharacteristic.A

export const AttributeCalcItem: React.FC<AttributeCalcItemProps> = props => {
  const {
    attribute,
    l10n,
    isInCharacterCreation,
    isRemovingEnabled,
    addLifePoint,
    addArcaneEnergyPoint,
    addKarmaPoint,
    removeLifePoint,
    removeArcaneEnergyPoint,
    removeKarmaPoint,
  } = props

  const handleAddMaxEnergyPoint = React.useCallback (
    () => {
      switch (DCA.id (attribute)) {
        case "LP":
          addLifePoint ()
          break

        case "AE":
          addArcaneEnergyPoint ()
          break

        case "KP":
          addKarmaPoint ()
          break

        default:
          break
      }
    },
    [ addArcaneEnergyPoint, addKarmaPoint, addLifePoint, attribute ]
  )

  const handleRemoveMaxEnergyPoint = React.useCallback (
    () => {
      switch (DCA.id (attribute)) {
        case "LP":
            removeLifePoint ()
          break

        case "AE":
            removeArcaneEnergyPoint ()
          break

        case "KP":
            removeKarmaPoint ()
          break

        default:
          break
      }
    },
    [ removeArcaneEnergyPoint, removeKarmaPoint, removeLifePoint, attribute ]
  )

  const base = DCA.base (attribute)
  const mod = DCA.mod (attribute)
  const mcurrent_add = DCA.currentAdd (attribute)
  const mmax_add = DCA.maxAdd (attribute)
  const has_value = isJust (DCA.value (attribute))
  const value = maybe ("\u2013") (signNeg) (DCA.value (attribute))
  const mpermanent_lost = DCA.permanentLost (attribute)
  const mpermanent_redeemed = DCA.permanentRedeemed (attribute)

  return (
    <AttributeBorder
      label={DCA.short (attribute)}
      value={value}
      tooltip={(
        <div className="calc-attr-overlay">
          <h4>
            <span>{DCA.name (attribute)}</span>
            <span>{value}</span>
          </h4>
          <p className="calc-text">
            {DCA.calc (attribute)}
            {" = "}
            {fromMaybe<string | number> ("\u2013") (base)}
          </p>
          {isJust (mod) || (isJust (mcurrent_add) && !isInCharacterCreation)
            ? (
              <p>
                {isJust (mod)
                  ? (
                    <span className="mod">
                      {translate (l10n) ("modifier")}
                      {": "}
                      {sign (fromJust (mod))}
                      <br />
                    </span>
                  )
                : null}
                {isJust (mcurrent_add) && !isInCharacterCreation
                  ? (
                    <span className="add">
                      {translate (l10n) ("bought")}
                      {": "}
                      {fromJust (mcurrent_add)}
                      {" / "}
                      {fromMaybe<string | number> ("\u2013") (mmax_add)}
                    </span>
                  )
                : null}
              </p>
            )
          : null}
        </div>
      )}
      tooltipMargin={7}
      >
      {pipe_ (
        mmax_add,
        bindF (ensure (maxAdd => !isInCharacterCreation && maxAdd > 0)),
        maybe (<></>) (maxAdd => (<NumberBox current={mcurrent_add} max={maxAdd} />))
      )}
      {
        has_value
        && !isInCharacterCreation
          ? fromMaybe (<></>)
                      (liftM2 ((current_add: number) => (max_add: number) => (
                                <IconButton
                                  className="add"
                                  icon="&#xE908;"
                                  onClick={handleAddMaxEnergyPoint}
                                  disabled={
                                    current_add >= max_add
                                    || or (fmapF (mpermanent_lost)
                                                  (pipe (
                                                    subtractBy (Maybe.sum (mpermanent_redeemed)),
                                                    gt (0)
                                                  )))
                                  }
                                  />
                              ))
                              (mcurrent_add)
                              (mmax_add))
          : null
      }
      {
        has_value
        && !isInCharacterCreation
        && isRemovingEnabled
        && isJust (mmax_add)
          ? maybe (<></>)
                  ((current_add: number) => (
                    <IconButton
                      className="remove"
                      icon="&#xE909;"
                      onClick={handleRemoveMaxEnergyPoint}
                      disabled={
                        current_add <= 0
                        || or (fmapF (mpermanent_lost)
                                      (pipe (
                                        subtractBy (Maybe.sum (mpermanent_redeemed)),
                                        gt (0)
                                      )))
                      }
                      />
                  ))
                  (mcurrent_add)
          : null
      }
    </AttributeBorder>
  )
}
