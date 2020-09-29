import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { bindF, ensure, fromJust, fromMaybe, isJust, liftM2, maybe, Maybe, or } from "../../../Data/Maybe"
import { gt, subtractBy } from "../../../Data/Num"
import { fst, snd } from "../../../Data/Tuple"
import { DerivedCharacteristicValues } from "../../Models/View/DerivedCharacteristicCombined"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { DCPair } from "../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../Utilities/I18n"
import { sign, signNeg } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { IconButton } from "../Universal/IconButton"
import { NumberBox } from "../Universal/NumberBox"
import { AttributeBorder } from "./AttributeBorder"

export interface AttributeCalcItemProps {
  attribute: DCPair
  staticData: StaticDataRecord
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
const DCVA = DerivedCharacteristicValues.A

export const AttributeCalcItem: React.FC<AttributeCalcItemProps> = props => {
  const {
    attribute,
    staticData,
    isInCharacterCreation,
    isRemovingEnabled,
    addLifePoint,
    addArcaneEnergyPoint,
    addKarmaPoint,
    removeLifePoint,
    removeArcaneEnergyPoint,
    removeKarmaPoint,
  } = props

  const id = DCA.id (fst (attribute))

  const handleAddMaxEnergyPoint = React.useCallback (
    () => {
      switch (id) {
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
    [ addArcaneEnergyPoint, addKarmaPoint, addLifePoint, id ]
  )

  const handleRemoveMaxEnergyPoint = React.useCallback (
    () => {
      switch (id) {
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
    [ removeArcaneEnergyPoint, removeKarmaPoint, removeLifePoint, id ]
  )

  const base = DCVA.base (snd (attribute))
  const mod = DCVA.mod (snd (attribute))
  const mcurrent_add = DCVA.currentAdd (snd (attribute))
  const mmax_add = DCVA.maxAdd (snd (attribute))
  const has_value = isJust (DCVA.value (snd (attribute)))
  const value = maybe ("\u2013") (signNeg) (DCVA.value (snd (attribute)))
  const mpermanent_lost = DCVA.permanentLost (snd (attribute))
  const mpermanent_redeemed = DCVA.permanentRedeemed (snd (attribute))

  return (
    <AttributeBorder
      label={DCA.short (fst (attribute))}
      value={value}
      tooltip={(
        <div className="calc-attr-overlay">
          <h4>
            <span>{DCA.name (fst (attribute))}</span>
            <span>{value}</span>
          </h4>
          <p className="calc-text">
            {fromMaybe (DCA.calc (fst (attribute)))
                       (DCVA.calc (snd (attribute)))}
            {" = "}
            {fromMaybe<string | number> ("\u2013") (base)}
          </p>
          {isJust (mod) || (isJust (mcurrent_add) && !isInCharacterCreation)
            ? (
              <p>
                {isJust (mod)
                  ? (
                    <span className="mod">
                      {translate (staticData)
                                 ("attributes.derivedcharacteristics.tooltips.modifier")}
                      {": "}
                      {sign (fromJust (mod))}
                      <br />
                    </span>
                  )
                : null}
                {isJust (mcurrent_add) && !isInCharacterCreation
                  ? (
                    <span className="add">
                      {translate (staticData)
                                 ("attributes.derivedcharacteristics.tooltips.bought")}
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
                                    || (
                                      id !== "LP"
                                      && or (fmapF (mpermanent_lost)
                                                   (pipe (
                                                     subtractBy (Maybe.sum (mpermanent_redeemed)),
                                                     gt (0)
                                                   )))
                                    )
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
                        || (
                          id !== "LP"
                          && or (fmapF (mpermanent_lost)
                                       (pipe (
                                         subtractBy (Maybe.sum (mpermanent_redeemed)),
                                         gt (0)
                                       )))
                        )
                      }
                      />
                  ))
                  (mcurrent_add)
          : null
      }
    </AttributeBorder>
  )
}
