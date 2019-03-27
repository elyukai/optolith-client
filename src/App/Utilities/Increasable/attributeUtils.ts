import { fmap } from "../../../Data/Functor";
import { mapMaybe, maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { pipe } from "../pipe";

const ADA = AttributeDependent.A_

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe (pipe (lookupF (attributes), fmap (ADA.value)))

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

export const getAttributeValueWithDefault = maybe (8) (ADA.value)
