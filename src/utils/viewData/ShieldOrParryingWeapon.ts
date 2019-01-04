import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault } from "../structures/Record";

export interface ShieldOrParryingWeapon {
  id: string
  name: string
  stp: Maybe<number>
  bf: number
  loss: Maybe<number>
  atMod: Maybe<number>
  paMod: Maybe<number>
  weight: Maybe<number>
}

const ShieldOrParryingWeapon =
  fromDefault<ShieldOrParryingWeapon> ({
    id: "",
    name: "",
    stp: Nothing,
    bf: 0,
    loss: Nothing,
    atMod: Nothing,
    paMod: Nothing,
    weight: Nothing,
  })
