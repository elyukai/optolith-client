import { RatedPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActivatableRatedWithEnhancements, Rated } from "../../rated/ratedEntry.ts"

/**
 * Checks a single rated prerequisite if it’s matched.
 */
export const checkRatedPrerequisite = (
  caps: {
    getDynamicAttribute: (id: number) => Rated | undefined
    getDynamicSkill: (id: number) => Rated | undefined
    getDynamicCloseCombatTechnique: (id: number) => Rated | undefined
    getDynamicRangedCombatTechnique: (id: number) => Rated | undefined
    getDynamicSpell: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicRitual: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicLiturgicalChant: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicCeremony: (id: number) => ActivatableRatedWithEnhancements | undefined
  },
  p: RatedPrerequisite,
): boolean =>
  (() => {
    switch (p.id.tag) {
      case "Attribute":
        return caps.getDynamicAttribute(p.id.attribute)
      case "Skill":
        return caps.getDynamicSkill(p.id.skill)
      case "CloseCombatTechnique":
        return caps.getDynamicCloseCombatTechnique(p.id.close_combat_technique)
      case "RangedCombatTechnique":
        return caps.getDynamicRangedCombatTechnique(p.id.ranged_combat_technique)
      case "Spell":
        return caps.getDynamicSpell(p.id.spell)
      case "Ritual":
        return caps.getDynamicRitual(p.id.ritual)
      case "LiturgicalChant":
        return caps.getDynamicLiturgicalChant(p.id.liturgical_chant)
      case "Ceremony":
        return caps.getDynamicCeremony(p.id.ceremony)
      default:
        return assertExhaustive(p.id)
    }
  })()?.value === p.value
