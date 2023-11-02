import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { RatedPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { createEmptyDynamicAttribute } from "../../attribute.ts"
import { createEmptyDynamicCombatTechnique } from "../../combatTechnique.ts"
import { createEmptyDynamicLiturgicalChant } from "../../liturgicalChant.ts"
import { RatedDependency } from "../../rated/ratedDependency.ts"
import { createEmptyDynamicSkill } from "../../skill.ts"
import { createEmptyDynamicSpell } from "../../spell.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedPrerequisite} as a dependency on the character's draft.
 */
export const registerOrUnregisterRatedPrerequisiteAsDependency: RegistrationFunction<
  RatedPrerequisite,
  ActivatableIdentifier | SkillWithEnhancementsIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RatedDependency = {
    source: sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "Minimum",
      minimum: p.value,
    },
  }

  switch (p.id.tag) {
    case "Attribute":
      return addOrRemoveDependency(
        method,
        character.attributes,
        p.id.attribute,
        createEmptyDynamicAttribute,
        dependency,
      )
    case "Skill":
      return addOrRemoveDependency(
        method,
        character.skills,
        p.id.skill,
        createEmptyDynamicSkill,
        dependency,
      )
    case "CloseCombatTechnique":
      return addOrRemoveDependency(
        method,
        character.combatTechniques.close,
        p.id.close_combat_technique,
        createEmptyDynamicCombatTechnique,
        dependency,
      )
    case "RangedCombatTechnique":
      return addOrRemoveDependency(
        method,
        character.combatTechniques.ranged,
        p.id.ranged_combat_technique,
        createEmptyDynamicCombatTechnique,
        dependency,
      )
    case "Spell":
      return addOrRemoveDependency(
        method,
        character.spells,
        p.id.spell,
        createEmptyDynamicSpell,
        dependency,
      )
    case "Ritual":
      return addOrRemoveDependency(
        method,
        character.rituals,
        p.id.ritual,
        createEmptyDynamicSpell,
        dependency,
      )
    case "LiturgicalChant":
      return addOrRemoveDependency(
        method,
        character.liturgicalChants,
        p.id.liturgical_chant,
        createEmptyDynamicLiturgicalChant,
        dependency,
      )
    case "Ceremony":
      return addOrRemoveDependency(
        method,
        character.ceremonies,
        p.id.ceremony,
        createEmptyDynamicLiturgicalChant,
        dependency,
      )
    default:
      return assertExhaustive(p.id)
  }
}