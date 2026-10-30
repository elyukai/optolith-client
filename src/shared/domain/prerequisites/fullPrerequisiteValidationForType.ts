/**
 * This module includes validation logic for all possible prerequisites for
 * certain entry types, including logical combinators and level-dependent
 * prerequisites.
 */

import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  AdvantageDisadvantagePrerequisiteGroup,
  AdvantageDisadvantagePrerequisites,
  AnimistPowerPrerequisiteGroup,
  AnimistPowerPrerequisites,
  ArcaneTraditionPrerequisiteGroup,
  ArcaneTraditionPrerequisites,
  DerivedCharacteristicPrerequisiteGroup,
  DerivedCharacteristicPrerequisites,
  EnhancementPrerequisiteGroup,
  EnhancementPrerequisites,
  GeneralPrerequisiteGroup,
  GeneralPrerequisites,
  GeodeRitualPrerequisiteGroup,
  GeodeRitualPrerequisites,
  InfluencePrerequisiteGroup,
  InfluencePrerequisites,
  LanguagePrerequisiteGroup,
  LanguagePrerequisites,
  LiturgyPrerequisiteGroup,
  LiturgyPrerequisites,
  PersonalityTraitPrerequisiteGroup,
  PersonalityTraitPrerequisites,
  PlainGeneralPrerequisites,
  PreconditionGroup,
  Preconditions,
  ProfessionPrerequisiteGroup,
  ProfessionPrerequisites,
  PublicationPrerequisiteGroup,
  PublicationPrerequisites,
  SpellworkPrerequisiteGroup,
  SpellworkPrerequisites,
} from "@optolith/database-schema/gen"
import { Case } from "tsondb/schema/gen"
import {
  checkPlainPrerequisites,
  checkPrerequisitesForLevels,
} from "./prerequisiteCombinatorValidation.ts"
import {
  validatePrerequisite,
  type CapabilitiesForType,
  type PrerequisiteOfType,
} from "./single/index.ts"

/**
 * Checks all prerequisites for a derived characteristic.
 */
export const checkPrerequisitesOfDerivedCharacteristic = (
  prerequisites: DerivedCharacteristicPrerequisites,
  capabilities: CapabilitiesForType<DerivedCharacteristicPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a publication.
 */
export const checkPrerequisitesOfPublication = (
  prerequisites: PublicationPrerequisites,
  capabilities: CapabilitiesForType<PublicationPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a general entry without levels.
 */
export const checkPrerequisitesOfGeneralEntry = (
  prerequisites: PlainGeneralPrerequisites,
  capabilities: CapabilitiesForType<GeneralPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a general entry with levels.
 */
export const checkPrerequisitesOfGeneralEntryWithLevels = (
  prerequisites: GeneralPrerequisites,
  level: number,
  capabilities: CapabilitiesForType<GeneralPrerequisiteGroup>,
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a profession. Prerequisites that are only for activating entries for a profession to be valid are ignored, as they are not relevant when checking if a profession can be selected in the first place.
 */
export const checkPrerequisitesOfProfession = (
  prerequisites: ProfessionPrerequisites,
  capabilities: CapabilitiesForType<
    Exclude<
      ProfessionPrerequisiteGroup,
      {
        kind: "Activatable" | "Rated" | "RatedMinimumNumber" | "Energy"
      }
    >
  >,
): boolean =>
  checkPlainPrerequisites(prerequisites, p => {
    switch (p.kind) {
      case "Rule":
      case "Sex":
      case "Race":
      case "Culture":
        return validatePrerequisite(p, capabilities)
      case "Activatable":
      case "Energy":
      case "Rated":
      case "RatedMinimumNumber":
        return true
      default:
        return assertExhaustive(p)
    }
  })

export const prepareAdvantageDisadvantagePrerequisite = (
  p: AdvantageDisadvantagePrerequisiteGroup,
  sourceKind: "Advantage" | "Disadvantage",
  sourceId: string,
): PrerequisiteOfType<AdvantageDisadvantagePrerequisiteGroup["kind"]> => {
  switch (p.kind) {
    case "CommonSuggestedByRCP":
      return Case("CommonSuggestedByRCP", { kind: sourceKind, id: sourceId })
    case "NoOtherAncestorBloodAdvantage":
      return Case("NoOtherAncestorBloodAdvantage", { id: sourceId })
    default:
      return p
  }
}

/**
 * Checks all prerequisites for an advantage or disadvantage.
 */
export const checkPrerequisitesOfAdvantageOrDisadvantage = (
  prerequisites: AdvantageDisadvantagePrerequisites,
  level: number,
  sourceKind: "Advantage" | "Disadvantage",
  sourceId: string,
  capabilities: CapabilitiesForType<AdvantageDisadvantagePrerequisiteGroup>,
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p =>
    validatePrerequisite(
      prepareAdvantageDisadvantagePrerequisite(p, sourceKind, sourceId),
      capabilities,
    ),
  )

/**
 * Checks all prerequisites for an arcane tradition.
 */
export const checkPrerequisitesOfArcaneTradition = (
  prerequisites: ArcaneTraditionPrerequisites,
  capabilities: CapabilitiesForType<ArcaneTraditionPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a personality trait.
 */
export const checkPrerequisitesOfPersonalityTrait = (
  prerequisites: PersonalityTraitPrerequisites,
  capabilities: CapabilitiesForType<PersonalityTraitPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a spellwork.
 */
export const checkPrerequisitesOfSpellwork = (
  prerequisites: SpellworkPrerequisites,
  capabilities: CapabilitiesForType<SpellworkPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a liturgy.
 */
export const checkPrerequisitesOfLiturgy = (
  prerequisites: LiturgyPrerequisites,
  capabilities: CapabilitiesForType<LiturgyPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for an influence.
 */
export const checkPrerequisitesOfInfluence = (
  prerequisites: InfluencePrerequisites,
  capabilities: CapabilitiesForType<InfluencePrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a language.
 */
export const checkPrerequisitesOfLanguage = (
  prerequisites: LanguagePrerequisites,
  level: number,
  capabilities: CapabilitiesForType<LanguagePrerequisiteGroup>,
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for an animist power.
 */
export const checkPrerequisitesOfAnimistPower = (
  prerequisites: AnimistPowerPrerequisites,
  capabilities: CapabilitiesForType<AnimistPowerPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for a geode ritual.
 */
export const checkPrerequisitesOfGeodeRitual = (
  prerequisites: GeodeRitualPrerequisites,
  capabilities: CapabilitiesForType<GeodeRitualPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for an enhancement.
 */
export const checkPrerequisitesOfEnhancement = (
  prerequisites: EnhancementPrerequisites,
  capabilities: CapabilitiesForType<EnhancementPrerequisiteGroup>,
): boolean => checkPlainPrerequisites(prerequisites, p => validatePrerequisite(p, capabilities))

/**
 * Checks all prerequisites for an enhancement.
 */
export const checkPreconditions = (
  prerequisites: Preconditions,
  capabilities: CapabilitiesForType<PreconditionGroup>,
): boolean => prerequisites.every(p => validatePrerequisite(p, capabilities))
