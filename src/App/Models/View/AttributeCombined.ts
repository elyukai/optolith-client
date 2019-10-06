import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { AttributeDependent } from "../ActiveEntries/AttributeDependent";
import { Attribute } from "../Wiki/Attribute";

export interface AttributeCombined {
  "@@name": "AttributeCombined"
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
}

export const AttributeCombined =
  fromDefault ("AttributeCombined")
              <AttributeCombined> ({
                wikiEntry: Attribute .default,
                stateEntry: AttributeDependent .default,
              })

export const AttributeCombinedA_ = {
  id: pipe (AttributeCombined.A.wikiEntry, Attribute.A.id),
  short: pipe (AttributeCombined.A.wikiEntry, Attribute.A.short),
  value: pipe (AttributeCombined.A.stateEntry, AttributeDependent.A.value),
}

export const newAttributeCombined =
  (wiki_entry: Record<Attribute>) => (hero_entry: Record<AttributeDependent>) =>
    AttributeCombined ({
      wikiEntry: wiki_entry,
      stateEntry: hero_entry,
    })
