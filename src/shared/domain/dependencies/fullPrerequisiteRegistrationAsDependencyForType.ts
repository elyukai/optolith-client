import type { RangeBounds } from "@elyukai/utils/range"
import type {
  AdvantageDisadvantagePrerequisites,
  EnhancementPrerequisites,
  GeneralPrerequisites,
  LiturgyIdentifier,
  LiturgyPrerequisites,
  PlainGeneralPrerequisites,
  SkillWithEnhancementsIdentifier,
  SpecialAbilityIdentifier,
  SpellworkIdentifier,
  SpellworkPrerequisites,
} from "@optolith/database-schema/gen"
import type { Character } from "../character.ts"
import type { Case } from "../databaseEnum.ts"
import {
  registerOrUnregisterPlainPrerequisites,
  registerOrUnregisterPrerequisitesForLevels,
} from "./prerequisiteCombinatorRegistrationAsDependency.ts"
import {
  registerOrUnregisterPrerequisiteOfAdvantageOrDisadvantageAsDependency,
  registerOrUnregisterPrerequisiteOfGeneralAsDependency,
  registerOrUnregisterPrerequisiteOfLiturgyAsDependency,
  registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
} from "./prerequisiteRegistrationAsDependencyForType.ts"
import { RegistrationMethod } from "./registrationHelpers.ts"
import { registerOrUnregisterPrerequisiteAsDependencyForType } from "./single/index.ts"

/**
import type { AdvantageIdentifier, DisadvantageIdentifier } from "@optolith/database-schema/types/_Identifier"
 * Register or unregister all prerequisites of a general entry as dependencies
 * on the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfPlainGeneralAsDependencies = (
  p: PlainGeneralPrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: SpecialAbilityIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    registerOrUnregisterPrerequisiteOfGeneralAsDependency,
    p,
    method,
    character,
    sourceId,
  )

/**
 * Register or unregister all prerequisites of a general entry as dependencies
 * on the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfGeneralAsDependencies = (
  p: GeneralPrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: SpecialAbilityIdentifier,
  levelRange: RangeBounds,
): void =>
  registerOrUnregisterPrerequisitesForLevels(
    registerOrUnregisterPrerequisiteOfGeneralAsDependency,
    p,
    method,
    character,
    levelRange,
    sourceId,
  )

/**
 * Register or unregister all prerequisites of a profession as dependencies on
 * the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfProfessionAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: ProfessionPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of an advantage or disadvantage as
 * dependencies on the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies = (
  p: AdvantageDisadvantagePrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: Case<"Advantage" | "Disadvantage", string>,
  levelRange: RangeBounds,
): void =>
  registerOrUnregisterPrerequisitesForLevels(
    registerOrUnregisterPrerequisiteOfAdvantageOrDisadvantageAsDependency,
    p,
    method,
    character,
    levelRange,
    sourceId,
  )

/**
 * Register or unregister all prerequisites of an arcane tradition as
 * dependencies on the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfArcaneTraditionAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: ArcaneTraditionPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of a personality trait as
 * dependencies on the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfPersonalityTraitAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: PersonalityTraitPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of a spellwork as dependencies on
 * the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfSpellworkAsDependencies = (
  p: SpellworkPrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: SpellworkIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
    p,
    method,
    character,
    sourceId,
  )

/**
 * Register or unregister all prerequisites of a liturgy as dependencies on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisitesOfLiturgyAsDependencies = (
  p: LiturgyPrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: LiturgyIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    registerOrUnregisterPrerequisiteOfLiturgyAsDependency,
    p,
    method,
    character,
    sourceId,
  )

/**
 * Register or unregister all prerequisites of an influence as dependencies on
 * the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfInfluenceAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: InfluencePrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of a language as dependencies on the
 * character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfLanguageAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: LanguagePrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of an animist power as dependencies
 * on the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfAnimistPowerAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: AnimistPowerPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of a geode ritual as dependencies on
 * the character's draft.
 */
// export const registerOrUnregisterPrerequisitesOfGeodeRitualAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: GeodeRitualPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )

/**
 * Register or unregister all prerequisites of an enhancement as dependencies on
 * the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfEnhancementAsDependencies = (
  p: EnhancementPrerequisites,
  method: RegistrationMethod,
  character: Character,
  sourceId: SkillWithEnhancementsIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    registerOrUnregisterPrerequisiteAsDependencyForType,
    p,
    method,
    character,
    sourceId,
  )
