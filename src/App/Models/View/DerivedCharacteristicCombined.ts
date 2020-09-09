import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { isJust, Just, Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record"

type DCId = DerivedCharacteristicId

export interface DerivedCharacteristicValues<I extends DCId = DCId> {
  "@@name": "DerivedCharacteristicValues"
  id: I
  calc: Maybe<string>
  base: Maybe<number>
  value: Maybe<number>
  add: Maybe<number>
  mod: Maybe<number>
  maxAdd: Maybe<number>
  currentAdd: Maybe<number>
  permanentLost: Maybe<number>
  permanentRedeemed: Maybe<number>
}

export interface Energy<I extends DCId = DCId> extends DerivedCharacteristicValues<I> {
  add: Just<number>
  mod: Just<number>
  maxAdd: Just<number>
  currentAdd: Just<number>
  permanentLost: Just<number>
}

export interface EnergyWithLoss<I extends DCId = DCId> extends Energy<I> {
  permanentRedeemed: Just<number>
}

interface DerivedCharacteristicCreator extends RecordCreator<DerivedCharacteristicValues> {
  <I extends DCId = DCId>
  (x: OmitName<EnergyWithLoss<I>>): Record<EnergyWithLoss<I>>

  <I extends DCId = DCId>
  (x: OmitName<Energy<I>>): Record<Energy<I>>

  <I extends DCId = DCId>
  (x: OmitName<PartialMaybeOrNothing<DerivedCharacteristicValues<I>>>):
  Record<DerivedCharacteristicValues<I>>
}

export const DerivedCharacteristicValues =
  fromDefault ("DerivedCharacteristicValues")
              <DerivedCharacteristicValues> ({
                id: "LP",
                calc: Nothing,
                base: Nothing,
                value: Nothing,
                add: Nothing,
                mod: Nothing,
                maxAdd: Nothing,
                currentAdd: Nothing,
                permanentLost: Nothing,
                permanentRedeemed: Nothing,
              }) as DerivedCharacteristicCreator

export const isDerivedCharacteristicEnergy =
  <I extends DCId = DCId> (x: Record<DerivedCharacteristicValues<I>>):
    x is Record<Energy<I>> =>
    isJust (DerivedCharacteristicValues.A.add (x))
    && isJust (DerivedCharacteristicValues.A.mod (x))
    && isJust (DerivedCharacteristicValues.A.maxAdd (x))
    && isJust (DerivedCharacteristicValues.A.currentAdd (x))
    && isJust (DerivedCharacteristicValues.A.permanentLost (x))

export const isDerivedCharacteristicEnergyWithLoss =
  <I extends DCId = DCId> (x: Record<DerivedCharacteristicValues<I>>):
    x is Record<EnergyWithLoss<I>> =>
    isJust (DerivedCharacteristicValues.A.add (x))
    && isJust (DerivedCharacteristicValues.A.mod (x))
    && isJust (DerivedCharacteristicValues.A.maxAdd (x))
    && isJust (DerivedCharacteristicValues.A.currentAdd (x))
    && isJust (DerivedCharacteristicValues.A.permanentLost (x))
    && isJust (DerivedCharacteristicValues.A.permanentRedeemed (x))
