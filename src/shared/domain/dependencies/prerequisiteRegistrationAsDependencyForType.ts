import {
  LiturgyIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  LiturgyPrerequisiteGroup,
  SpellworkPrerequisiteGroup,
} from "optolith-database-schema/types/prerequisites/PrerequisiteGroups"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { RegistrationFunction } from "./registrationHelpers.ts"
import { registerOrUnregisterRatedPrerequisiteAsDependency } from "./single/ratedPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRulePrerequisiteAsDependency } from "./single/rulePrerequisiteRegistrationAsDependency.ts"

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfSpellworkAsDependency: RegistrationFunction<
  SpellworkPrerequisiteGroup,
  SpellworkIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  switch (p.tag) {
    case "Rule":
      return registerOrUnregisterRulePrerequisiteAsDependency(
        method,
        character,
        p.rule,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Rated":
      return registerOrUnregisterRatedPrerequisiteAsDependency(
        method,
        character,
        p.rated,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    default:
      return assertExhaustive(p)
  }
}

/**
 * Registers or unregisters a prerequisite of a liturgy as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfLiturgyAsDependency: RegistrationFunction<
  LiturgyPrerequisiteGroup,
  LiturgyIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void =>
  registerOrUnregisterRulePrerequisiteAsDependency(
    method,
    character,
    p.rule,
    sourceId,
    index,
    isPartOfDisjunction,
  )
