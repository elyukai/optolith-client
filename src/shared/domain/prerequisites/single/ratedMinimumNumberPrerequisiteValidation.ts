import {
  RatedMinimumNumberPrerequisite,
  RatedMinimumNumberPrerequisiteTarget,
} from "optolith-database-schema/types/prerequisites/single/RatedMinimumNumberPrerequisite"
import { isNotNullish } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { All, GetById } from "../../getTypes.ts"
import { GetDynamicLiturgicalChantsByAspectCapability } from "../../rated/liturgicalChant.ts"
import { ActivatableRatedWithEnhancements, Rated } from "../../rated/ratedEntry.ts"
import { GetDynamicSpellworksByPropertyCapability } from "../../rated/spell.ts"

/**
 * Counts the number of entries that match the the requirements of the rated
 * minimum number prerequisite.
 */
export const countMatchingRatedMinimumNumberEntries = (
  minimumValue: number,
  targets: RatedMinimumNumberPrerequisiteTarget,
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
    dynamicCloseCombatTechniques: All.Dynamic.CloseCombatTechniques
    dynamicRangedCombatTechniques: All.Dynamic.RangedCombatTechniques
    getDynamicSpellsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicRitualsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicLiturgicalChantsByAspect: GetDynamicLiturgicalChantsByAspectCapability
    getDynamicCeremoniesByAspect: GetDynamicLiturgicalChantsByAspectCapability
  },
): number => {
  const matchRated = (rated: Rated) => rated.value >= minimumValue
  const matchActivatableRated = (activatableRated: ActivatableRatedWithEnhancements) =>
    activatableRated.value !== undefined && activatableRated.value >= minimumValue

  return (() => {
    switch (targets.tag) {
      case "Skills":
        return targets.skills.list
          .map(ref => caps.getDynamicSkillById(ref.id.skill))
          .filter(isNotNullish)
          .filter(matchRated)
      case "CombatTechniques":
        switch (targets.combat_techniques.group) {
          case "All":
            return [
              ...caps.dynamicCloseCombatTechniques.filter(matchRated),
              ...caps.dynamicRangedCombatTechniques.filter(matchRated),
            ]
          case "Close":
            return caps.dynamicCloseCombatTechniques.filter(matchRated)
          case "Ranged":
            return caps.dynamicRangedCombatTechniques.filter(matchRated)
          default:
            return assertExhaustive(targets.combat_techniques.group)
        }
      case "Spellworks":
        return caps
          .getDynamicSpellsByProperty(targets.spellworks.id.property)
          .filter(matchActivatableRated)
      case "Liturgies":
        return caps
          .getDynamicLiturgicalChantsByAspect(targets.liturgies.id.aspect)
          .filter(matchActivatableRated)
      default:
        return assertExhaustive(targets)
    }
  })().length
}

/**
 * Checks a single rated minimum number prerequisite if it’s matched.
 */
export const checkRatedMinimumNumberPrerequisite = (
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
    dynamicCloseCombatTechniques: All.Dynamic.CloseCombatTechniques
    dynamicRangedCombatTechniques: All.Dynamic.RangedCombatTechniques
    getDynamicSpellsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicRitualsByProperty: GetDynamicSpellworksByPropertyCapability
    getDynamicLiturgicalChantsByAspect: GetDynamicLiturgicalChantsByAspectCapability
    getDynamicCeremoniesByAspect: GetDynamicLiturgicalChantsByAspectCapability
  },
  p: RatedMinimumNumberPrerequisite,
): boolean => countMatchingRatedMinimumNumberEntries(p.value, p.targets, caps) >= p.number
