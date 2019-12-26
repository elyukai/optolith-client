import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bindF, ensure, isJust, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { DCId, EnergyId } from "../../Constants/Ids";
import { DerivedCharacteristic, EnergyWithLoss } from "../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { AttributesPermanentListItem } from "./AttributesPermanentListItem";

export interface AttributesPermanentListProps {
  derived: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
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

export const AttributesPermanentList: React.FC<AttributesPermanentListProps> = props => {
  const {
    derived,
    l10n,
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

  const mlp = find (pipe (DCA.id, equals<DCId> (DCId.LP)))
                   (derived) as Maybe<Record<EnergyWithLoss>>

  const mae = find (pipe (DCA.id, equals<DCId> (DCId.AE)))
                   (derived) as Maybe<Record<EnergyWithLoss>>

  const mkp = find (pipe (DCA.id, equals<DCId> (DCId.KP)))
                   (derived) as Maybe<Record<EnergyWithLoss>>

  return (
    <div className="permanent">
      {
        maybe (<></>)
              ((lp: Record<EnergyWithLoss>) => (
                <AttributesPermanentListItem
                  l10n={l10n}
                  id={EnergyId.LP}
                  label={translate (l10n) ("lifepointslostpermanently.short")}
                  name={translate (l10n) ("lifepointslostpermanently")}
                  lost={Maybe.sum (DCA.permanentLost (lp))}
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
        bindF (ensure (ae => isJust (DCA.value (ae)))),
        maybe (<></>)
              ((ae: Record<EnergyWithLoss>) => (
                <AttributesPermanentListItem
                  l10n={l10n}
                  id={EnergyId.AE}
                  label={translate (l10n) ("arcaneenergylostpermanently.short")}
                  name={translate (l10n) ("arcaneenergylostpermanently")}
                  boughtBack={Maybe.sum (DCA.permanentRedeemed (ae))}
                  lost={Maybe.sum (DCA.permanentLost (ae))}
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
        bindF (ensure (kp => isJust (DCA.value (kp)))),
        maybe (<></>)
              ((kp: Record<EnergyWithLoss>) => (
                <AttributesPermanentListItem
                  l10n={l10n}
                  id={EnergyId.KP}
                  label={translate (l10n) ("karmapointslostpermanently.short")}
                  name={translate (l10n) ("karmapointslostpermanently")}
                  boughtBack={Maybe.sum (DCA.permanentRedeemed (kp))}
                  lost={Maybe.sum (DCA.permanentLost (kp))}
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
