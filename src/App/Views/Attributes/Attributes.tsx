import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AttributeWithRequirements } from "../../Models/View/AttributeWithRequirements";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { AttributeCalc } from "./AttributeCalc";
import { AttributeList } from "./AttributeList";
import { AttributesAdjustment } from "./AttributesAdjustment";
import { AttributesPermanentList } from "./AttributesPermanentList";

export interface AttributesOwnProps {
  l10n: L10nRecord
}

export interface AttributesStateProps {
  attributes: Maybe<List<Record<AttributeWithRequirements>>>
  derived: List<Record<DerivedCharacteristic>>
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  maxTotalAttributeValues: Maybe<number>
  sum: number
  adjustmentValue: Maybe<number>
  availableAttributeIds: Maybe<List<string>>
  currentAttributeId: Maybe<string>
  getEditPermanentEnergy: Maybe<"LP" | "AE" | "KP">
  getAddPermanentEnergy: Maybe<"LP" | "AE" | "KP">
}

export interface AttributesDispatchProps {
  addPoint (id: string): void
  removePoint (id: string): void
  addLifePoint (): void
  addArcaneEnergyPoint (): void
  addKarmaPoint (): void
  removeLifePoint (): void
  removeArcaneEnergyPoint (): void
  removeKarmaPoint (): void
  addLostLPPoint (): void
  removeLostLPPoint (): void
  addLostLPPoints (value: number): void
  addBoughtBackAEPoint (): void
  removeBoughtBackAEPoint (): void
  addLostAEPoint (): void
  removeLostAEPoint (): void
  addLostAEPoints (value: number): void
  addBoughtBackKPPoint (): void
  removeBoughtBackKPPoint (): void
  addLostKPPoint (): void
  removeLostKPPoint (): void
  addLostKPPoints (value: number): void
  setAdjustmentId (id: Maybe<string>): void
  openAddPermanentEnergyLoss (energy: "LP" | "AE" | "KP"): void
  closeAddPermanentEnergyLoss (): void
  openEditPermanentEnergy (energy: "LP" | "AE" | "KP"): void
  closeEditPermanentEnergy (): void
}

export type AttributesProps = AttributesStateProps & AttributesDispatchProps & AttributesOwnProps

export function Attributes (props: AttributesProps) {
  const { l10n: l10n, isInCharacterCreation, maxTotalAttributeValues, sum } = props

  return (
    <Page id="attribute">
      <Scroll>
        <div className="counter">
          {translate (l10n) ("attributetotal")}
          {": "}
          {sum}
          {isInCharacterCreation ? ` / ${Maybe.sum (maxTotalAttributeValues)}` : ""}
        </div>
        <AttributeList {...props} />
        <div className="secondary">
          {isInCharacterCreation && <AttributesAdjustment {...props} />}
          <AttributeCalc {...props} l10n={l10n} />
          <AttributesPermanentList {...props} locale={l10n} />
        </div>
      </Scroll>
    </Page>
  )
}
