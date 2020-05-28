import { AttributeDependent } from "../ActiveEntries/AttributeDependent"
import { Attribute } from "../Wiki/Attribute"

export interface AttributeWithRequirements {
  wikiEntry: Attribute
  stateEntry: AttributeDependent
  max?: number
  min: number
}
