import { RatedMinimumNumberPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedMinimumNumberPrerequisite"
import { isNotNullish } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { GetAll, GetById } from "../../getTypes.ts"
import { GetDynamicLiturgicalChantsByAspectCapability } from "../../rated/liturgicalChant.ts"
import { ActivatableRatedWithEnhancements, Rated } from "../../rated/ratedEntry.ts"
import { GetDynamicSpellworksByPropertyCapability } from "../../rated/spell.ts"

/**
 * Checks a single rated minimum number prerequisite if it’s matched.
 */
export const checkRatedMinimumNumberPrerequisite = (
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicCloseCombatTechniques: GetAll.Dynamic.CloseCombatTechniques
    getDynamicRangedCombatTechniques: GetAll.Dynamic.RangedCombatTechniques
    getDynamicSpellsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicRitualsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicLiturgicalChantsByAspect: GetDynamicLiturgicalChantsByAspectCapability
    getDynamicCeremoniesByAspect: GetDynamicLiturgicalChantsByAspectCapability
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
