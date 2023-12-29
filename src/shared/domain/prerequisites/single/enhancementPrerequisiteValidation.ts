import {
  ExternalEnhancementPrerequisite,
  InternalEnhancementPrerequisite,
} from "optolith-database-schema/types/prerequisites/single/EnhancementPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { Enhancement } from "../../rated/enhancement.ts"
import { ActivatableRatedWithEnhancements } from "../../rated/ratedEntry.ts"

/**
 * Checks a single external enhancement prerequisite if it’s matched.
 */
export const checkExternalEnhancementPrerequisite = (
  caps: {
    getDynamicSpell: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicRitual: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicLiturgicalChant: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicCeremony: (id: number) => ActivatableRatedWithEnhancements | undefined
  },
  p: ExternalEnhancementPrerequisite,
): boolean => {
  const entry = (() => {
    switch (p.skill.id.tag) {
      case "Spell":
        return caps.getDynamicSpell(p.skill.id.spell)
      case "Ritual":
        return caps.getDynamicRitual(p.skill.id.ritual)
      case "LiturgicalChant":
        return caps.getDynamicLiturgicalChant(p.skill.id.liturgical_chant)
      case "Ceremony":
        return caps.getDynamicCeremony(p.skill.id.ceremony)
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
