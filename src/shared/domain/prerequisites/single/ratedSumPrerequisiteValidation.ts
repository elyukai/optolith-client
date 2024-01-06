import { RatedSumPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedSumPrerequisite"
import { sumWith } from "../../../utils/array.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single rated sum prerequisite if it’s matched.
 */
export const checkRatedSumPrerequisite = (
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
  },
  p: RatedSumPrerequisite,
): boolean =>
  sumWith(
    p.targets,
    id =>
      (() => {
        switch (id.tag) {
          case "Skill":
            return caps.getDynamicSkillById(id.skill)
          case "Spell":
            return caps.getDynamicSpellById(id.spell)
          case "Ritual":
            return caps.getDynamicRitualById(id.ritual)
          case "LiturgicalChant":
            return caps.getDynamicLiturgicalChantById(id.liturgical_chant)
          case "Ceremony":
            return caps.getDynamicCeremonyById(id.ceremony)
          default:
            return assertExhaustive(id)
        }
      })()?.value ?? 0,
  ) >= p.sum
