import { Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { EditHitZoneArmor } from "./EditHitZoneArmor";
import { EditItem } from "./EditItem";
import { HitZoneArmor } from "./HitZoneArmor";
import { Item } from "./Item";
import { Purse } from "./Purse";

export interface Belongings {
  "@@name": "Belongings"
  items: OrderedMap<string, Record<Item>>
  itemInEditor: Maybe<Record<EditItem>>
  isInItemCreation: boolean
  hitZoneArmors: OrderedMap<string, Record<HitZoneArmor>>
  hitZoneArmorInEditor: Maybe<Record<EditHitZoneArmor>>
  isInHitZoneArmorCreation: boolean
  purse: Record<Purse>
}

/**
 * Create a new `Belongings` object.
 */
export const Belongings =
  fromDefault ("Belongings")
              <Belongings> ({
                items: OrderedMap.empty,
                itemInEditor: Nothing,
                isInItemCreation: false,
                hitZoneArmors: OrderedMap.empty,
                hitZoneArmorInEditor: Nothing,
                isInHitZoneArmorCreation: false,
                purse: Purse .default,
              })

export const BelongingsL = makeLenses (Belongings)
