import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bindF, ensure, isJust, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { DerivedCharacteristic, EnergyWithLoss } from "../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { DCIds, EnergyIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { AttributesPermanentListItem } from "./AttributesPermanentListItem";

export interface AttributesPermanentListProps {
  derived: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  getEditPermanentEnergy: Maybe<EnergyIds>
  getAddPermanentEnergy: Maybe<EnergyIds>
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
  openAddPermanentEnergyLoss (energy: EnergyIds): void
  closeAddPermanentEnergyLoss (): void
  openEditPermanentEnergy (energy: EnergyIds): void
  closeEditPermanentEnergy (): void
}

const DCA = DerivedCharacteristic.A

export function AttributesPermanentList (props: AttributesPermanentListProps) {
  const mlp = find (pipe (DCA.id, equals<DCIds> ("LP")))
                   (props.derived) as Maybe<Record<EnergyWithLoss>>

  const mae = find (pipe (DCA.id, equals<DCIds> ("AE")))
                   (props.derived) as Maybe<Record<EnergyWithLoss>>

  const mkp = find (pipe (DCA.id, equals<DCIds> ("KP")))
                   (props.derived) as Maybe<Record<EnergyWithLoss>>

  return (
    <div className="permanent">
      {
        maybe (<></>)
              ((lp: Record<EnergyWithLoss>) => (
                <AttributesPermanentListItem
                  {...props}
                  id="LP"
                  label={translate (props.l10n) ("lifepointslostpermanently.short")}
                  name={translate (props.l10n) ("lifepointslostpermanently")}
                  lost={Maybe.sum (DCA.permanentLost (lp))}
                  addLostPoint={props.addLostLPPoint}
                  addLostPoints={props.addLostLPPoints}
                  removeLostPoint={props.removeLostLPPoint}
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
                  {...props}
                  id="AE"
                  label={translate (props.l10n) ("arcaneenergylostpermanently.short")}
                  name={translate (props.l10n) ("arcaneenergylostpermanently")}
                  boughtBack={Maybe.sum (DCA.permanentRedeemed (ae))}
                  lost={Maybe.sum (DCA.permanentLost (ae))}
                  addBoughtBackPoint={props.addBoughtBackAEPoint}
                  addLostPoint={props.addLostAEPoint}
                  addLostPoints={props.addLostAEPoints}
                  removeBoughtBackPoint={props.removeBoughtBackAEPoint}
                  removeLostPoint={props.removeLostAEPoint}
                  />
              ))
      )}
      {pipe_ (
        mkp,
        bindF (ensure (kp => isJust (DCA.value (kp)))),
        maybe (<></>)
              ((kp: Record<EnergyWithLoss>) => (
                <AttributesPermanentListItem
                  {...props}
                  id="KP"
                  label={translate (props.l10n) ("karmapointslostpermanently.short")}
                  name={translate (props.l10n) ("karmapointslostpermanently")}
                  boughtBack={Maybe.sum (DCA.permanentRedeemed (kp))}
                  lost={Maybe.sum (DCA.permanentLost (kp))}
                  addBoughtBackPoint={props.addBoughtBackKPPoint}
                  addLostPoint={props.addLostKPPoint}
                  addLostPoints={props.addLostKPPoints}
                  removeBoughtBackPoint={props.removeBoughtBackKPPoint}
                  removeLostPoint={props.removeLostKPPoint}
                  />
              ))
      )}
    </div>
  )
}
