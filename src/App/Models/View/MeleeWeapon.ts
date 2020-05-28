import { List } from "../../../Data/List"
import { Pair } from "../../../Data/Tuple"

export interface MeleeWeapon {
  id: number
  name: string
  combatTechnique: string
  primary: List<string>
  primaryBonus: number | Pair<number, number>
  damageDiceNumber?: number
  damageDiceSides?: number
  damageFlat: number
  atMod?: number
  at: number
  paMod?: number
  pa?: number
  reach?: number
  bf: number
  loss?: number
  weight?: number
  isImprovisedWeapon: boolean
  isTwoHandedWeapon: boolean
}
