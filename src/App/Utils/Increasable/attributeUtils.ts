import { pipe } from "ramda";
import { fmap, mapMaybe, maybe } from "../../../Data/Maybe";
import { lookup_, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";

const { value } = AttributeDependent.A

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe (pipe (lookup_ (attributes), fmap (value)))

export const convertId = <T extends string | undefined> (id: T): T => {
  switch (id) {
    case "COU": return "ATTR_1" as T
    case "SGC": return "ATTR_2" as T
    case "INT": return "ATTR_3" as T
    case "CHA": return "ATTR_4" as T
    case "DEX": return "ATTR_5" as T
    case "AGI": return "ATTR_6" as T
    case "CON": return "ATTR_7" as T
    case "STR": return "ATTR_8" as T
    default: return id
  }
}

export const getAttributeValueWithDefault = maybe<Record<AttributeDependent>, number> (8) (value)
