import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault } from "../../../Data/Record"
import { Range } from "../Hero/Item"

export interface RangedWeapon {
  "@@name": "RangedWeapon"
  id: string
  name: string
  combatTechnique: string
  reloadTime: Maybe<number | List<number>>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: Maybe<number>
  at: number
  range: Maybe<Range>
  bf: number
  loss: Maybe<number>
  weight: Maybe<number>
  ammunition: Maybe<string>
  isImprovisedWeapon: boolean
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
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
                isImprovisedWeapon: false,
              })
