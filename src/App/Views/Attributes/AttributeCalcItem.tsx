import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { bindF, ensure, fromJust, fromMaybe, isJust, liftM2, maybe, Maybe, or } from "../../../Data/Maybe";
import { gt, subtractBy } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { sign, signNeg } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { IconButton } from "../Universal/IconButton";
import { NumberBox } from "../Universal/NumberBox";
import { AttributeBorder } from "./AttributeBorder";

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

export class AttributeCalcItem extends React.Component<AttributeCalcItemProps, {}> {
  addMaxEnergyPoint = () => {
    switch (DCA.id (this.props.attribute)) {
      case "LP":
        this.props.addLifePoint ()
        break

      case "AE":
        this.props.addArcaneEnergyPoint ()
        break

      case "KP":
        this.props.addKarmaPoint ()
        break
    }
  }
  removeMaxEnergyPoint = () => {
    switch (DCA.id (this.props.attribute)) {
      case "LP":
        this.props.removeLifePoint ()
        break

      case "AE":
        this.props.removeArcaneEnergyPoint ()
        break

      case "KP":
        this.props.removeKarmaPoint ()
        break
    }
  }

  // tslint:disable-next-line:cyclomatic-complexity
  render () {
    const {
      attribute: dc,
      l10n: locale,
      isInCharacterCreation,
      isRemovingEnabled,
    } = this.props

    const base = DCA.base (dc)
    const mod = DCA.mod (dc)
    const mcurrent_add = DCA.currentAdd (dc)
    const mmax_add = DCA.maxAdd (dc)
    const has_value = isJust (DCA.value (dc))
    const value = maybe ("\u2013") (signNeg) (DCA.value (dc))
    const mpermanent_lost = DCA.permanentLost (dc)
    const mpermanent_redeemed = DCA.permanentRedeemed (dc)

    return (
      <AttributeBorder
        label={DCA.short (dc)}
        value={value}
        tooltip={(
          <div className="calc-attr-overlay">
            <h4><span>{DCA.name (dc)}</span><span>{value}</span></h4>
            <p className="calc-text">
              {DCA.calc (dc)}
              {" = "}
              {fromMaybe<string | number> ("\u2013") (base)}
            </p>
            {isJust (mod) || isJust (mcurrent_add) && !isInCharacterCreation
              ? (
                <p>
                  {isJust (mod)
                    ? (
                      <span className="mod">
                        {translate (locale) ("modifier")}
                        {": "}
                        {sign (fromJust (mod))}
                        <br/>
                      </span>
                    )
                  : null}
                  {isJust (mcurrent_add) && !isInCharacterCreation
                    ? (
                      <span className="add">
                        {translate (locale) ("bought")}
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
        tooltipMargin={7}>
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
                                    onClick={this.addMaxEnergyPoint}
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
                        onClick={this.removeMaxEnergyPoint}
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
}
