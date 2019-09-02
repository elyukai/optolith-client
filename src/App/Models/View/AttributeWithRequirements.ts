import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { AttributeDependent } from "../ActiveEntries/AttributeDependent";
import { Attribute } from "../Wiki/Attribute";

export interface AttributeWithRequirements {
  "@@name": "AttributeWithRequirements"
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
  max: Maybe<number>
  min: number
}

export const AttributeWithRequirements =
  fromDefault ("AttributeWithRequirements")
              <AttributeWithRequirements> ({
                wikiEntry: Attribute .default,
                stateEntry: AttributeDependent .default,
                max: Nothing,
                min: 0,
              })

export const AttributeWithRequirementsA_ = {
  id: pipe (AttributeWithRequirements.A.wikiEntry, Attribute.A.id),
  short: pipe (AttributeWithRequirements.A.wikiEntry, Attribute.A.short),
  name: pipe (AttributeWithRequirements.A.wikiEntry, Attribute.A.name),
  value: pipe (AttributeWithRequirements.A.stateEntry, AttributeDependent.A.value),
}
