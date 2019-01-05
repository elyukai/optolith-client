import { Maybe, Nothing } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { ArmorZonesEditorInstance } from "../../../types/data";
import { EditItem } from "./EditItem";
import { HitZoneArmor } from "./HitZoneArmor";
import { Item } from "./Item";
import { Purse } from "./Purse";

export interface Belongings {
  items: OrderedMap<string, Record<Item>>
  itemInEditor: Maybe<Record<EditItem>>
  isInItemCreation: boolean
  armorZones: OrderedMap<string, Record<HitZoneArmor>>
  zoneArmorInEditor: Maybe<Record<ArmorZonesEditorInstance>>
  isInZoneArmorCreation: boolean
  purse: Record<Purse>
}

/**
 * Create a new `Belongings` object.
 */
export const Belongings =
  fromDefault<Belongings> ({
    items: OrderedMap.empty,
    itemInEditor: Nothing,
    isInItemCreation: false,
    armorZones: OrderedMap.empty,
    zoneArmorInEditor: Nothing,
    isInZoneArmorCreation: false,
    purse: Purse .default,
  })

export const BelongingsL = makeLenses (Belongings)
