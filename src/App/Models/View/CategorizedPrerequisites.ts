import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record, RecordIBase } from "../../../Data/Record"
import { RequireActivatable } from "../Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement"
import { RequirePrimaryAttribute } from "../Wiki/prerequisites/PrimaryAttributeRequirement"
import { RaceRequirement } from "../Wiki/prerequisites/RaceRequirement"
import { SocialPrerequisite } from "../Wiki/prerequisites/SocialPrerequisite"

/**
 * Note: Not the same as `ActivatablePrerequisiteText`!
 */
export interface ActivatableStringObject {
  id: string
  active: boolean
  value: string
}

export type ReplacedPrerequisite<T extends RecordIBase<any> = RequireActivatable> = Record<T>
                                                                                  | string

export type ActivatablePrerequisiteObjects = Record<RequireActivatable>
                                           | ActivatableStringObject

export type PrimaryAttributePrerequisiteObjects = Record<RequirePrimaryAttribute>
                                                | string

export type IncreasablePrerequisiteObjects = Record<RequireIncreasable>
                                           | string

export type RacePrerequisiteObjects = Record<RaceRequirement>
                                    | string

export type SocialPrerequisiteObjects = Record<SocialPrerequisite>
                                      | string

export type RCPPrerequisiteObjects = boolean
                                   | string

export interface CategorizedPrerequisites {
  "@@name": "CategorizedPrerequisites"
  rcp: RCPPrerequisiteObjects
  casterBlessedOne: List<ActivatablePrerequisiteObjects>
  traditions: List<ActivatablePrerequisiteObjects>
  attributes: List<ReplacedPrerequisite<RequireIncreasable>>
  primaryAttribute: Maybe<ReplacedPrerequisite<RequirePrimaryAttribute>>
  skills: List<ReplacedPrerequisite<RequireIncreasable>>
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CategorizedPrerequisites =
  fromDefault ("CategorizedPrerequisites")
              <CategorizedPrerequisites> ({
                rcp: false,
                casterBlessedOne: List (),
                traditions: List (),
                attributes: List (),
                primaryAttribute: Nothing,
                skills: List (),
                activeSkills: List (),
                otherActiveSpecialAbilities: List (),
                inactiveSpecialAbilities: List (),
                otherActiveAdvantages: List (),
                inactiveAdvantages: List (),
                activeDisadvantages: List (),
                inactiveDisadvantages: List (),
                race: Nothing,
                social: Nothing,
              })

export const CategorizedPrerequisitesL = makeLenses (CategorizedPrerequisites)
