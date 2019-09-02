import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface ShieldOrParryingWeapon {
  "@@name": "ShieldOrParryingWeapon"
  id: string
  name: string
  stp: Maybe<string>
  bf: number
  loss: Maybe<number>
  atMod: Maybe<number>
  paMod: Maybe<number>
  weight: Maybe<number>
}

export const ShieldOrParryingWeapon =
  fromDefault ("ShieldOrParryingWeapon")
              <ShieldOrParryingWeapon> ({
                id: "",
                name: "",
                stp: Nothing,
                bf: 0,
                loss: Nothing,
                atMod: Nothing,
                paMod: Nothing,
                weight: Nothing,
              })
