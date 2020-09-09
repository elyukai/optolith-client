import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"

export interface DerivedCharacteristic {
  "@@name": "DerivedCharacteristic"
  id: DerivedCharacteristicId
  name: string
  short: string
  calc: string
  calcHalfPrimary: Maybe<string>
  calcNoPrimary: Maybe<string>
}

export const DerivedCharacteristic =
  fromDefault ("DerivedCharacteristic")
              <DerivedCharacteristic> ({
                id: "LP",
                name: "",
                short: "",
                calc: "",
                calcHalfPrimary: Nothing,
                calcNoPrimary: Nothing,
              })
