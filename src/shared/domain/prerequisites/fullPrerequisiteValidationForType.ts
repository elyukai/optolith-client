/**
 * This module includes validation logic for all possible prerequisites for
 * certain entry types, including logical combinators and level-dependent
 * prerequisites.
 */

import {
  AdvantageDisadvantagePrerequisites,
  AnimistPowerPrerequisites,
  ArcaneTraditionPrerequisites,
  DerivedCharacteristicPrerequisites,
  EnhancementPrerequisites,
  GeneralPrerequisites,
  GeodeRitualPrerequisites,
  InfluencePrerequisites,
  LanguagePrerequisites,
  LiturgyPrerequisites,
  PersonalityTraitPrerequisites,
  PlainGeneralPrerequisites,
  ProfessionPrerequisites,
  PublicationPrerequisites,
  SpellworkPrerequisites,
} from "optolith-database-schema/types/_Prerequisite"
import { Preconditions } from "optolith-database-schema/types/prerequisites/ConditionalPrerequisites"
import {
  checkPlainPrerequisites,
  checkPrerequisitesForLevels,
} from "./prerequisiteCombinatorValidation.ts"
import * as SingleChecks from "./prerequisiteValidationForType.ts"

/**
 * Checks all prerequisites for a derived characteristic.
 */
export const checkPrerequisitesOfDerivedCharacteristic = (
  prerequisites: DerivedCharacteristicPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfDerivedCharacteristic>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfDerivedCharacteristic(capabilities, p),
  )

/**
 * Checks all prerequisites for a publication.
 */
export const checkPrerequisitesOfPublication = (
  prerequisites: PublicationPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfPublication>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfPublication(capabilities, p),
  )

/**
 * Checks all prerequisites for a general entry without levels.
 */
export const checkPrerequisitesOfGeneralEntry = (
  prerequisites: PlainGeneralPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfGeneralEntry>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfGeneralEntry(capabilities, p),
  )

/**
 * Checks all prerequisites for a general entry with levels.
 */
export const checkPrerequisitesOfGeneralEntryWithLevels = (
  prerequisites: GeneralPrerequisites,
  level: number,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfGeneralEntry>[0],
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p =>
    SingleChecks.checkPrerequisiteOfGeneralEntry(capabilities, p),
  )

/**
 * Checks all prerequisites for a profession.
 */
export const checkPrerequisitesOfProfession = (
  prerequisites: ProfessionPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfProfession>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfProfession(capabilities, p),
  )

/**
 * Checks all prerequisites for an advantage or disadvantage.
 */
export const checkPrerequisitesOfAdvantageOrDisadvantage = (
  prerequisites: AdvantageDisadvantagePrerequisites,
  level: number,
  sourceKind: "Advantage" | "Disadvantage",
  sourceId: number,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfAdvantageOrDisadvantage>[0],
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p =>
    SingleChecks.checkPrerequisiteOfAdvantageOrDisadvantage(capabilities, p, sourceKind, sourceId),
  )

/**
 * Checks all prerequisites for an arcane tradition.
 */
export const checkPrerequisitesOfArcaneTradition = (
  prerequisites: ArcaneTraditionPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfArcaneTradition>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfArcaneTradition(capabilities, p),
  )

/**
 * Checks all prerequisites for a personality trait.
 */
export const checkPrerequisitesOfPersonalityTrait = (
  prerequisites: PersonalityTraitPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfPersonalityTrait>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfPersonalityTrait(capabilities, p),
  )

/**
 * Checks all prerequisites for a spellwork.
 */
export const checkPrerequisitesOfSpellwork = (
  prerequisites: SpellworkPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfSpellwork>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfSpellwork(capabilities, p),
  )

/**
 * Checks all prerequisites for a liturgy.
 */
export const checkPrerequisitesOfLiturgy = (
  prerequisites: LiturgyPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfLiturgy>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfLiturgy(capabilities, p),
  )

/**
 * Checks all prerequisites for an influence.
 */
export const checkPrerequisitesOfInfluence = (
  prerequisites: InfluencePrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfInfluence>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfInfluence(capabilities, p),
  )

/**
 * Checks all prerequisites for a language.
 */
export const checkPrerequisitesOfLanguage = (
  prerequisites: LanguagePrerequisites,
  level: number,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfLanguage>[0],
): boolean =>
  checkPrerequisitesForLevels(prerequisites, level, p =>
    SingleChecks.checkPrerequisiteOfLanguage(capabilities, p),
  )

/**
 * Checks all prerequisites for an animist power.
 */
export const checkPrerequisitesOfAnimistPower = (
  prerequisites: AnimistPowerPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfAnimistPower>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfAnimistPower(capabilities, p),
  )

/**
 * Checks all prerequisites for a geode ritual.
 */
export const checkPrerequisitesOfGeodeRitual = (
  prerequisites: GeodeRitualPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfGeodeRitual>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfGeodeRitual(capabilities, p),
  )

/**
 * Checks all prerequisites for an enhancement.
 */
export const checkPrerequisitesOfEnhancement = (
  prerequisites: EnhancementPrerequisites,
  capabilities: Parameters<typeof SingleChecks.checkPrerequisiteOfEnhancement>[0],
): boolean =>
  checkPlainPrerequisites(prerequisites, p =>
    SingleChecks.checkPrerequisiteOfEnhancement(capabilities, p),
  )

/**
 * Checks all prerequisites for an enhancement.
 */
export const checkPreconditions = (
  prerequisites: Preconditions,
  capabilities: Parameters<typeof SingleChecks.checkPrecondition>[0],
): boolean => prerequisites.every(p => SingleChecks.checkPrecondition(capabilities, p))
