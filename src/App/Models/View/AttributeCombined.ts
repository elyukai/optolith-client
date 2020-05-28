import { AttributeDependent } from "../ActiveEntries/AttributeDependent"
import { Attribute } from "../Wiki/Attribute"

export interface AttributeCombined {
  wikiEntry: Attribute
  stateEntry: AttributeDependent
}

export const newAttributeCombined =
  (wiki_entry: Attribute) => (hero_entry: AttributeDependent): AttributeCombined =>
    ({
      wikiEntry: wiki_entry,
      stateEntry: hero_entry,
    })
