import * as React from "react"
import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { equals } from "../../../Data/Eq"
import { find, List } from "../../../Data/List"
import { bindF, ensure, isJust, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { DCId, EnergyId } from "../../Constants/Ids"
import { DerivedCharacteristicValues, EnergyWithLoss } from "../../Models/View/DerivedCharacteristicCombined"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { DCPair } from "../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { AttributesPermanentListItem } from "./AttributesPermanentListItem"

type EWLPair = Pair<Record<DerivedCharacteristic>, Record<EnergyWithLoss>>

export interface AttributesPermanentListProps {
  derived: List<DCPair>
  staticData: StaticDataRecord
  isRemovingEnabled: boolean
  getEditPermanentEnergy: Maybe<EnergyId>
  getAddPermanentEnergy: Maybe<EnergyId>
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
  openAddPermanentEnergyLoss (energy: EnergyId): void
  closeAddPermanentEnergyLoss (): void
  openEditPermanentEnergy (energy: EnergyId): void
  closeEditPermanentEnergy (): void
}

const DCA = DerivedCharacteristic.A
const DCVA = DerivedCharacteristicValues.A

export const AttributesPermanentList: React.FC<AttributesPermanentListProps> = props => {
  const {
    derived,
    staticData,
    isRemovingEnabled,
    getEditPermanentEnergy,
    getAddPermanentEnergy,
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
    openAddPermanentEnergyLoss,
    closeAddPermanentEnergyLoss,
    openEditPermanentEnergy,
    closeEditPermanentEnergy,
  } = props

  const mlp = find<DCPair> (pipe (fst, DCA.id, equals<DerivedCharacteristicId> (DCId.LP)))
                           (derived) as Maybe<EWLPair>

  const mae = find<DCPair> (pipe (fst, DCA.id, equals<DerivedCharacteristicId> (DCId.AE)))
                           (derived) as Maybe<EWLPair>

  const mkp = find<DCPair> (pipe (fst, DCA.id, equals<DerivedCharacteristicId> (DCId.KP)))
                           (derived) as Maybe<EWLPair>

  return (
    <div className="permanent">
      {
        maybe (<></>)
              ((lp: Pair<Record<DerivedCharacteristic>, Record<EnergyWithLoss>>) => (
                <AttributesPermanentListItem
                  staticData={staticData}
                  id={EnergyId.LP}
                  label={translate (staticData) ("attributes.lostpermanently.lifepoints.short")}
                  name={translate (staticData) ("attributes.lostpermanently.lifepoints")}
                  lost={Maybe.sum (DCVA.permanentLost (snd (lp)))}
                  isRemovingEnabled={isRemovingEnabled}
                  getEditPermanentEnergy={getEditPermanentEnergy}
                  getAddPermanentEnergy={getAddPermanentEnergy}
                  addLostPoint={addLostLPPoint}
                  addLostPoints={addLostLPPoints}
                  removeLostPoint={removeLostLPPoint}
                  openAddPermanentEnergyLoss={openAddPermanentEnergyLoss}
                  closeAddPermanentEnergyLoss={closeAddPermanentEnergyLoss}
                  openEditPermanentEnergy={openEditPermanentEnergy}
                  closeEditPermanentEnergy={closeEditPermanentEnergy}
                  />
              ))
              (mlp)
      }
      {pipe_ (
        mae,
        bindF (ensure (ae => isJust (DCVA.value (snd (ae))))),
        maybe (<></>)
              ((ae: Pair<Record<DerivedCharacteristic>, Record<EnergyWithLoss>>) => (
                <AttributesPermanentListItem
                  staticData={staticData}
                  id={EnergyId.AE}
                  label={translate (staticData) ("attributes.lostpermanently.arcaneenergy.short")}
                  name={translate (staticData) ("attributes.lostpermanently.arcaneenergy")}
                  boughtBack={Maybe.sum (DCVA.permanentRedeemed (snd (ae)))}
                  lost={Maybe.sum (DCVA.permanentLost (snd (ae)))}
                  isRemovingEnabled={isRemovingEnabled}
                  getEditPermanentEnergy={getEditPermanentEnergy}
                  getAddPermanentEnergy={getAddPermanentEnergy}
                  addBoughtBackPoint={addBoughtBackAEPoint}
                  addLostPoint={addLostAEPoint}
                  addLostPoints={addLostAEPoints}
                  removeBoughtBackPoint={removeBoughtBackAEPoint}
                  removeLostPoint={removeLostAEPoint}
                  openAddPermanentEnergyLoss={openAddPermanentEnergyLoss}
                  closeAddPermanentEnergyLoss={closeAddPermanentEnergyLoss}
                  openEditPermanentEnergy={openEditPermanentEnergy}
                  closeEditPermanentEnergy={closeEditPermanentEnergy}
                  />
              ))
      )}
      {pipe_ (
        mkp,
        bindF (ensure (kp => isJust (DCVA.value (snd (kp))))),
        maybe (<></>)
              ((kp: Pair<Record<DerivedCharacteristic>, Record<EnergyWithLoss>>) => (
                <AttributesPermanentListItem
                  staticData={staticData}
                  id={EnergyId.KP}
                  label={translate (staticData) ("attributes.lostpermanently.karmapoints.short")}
                  name={translate (staticData) ("attributes.lostpermanently.karmapoints")}
                  boughtBack={Maybe.sum (DCVA.permanentRedeemed (snd (kp)))}
                  lost={Maybe.sum (DCVA.permanentLost (snd (kp)))}
                  isRemovingEnabled={isRemovingEnabled}
                  getEditPermanentEnergy={getEditPermanentEnergy}
                  getAddPermanentEnergy={getAddPermanentEnergy}
                  addBoughtBackPoint={addBoughtBackKPPoint}
                  addLostPoint={addLostKPPoint}
                  addLostPoints={addLostKPPoints}
                  removeBoughtBackPoint={removeBoughtBackKPPoint}
                  removeLostPoint={removeLostKPPoint}
                  openAddPermanentEnergyLoss={openAddPermanentEnergyLoss}
                  closeAddPermanentEnergyLoss={closeAddPermanentEnergyLoss}
                  openEditPermanentEnergy={openEditPermanentEnergy}
                  closeEditPermanentEnergy={closeEditPermanentEnergy}
                  />
              ))
      )}
    </div>
  )
}
