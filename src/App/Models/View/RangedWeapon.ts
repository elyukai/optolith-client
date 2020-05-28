import { List } from "../../../Data/List"

export interface RangedWeapon {
  id: string
  name: string
  combatTechnique: string
  reloadTime?: number | List<number>
  damageDiceNumber?: number
  damageDiceSides?: number
  damageFlat?: number
  at: number
  range?: List<number>
  bf: number
  loss?: number
  weight?: number
  ammunition?: string
}
