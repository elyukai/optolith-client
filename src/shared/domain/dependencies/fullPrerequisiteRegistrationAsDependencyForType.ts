import { Draft } from "@reduxjs/toolkit"
import {
  AdvantageIdentifier,
  DisadvantageIdentifier,
} from "optolith-database-schema/types/_Identifier"
import {
  LiturgyIdentifier,
  SpecialAbilityIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  AdvantageDisadvantagePrerequisites,
  GeneralPrerequisites,
  LiturgyPrerequisites,
  PlainGeneralPrerequisites,
  SpellworkPrerequisites,
} from "optolith-database-schema/types/_Prerequisite"
import { RangeBounds } from "../../utils/range.ts"
import { Character } from "../character.ts"
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

/**
 * Register or unregister all prerequisites of a general entry as dependencies
 * on the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfPlainGeneralAsDependencies = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: PlainGeneralPrerequisites,
  sourceId: SpecialAbilityIdentifier,
  capabilities: {
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  },
): void =>
  registerOrUnregisterPlainPrerequisites(
    method,
    character,
    p,
    sourceId,
    registerOrUnregisterPrerequisiteOfGeneralAsDependency,
    capabilities,
  )

/**
 * Register or unregister all prerequisites of a general entry as dependencies
 * on the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfGeneralAsDependencies = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: GeneralPrerequisites,
  sourceId: SpecialAbilityIdentifier,
  levelRange: RangeBounds,
  capabilities: {
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  },
): void =>
  registerOrUnregisterPrerequisitesForLevels(
    method,
    character,
    p,
    levelRange,
    sourceId,
    registerOrUnregisterPrerequisiteOfGeneralAsDependency,
    capabilities,
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
  method: RegistrationMethod,
  character: Draft<Character>,
  p: AdvantageDisadvantagePrerequisites,
  sourceId: AdvantageIdentifier | DisadvantageIdentifier,
  levelRange: RangeBounds,
  capabilities: {
    ancestorBloodAdvantageIds: number[]
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  },
): void =>
  registerOrUnregisterPrerequisitesForLevels(
    method,
    character,
    p,
    levelRange,
    sourceId,
    registerOrUnregisterPrerequisiteOfAdvantageOrDisadvantageAsDependency,
    capabilities,
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
  method: RegistrationMethod,
  character: Draft<Character>,
  p: SpellworkPrerequisites,
  sourceId: SpellworkIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    method,
    character,
    p,
    sourceId,
    registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
  )

/**
 * Register or unregister all prerequisites of a liturgy as dependencies on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisitesOfLiturgyAsDependencies = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: LiturgyPrerequisites,
  sourceId: LiturgyIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    method,
    character,
    p,
    sourceId,
    registerOrUnregisterPrerequisiteOfLiturgyAsDependency,
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
// export const registerOrUnregisterPrerequisitesOfEnhancementAsDependencies = (
//   method: RegistrationMethod,
//   character: Draft<Character>,
//   p: EnhancementPrerequisites,
//   sourceId: SpellworkIdentifier,
// ): void =>
//   registerOrUnregisterPlainPrerequisites(
//     method,
//     character,
//     p,
//     sourceId,
//     registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
//   )
