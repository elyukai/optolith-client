import { RatedSumPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedSumPrerequisite"
import { sumWith } from "../../../utils/array.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActivatableRatedWithEnhancements, Rated } from "../../ratedEntry.ts"

/**
 * Checks a single rated sum prerequisite if it’s matched.
 */
export const checkRatedSumPrerequisite = (
  caps: {
    getDynamicSkill: (id: number) => Rated | undefined
    getDynamicSpell: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicRitual: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicLiturgicalChant: (id: number) => ActivatableRatedWithEnhancements | undefined
    getDynamicCeremony: (id: number) => ActivatableRatedWithEnhancements | undefined
  },
  p: RatedSumPrerequisite,
): boolean =>
  sumWith(
    p.targets,
    id =>
      (() => {
        switch (id.tag) {
          case "Skill":
            return caps.getDynamicSkill(id.skill)
          case "Spell":
            return caps.getDynamicSpell(id.spell)
          case "Ritual":
            return caps.getDynamicRitual(id.ritual)
          case "LiturgicalChant":
            return caps.getDynamicLiturgicalChant(id.liturgical_chant)
          case "Ceremony":
            return caps.getDynamicCeremony(id.ceremony)
          default:
            return assertExhaustive(id)
        }
      })()?.value ?? 0,
  ) >= p.sum
