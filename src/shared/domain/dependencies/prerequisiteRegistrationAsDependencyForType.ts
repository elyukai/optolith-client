import type {
  AdvantageDisadvantagePrerequisiteGroup,
  GeneralPrerequisiteGroup,
  LiturgyIdentifier,
  LiturgyPrerequisiteGroup,
  SpecialAbilityIdentifier,
  SpellworkIdentifier,
  SpellworkPrerequisiteGroup,
} from "@optolith/database-schema/gen"
import type { Case } from "../databaseEnum.ts"
import type { RegistrationFunction } from "./registrationHelpers.ts"
import { registerOrUnregisterPrerequisiteAsDependencyForType } from "./single/index.ts"

/**
 * Registers or unregisters a prerequisite of a general entry as a dependency on
 * the character's draft.
 */
export const registerOrUnregisterPrerequisiteOfGeneralAsDependency: RegistrationFunction<
  GeneralPrerequisiteGroup,
  SpecialAbilityIdentifier
> = (p, ...args): void => registerOrUnregisterPrerequisiteAsDependencyForType(p, ...args)

/**
 * Registers or unregisters a prerequisite of a profession as a dependency on
 * the character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfProfessionAsDependency: RegistrationFunction<ProfessionPrerequisiteGroup, ProfessionIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of an advantage or disadvantage as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterPrerequisiteOfAdvantageOrDisadvantageAsDependency: RegistrationFunction<
  AdvantageDisadvantagePrerequisiteGroup,
  Case<"Advantage" | "Disadvantage", string>
> = (p, ...args): void => registerOrUnregisterPrerequisiteAsDependencyForType(p, ...args)

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfArcaneTraditionAsDependency: RegistrationFunction<ArcaneTraditionPrerequisiteGroup, ArcaneTraditionIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfPersonalityTraitAsDependency: RegistrationFunction<PersonalityTraitPrerequisiteGroup, PersonalityTraitIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfSpellworkAsDependency: RegistrationFunction<
  SpellworkPrerequisiteGroup,
  SpellworkIdentifier
> = (p, ...args): void => registerOrUnregisterPrerequisiteAsDependencyForType(p, ...args)

/**
 * Registers or unregisters a prerequisite of a liturgy as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfLiturgyAsDependency: RegistrationFunction<
  LiturgyPrerequisiteGroup,
  LiturgyIdentifier
> = (p, ...args): void => registerOrUnregisterPrerequisiteAsDependencyForType(p, ...args)
