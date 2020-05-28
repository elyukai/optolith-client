import { List } from "../../../Data/List"

export interface ShieldOrParryingWeapon {
  id: string
  name: string
  stp?: number | List<number>
  bf: number
  loss?: number
  atMod?: number
  paMod?: number
  weight?: number
}
