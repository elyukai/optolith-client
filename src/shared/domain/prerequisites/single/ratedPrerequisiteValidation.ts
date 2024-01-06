import { RatedPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single rated prerequisite if it’s matched.
 */
export const checkRatedPrerequisite = (
  caps: {
    getDynamicAttributeById: GetById.Dynamic.Attribute
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicCloseCombatTechniqueById: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechniqueById: GetById.Dynamic.RangedCombatTechnique
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
  },
  p: RatedPrerequisite,
): boolean =>
  (() => {
    switch (p.id.tag) {
      case "Attribute":
        return caps.getDynamicAttributeById(p.id.attribute)
      case "Skill":
        return caps.getDynamicSkillById(p.id.skill)
      case "CloseCombatTechnique":
        return caps.getDynamicCloseCombatTechniqueById(p.id.close_combat_technique)
      case "RangedCombatTechnique":
        return caps.getDynamicRangedCombatTechniqueById(p.id.ranged_combat_technique)
      case "Spell":
        return caps.getDynamicSpellById(p.id.spell)
      case "Ritual":
        return caps.getDynamicRitualById(p.id.ritual)
      case "LiturgicalChant":
        return caps.getDynamicLiturgicalChantById(p.id.liturgical_chant)
      case "Ceremony":
        return caps.getDynamicCeremonyById(p.id.ceremony)
      default:
        return assertExhaustive(p.id)
    }
  })()?.value === p.value
