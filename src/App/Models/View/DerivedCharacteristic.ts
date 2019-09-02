import { isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, OmitName, PartialMaybeOrNothing, Record, RecordCreator } from "../../../Data/Record";
import { DCId } from "../../Constants/Ids";

export interface DerivedCharacteristic<I extends DCId = DCId> {
  "@@name": "DerivedCharacteristic"
  id: I
  short: string
  name: string
  calc: string
  base: Maybe<number>
  value: Maybe<number>
  add: Maybe<number>
  mod: Maybe<number>
  maxAdd: Maybe<number>
  currentAdd: Maybe<number>
  permanentLost: Maybe<number>
  permanentRedeemed: Maybe<number>
}

export interface Energy<I extends DCId = DCId> extends DerivedCharacteristic<I> {
  add: Just<number>
  mod: Just<number>
  maxAdd: Just<number>
  currentAdd: Just<number>
  permanentLost: Just<number>
}

export interface EnergyWithLoss<I extends DCId = DCId> extends Energy<I> {
  permanentRedeemed: Just<number>
}

interface DerivedCharacteristicCreator extends RecordCreator<DerivedCharacteristic> {
  <I extends DCId = DCId>
  (x: OmitName<EnergyWithLoss<I>>): Record<EnergyWithLoss<I>>

  <I extends DCId = DCId>
  (x: OmitName<Energy<I>>): Record<Energy<I>>

  <I extends DCId = DCId>
  (x: OmitName<PartialMaybeOrNothing<DerivedCharacteristic<I>>>):
  Record<DerivedCharacteristic<I>>
}

export const DerivedCharacteristic =
  fromDefault ("DerivedCharacteristic")
              <DerivedCharacteristic> ({
                id: DCId.LP,
                short: "",
                name: "",
                calc: "",
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
  <I extends DCId = DCId> (x: Record<DerivedCharacteristic<I>>): x is Record<Energy<I>> =>
    isJust (DerivedCharacteristic.A.add (x))
    && isJust (DerivedCharacteristic.A.mod (x))
    && isJust (DerivedCharacteristic.A.maxAdd (x))
    && isJust (DerivedCharacteristic.A.currentAdd (x))
    && isJust (DerivedCharacteristic.A.permanentLost (x))

export const isDerivedCharacteristicEnergyWithLoss =
  <I extends DCId = DCId> (x: Record<DerivedCharacteristic<I>>): x is Record<EnergyWithLoss<I>> =>
    isJust (DerivedCharacteristic.A.add (x))
    && isJust (DerivedCharacteristic.A.mod (x))
    && isJust (DerivedCharacteristic.A.maxAdd (x))
    && isJust (DerivedCharacteristic.A.currentAdd (x))
    && isJust (DerivedCharacteristic.A.permanentLost (x))
    && isJust (DerivedCharacteristic.A.permanentRedeemed (x))
