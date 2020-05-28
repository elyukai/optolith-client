import { isJust } from "../../../Data/Maybe"
import { DerivedCharacteristicId } from "../../Utilities/YAML/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"

type DCId = DerivedCharacteristicId

export interface DerivedCharacteristicValues<I extends DCId = DCId> {
  id: I
  calc?: string
  base?: number
  value?: number
  add?: number
  mod?: number
  maxAdd?: number
  currentAdd?: number
  permanentLost?: number
  permanentRedeemed?: number
}

export interface Energy<I extends DCId = DCId> extends DerivedCharacteristicValues<I> {
  add: number
  mod: number
  maxAdd: number
  currentAdd: number
  permanentLost: number
}

export interface EnergyWithLoss<I extends DCId = DCId> extends Energy<I> {
  permanentRedeemed: number
}

export const isDerivedCharacteristicEnergy =
  <I extends DCId = DCId> (x: DerivedCharacteristicValues<I>):
    x is Energy<I> =>
    isJust (x.add)
    && isJust (x.mod)
    && isJust (x.maxAdd)
    && isJust (x.currentAdd)
    && isJust (x.permanentLost)

export const isDerivedCharacteristicEnergyWithLoss =
  <I extends DCId = DCId> (x: DerivedCharacteristicValues<I>):
    x is EnergyWithLoss<I> =>
    isJust (x.add)
    && isJust (x.mod)
    && isJust (x.maxAdd)
    && isJust (x.currentAdd)
    && isJust (x.permanentLost)
    && isJust (x.permanentRedeemed)
