import { StrMap } from "../../../Data/Ley_StrMap.gen"
import { EditHitZoneArmor } from "./EditHitZoneArmor"
import { EditItem } from "./EditItem"
import { HitZoneArmor } from "./HitZoneArmor"
import { Item } from "./Item"
import { Purse } from "./Purse"

export interface Belongings {
  "@@name": "Belongings"
  items: StrMap<Item>
  itemInEditor?: EditItem
  isInItemCreation: boolean
  hitZoneArmors: StrMap<HitZoneArmor>
  hitZoneArmorInEditor?: EditHitZoneArmor
  isInHitZoneArmorCreation: boolean
  purse: Purse
}
