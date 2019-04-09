import { fmap } from "../../../Data/Functor";
import { mapMaybe, maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { prefixAttr } from "../IDUtils";
import { pipe } from "../pipe";

const ADA = AttributeDependent.A

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe (pipe (lookupF (attributes), fmap (ADA.value)))

export const convertId = <T extends string | undefined> (id: T): T => {
  switch (id) {
    case "COU": return prefixAttr (1) as T
    case "SGC": return prefixAttr (2) as T
    case "INT": return prefixAttr (3) as T
    case "CHA": return prefixAttr (4) as T
    case "DEX": return prefixAttr (5) as T
    case "AGI": return prefixAttr (6) as T
    case "CON": return prefixAttr (7) as T
    case "STR": return prefixAttr (8) as T
    default: return id
  }
}

export const getAttributeValueWithDefault = maybe (8) (ADA.value)
