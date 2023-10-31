import { RatedMinimumNumberPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedMinimumNumberPrerequisite"
import { isNotNullish } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActivatableRatedWithEnhancements, Rated } from "../../ratedEntry.ts"

/**
 * Checks a single rated minimum number prerequisite if it’s matched.
 */
export const checkRatedMinimumNumberPrerequisite = (
  caps: {
    getDynamicSkillById: (id: number) => Rated | undefined
    getDynamicCloseCombatTechniques: () => Rated[]
    getDynamicRangedCombatTechniques: () => Rated[]
    getDynamicSpellsByProperty: (propertyId: number) => ActivatableRatedWithEnhancements[]
    getDynamicRitualsByProperty: (propertyId: number) => ActivatableRatedWithEnhancements[]
    getDynamicLiturgicalChantsByAspect: (aspectId: number) => ActivatableRatedWithEnhancements[]
    getDynamicCeremoniesByAspect: (aspectId: number) => ActivatableRatedWithEnhancements[]
  },
  p: RatedMinimumNumberPrerequisite,
): boolean => {
  const matchRated = (rated: Rated) => rated.value >= p.value
  const matchActivatableRated = (activatableRated: ActivatableRatedWithEnhancements) =>
    activatableRated.value !== undefined && activatableRated.value >= p.value

  const matchingEntries = (() => {
    switch (p.targets.tag) {
      case "Skills":
        return p.targets.skills.list
          .map(ref => caps.getDynamicSkillById(ref.id.skill))
          .filter(isNotNullish)
          .filter(matchRated)
      case "CombatTechniques":
        switch (p.targets.combat_techniques.group) {
          case "All":
            return [
              ...caps.getDynamicCloseCombatTechniques().filter(matchRated),
              ...caps.getDynamicRangedCombatTechniques().filter(matchRated),
            ]
          case "Close":
            return caps.getDynamicCloseCombatTechniques().filter(matchRated)
          case "Ranged":
            return caps.getDynamicRangedCombatTechniques().filter(matchRated)
          default:
            return assertExhaustive(p.targets.combat_techniques.group)
        }
      case "Spellworks":
        return caps
          .getDynamicSpellsByProperty(p.targets.spellworks.id.property)
          .filter(matchActivatableRated)
      case "Liturgies":
        return caps
          .getDynamicLiturgicalChantsByAspect(p.targets.liturgies.id.aspect)
          .filter(matchActivatableRated)
      default:
        return assertExhaustive(p.targets)
    }
  })()

  return matchingEntries.length >= p.number
}
