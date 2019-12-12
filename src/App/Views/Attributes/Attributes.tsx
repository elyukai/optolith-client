import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { EnergyId } from "../../Constants/Ids";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
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
  hero: HeroModelRecord
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
  getEditPermanentEnergy: Maybe<EnergyId>
  getAddPermanentEnergy: Maybe<EnergyId>
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
  openAddPermanentEnergyLoss (energy: EnergyId): void
  closeAddPermanentEnergyLoss (): void
  openEditPermanentEnergy (energy: EnergyId): void
  closeEditPermanentEnergy (): void
}

export type AttributesProps = AttributesStateProps & AttributesDispatchProps & AttributesOwnProps

export function Attributes (props: AttributesProps) {
  const {
    l10n,
    attributes,
    derived,
    isInCharacterCreation,
    isRemovingEnabled,
    maxTotalAttributeValues,
    sum,
    adjustmentValue,
    availableAttributeIds,
    currentAttributeId,
    getEditPermanentEnergy,
    getAddPermanentEnergy,
    addPoint,
    removePoint,
    addLifePoint,
    addArcaneEnergyPoint,
    addKarmaPoint,
    removeLifePoint,
    removeArcaneEnergyPoint,
    removeKarmaPoint,
    addLostLPPoint,
    removeLostLPPoint,
    addLostLPPoints,
    addBoughtBackAEPoint,
    removeBoughtBackAEPoint,
    addLostAEPoint,
    removeLostAEPoint,
    addLostAEPoints,
    addBoughtBackKPPoint,
    removeBoughtBackKPPoint,
    addLostKPPoint,
    removeLostKPPoint,
    addLostKPPoints,
    setAdjustmentId,
    openAddPermanentEnergyLoss,
    closeAddPermanentEnergyLoss,
    openEditPermanentEnergy,
    closeEditPermanentEnergy,
  } = props

  return (
    <Page id="attribute">
      <Scroll>
        <div className="counter">
          {translate (l10n) ("attributetotal")}
          {": "}
          {sum}
          {isInCharacterCreation ? ` / ${Maybe.sum (maxTotalAttributeValues)}` : ""}
        </div>
        <AttributeList
          attributes={attributes}
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
          maxTotalAttributeValues={maxTotalAttributeValues}
          sum={sum}
          addPoint={addPoint}
          removePoint={removePoint}
          />
        <div className="secondary">
          {isInCharacterCreation
            ? (
              <AttributesAdjustment
                adjustmentValue={adjustmentValue}
                attributes={attributes}
                availableAttributeIds={availableAttributeIds}
                currentAttributeId={currentAttributeId}
                l10n={l10n}
                setAdjustmentId={setAdjustmentId}
                />
            )
            : null}
          <AttributeCalc
            derived={derived}
            l10n={l10n}
            isInCharacterCreation={isInCharacterCreation}
            isRemovingEnabled={isRemovingEnabled}
            addLifePoint={addLifePoint}
            addArcaneEnergyPoint={addArcaneEnergyPoint}
            addKarmaPoint={addKarmaPoint}
            removeLifePoint={removeLifePoint}
            removeArcaneEnergyPoint={removeArcaneEnergyPoint}
            removeKarmaPoint={removeKarmaPoint}
            />
          <AttributesPermanentList
            derived={derived}
            l10n={l10n}
            isInCharacterCreation={isInCharacterCreation}
            isRemovingEnabled={isRemovingEnabled}
            getEditPermanentEnergy={getEditPermanentEnergy}
            getAddPermanentEnergy={getAddPermanentEnergy}
            addLostLPPoint={addLostLPPoint}
            removeLostLPPoint={removeLostLPPoint}
            addLostLPPoints={addLostLPPoints}
            addBoughtBackAEPoint={addBoughtBackAEPoint}
            removeBoughtBackAEPoint={removeBoughtBackAEPoint}
            addLostAEPoint={addLostAEPoint}
            removeLostAEPoint={removeLostAEPoint}
            addLostAEPoints={addLostAEPoints}
            addBoughtBackKPPoint={addBoughtBackKPPoint}
            removeBoughtBackKPPoint={removeBoughtBackKPPoint}
            addLostKPPoint={addLostKPPoint}
            removeLostKPPoint={removeLostKPPoint}
            addLostKPPoints={addLostKPPoints}
            openAddPermanentEnergyLoss={openAddPermanentEnergyLoss}
            closeAddPermanentEnergyLoss={closeAddPermanentEnergyLoss}
            openEditPermanentEnergy={openEditPermanentEnergy}
            closeEditPermanentEnergy={closeEditPermanentEnergy}
            />
        </div>
      </Scroll>
    </Page>
  )
}
