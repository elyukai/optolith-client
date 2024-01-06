import {
  ExternalEnhancementPrerequisite,
  InternalEnhancementPrerequisite,
} from "optolith-database-schema/types/prerequisites/single/EnhancementPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"
import { Enhancement } from "../../rated/enhancement.ts"

/**
 * Checks a single external enhancement prerequisite if it’s matched.
 */
export const checkExternalEnhancementPrerequisite = (
  caps: {
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
  },
  p: ExternalEnhancementPrerequisite,
): boolean => {
  const entry = (() => {
    switch (p.skill.id.tag) {
      case "Spell":
        return caps.getDynamicSpellById(p.skill.id.spell)
      case "Ritual":
        return caps.getDynamicRitualById(p.skill.id.ritual)
      case "LiturgicalChant":
        return caps.getDynamicLiturgicalChantById(p.skill.id.liturgical_chant)
      case "Ceremony":
        return caps.getDynamicCeremonyById(p.skill.id.ceremony)
      default:
        return assertExhaustive(p.skill.id)
    }
  })()

  return Object.values(entry?.enhancements ?? {}).some(e => e.id === p.enhancement.id)
}

/**
 * Checks a single internal enhancement prerequisite if it’s matched.
 */
export const checkInternalEnhancementPrerequisite = (
  caps: {
    getLocalEnhancements: () => Enhancement[]
  },
  p: InternalEnhancementPrerequisite,
): boolean => {
  const enhancements = caps.getLocalEnhancements()
  return enhancements.some(e => e.id === p.id)
}
