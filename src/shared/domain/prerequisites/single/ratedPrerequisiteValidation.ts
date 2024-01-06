import { RatedPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single rated prerequisite if it’s matched.
 */
export const checkRatedPrerequisite = (
  caps: {
    getDynamicAttribute: GetById.Dynamic.Attribute
    getDynamicSkill: GetById.Dynamic.Skill
    getDynamicCloseCombatTechnique: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechnique: GetById.Dynamic.RangedCombatTechnique
    getDynamicSpell: GetById.Dynamic.Spell
    getDynamicRitual: GetById.Dynamic.Ritual
    getDynamicLiturgicalChant: GetById.Dynamic.LiturgicalChant
    getDynamicCeremony: GetById.Dynamic.Ceremony
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
