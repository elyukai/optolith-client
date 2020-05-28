import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { V } from "../../Utilities/Variant"
import { ActivatableMultiEntryPrerequisite, ActivatableMultiSelectPrerequisite, ActivatablePrerequisite } from "../Wiki/prerequisites/ActivatableRequirement"
import { IncreasableMultiEntryPrerequisite, IncreasablePrerequisite } from "../Wiki/prerequisites/IncreasableRequirement"
import { PrimaryAttributePrerequisite } from "../Wiki/prerequisites/PrimaryAttributeRequirement"
import { RaceRequirement } from "../Wiki/prerequisites/RaceRequirement"
import { SocialPrerequisite } from "../Wiki/prerequisites/SocialPrerequisite"

/**
 * Note: Not the same as `ActivatablePrerequisiteText`!
 */
export type ActivatableStringObject = {
  id: string
  active: boolean
  value: string
}

export type ReplacedIncreasablePrerequisite =
  | V<"IncreasablePrerequisite", IncreasablePrerequisite>
  | V<"IncreasableMultiEntryPrerequisite", IncreasableMultiEntryPrerequisite>
  | V<"String", string>

export type ReplacedPrimaryAttributePrerequisite =
  | V<"ActivatablePrerequisite", PrimaryAttributePrerequisite>
  | V<"String", string>

export type ActivatablePrerequisiteObjects =
  | V<"ActivatablePrerequisite", ActivatablePrerequisite>
  | V<"ActivatableMultiEntryPrerequisite", ActivatableMultiEntryPrerequisite>
  | V<"ActivatableMultiSelectPrerequisite", ActivatableMultiSelectPrerequisite>
  | V<"ActivatableStringObject", ActivatableStringObject>

export type PrimaryAttributePrerequisiteObjects =
  | V<"PrimaryAttributePrerequisite", PrimaryAttributePrerequisite>
  | V<"String", string>

export type IncreasablePrerequisiteObjects =
  | V<"IncreasablePrerequisite", IncreasablePrerequisite>
  | V<"String", string>

export type RacePrerequisiteObjects =
  | V<"RaceRequirement", RaceRequirement>
  | V<"String", string>

export type SocialPrerequisiteObjects =
  | V<"SocialPrerequisite", SocialPrerequisite>
  | V<"String", string>

export type RCPPrerequisiteObjects =
  | V<"boolean", boolean>
  | V<"String", string>

export interface CategorizedPrerequisites {
  rcp: RCPPrerequisiteObjects
  casterBlessedOne: List<ActivatablePrerequisiteObjects>
  traditions: List<ActivatablePrerequisiteObjects>
  attributes: List<ReplacedIncreasablePrerequisite>
  primaryAttribute: Maybe<ReplacedPrimaryAttributePrerequisite>
  skills: List<ReplacedIncreasablePrerequisite>
  activeSkills: List<ActivatablePrerequisiteObjects>
  otherActiveSpecialAbilities: List<ActivatablePrerequisiteObjects>
  inactiveSpecialAbilities: List<ActivatablePrerequisiteObjects>
  otherActiveAdvantages: List<ActivatablePrerequisiteObjects>
  inactiveAdvantages: List<ActivatablePrerequisiteObjects>
  activeDisadvantages: List<ActivatablePrerequisiteObjects>
  inactiveDisadvantages: List<ActivatablePrerequisiteObjects>
  race: Maybe<RacePrerequisiteObjects>
  social: Maybe<SocialPrerequisiteObjects>
}
