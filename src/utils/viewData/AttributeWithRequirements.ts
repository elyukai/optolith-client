import { AttributeDependent } from "../activeEntries/AttributeDependent";
import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault } from "../structures/Record";
import { Attribute } from "../wikiData/Attribute";
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
