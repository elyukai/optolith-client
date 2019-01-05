import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { AttributeDependent } from "../ActiveEntries/AttributeDependent";
import { Attribute } from "../Wiki/Attribute";
import { AttributeCombined } from "./AttributeCombined";

export interface AttributeWithRequirements extends AttributeCombined {
  max: Maybe<number>
  min: number
}

export const AttributeWithRequirements =
  fromDefault<AttributeWithRequirements> ({
    wikiEntry: Attribute .default,
    stateEntry: AttributeDependent .default,
    max: Nothing,
    min: 0,
  })
