import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";

export interface MeleeWeapon {
  "@@name": "MeleeWeapon"
  id: string
  name: string
  combatTechnique: string
  primary: List<string>
  primaryBonus: number | Pair<number, number>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: number
  atMod: Maybe<number>
  at: number
  paMod: Maybe<number>
  pa: Maybe<number>
  reach: Maybe<number>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  isImprovisedWeapon: boolean
  isTwoHandedWeapon: boolean
}

export const MeleeWeapon =
  fromDefault ("MeleeWeapon")
              <MeleeWeapon> ({
                id: "",
                name: "",
                combatTechnique: "",
                primary: List.empty,
                primaryBonus: 0,
                damageDiceNumber: Nothing,
                damageDiceSides: Nothing,
                damageFlat: 0,
                atMod: Nothing,
                at: 0,
                paMod: Nothing,
                pa: Nothing,
                reach: Nothing,
                bf: 0,
                loss: Nothing,
                weight: Nothing,
                isImprovisedWeapon: false,
                isTwoHandedWeapon: false,
              })
