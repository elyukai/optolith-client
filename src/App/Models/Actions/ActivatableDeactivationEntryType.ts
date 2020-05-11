import { V } from "../../Utilities/Variant"
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { Advantage } from "../Wiki/Advantage"
import { Disadvantage } from "../Wiki/Disadvantage"

export interface ActivatableDeactivationEntryType {
  isBlessed: boolean
  isMagical: boolean
  isDisadvantage: boolean
  hairColor?: number
  eyeColor?: number
  heroEntry: ActivatableDependent
  wikiEntry: V<"Advantage", Advantage> | V<"Disadvantage", Disadvantage>
}
