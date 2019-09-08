import { fmap } from "../../../Data/Functor";
import { mapMaybe, maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { pipe } from "../pipe";

const ADA = AttributeDependent.A

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe (pipe (lookupF (attributes), fmap (ADA.value)))

export const getAttributeValueWithDefault = maybe (8) (ADA.value)
