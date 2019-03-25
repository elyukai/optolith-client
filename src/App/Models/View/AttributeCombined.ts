import { fromDefault, Record } from "../../../Data/Record";
import { AttributeDependent } from "../ActiveEntries/AttributeDependent";
import { Attribute } from "../Wiki/Attribute";

export interface AttributeCombined {
  wikiEntry: Record<Attribute>
  stateEntry: Record<AttributeDependent>
}

export const AttributeCombined =
  fromDefault<AttributeCombined> ({
    wikiEntry: Attribute .default,
    stateEntry: AttributeDependent .default,
  })

export const newAttributeCombined =
  (wiki_entry: Record<Attribute>) => (hero_entry: Record<AttributeDependent>) =>
    AttributeCombined ({
      wikiEntry: wiki_entry,
      stateEntry: hero_entry,
    })
