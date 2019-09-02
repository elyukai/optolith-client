import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";

export interface RangedWeapon {
  "@@name": "RangedWeapon"
  id: string
  name: string
  combatTechnique: string
  reloadTime: Maybe<string>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: Maybe<number>
  at: number
  range: Maybe<List<number>>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  ammunition: Maybe<string>
}

export const RangedWeapon =
  fromDefault ("RangedWeapon")
              <RangedWeapon> ({
                id: "",
                name: "",
                combatTechnique: "",
                reloadTime: Nothing,
                damageDiceNumber: Nothing,
                damageDiceSides: Nothing,
                damageFlat: Nothing,
                at: 0,
                range: Nothing,
                bf: 0,
                loss: Nothing,
                weight: Nothing,
                ammunition: Nothing,
              })
