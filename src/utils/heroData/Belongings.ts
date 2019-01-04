import { ArmorZonesEditorInstance } from "../../types/data";
import { Maybe, Nothing } from "../structures/Maybe";
import { OrderedMap } from "../structures/OrderedMap";
import { fromDefault, makeLenses, Record } from "../structures/Record";
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
