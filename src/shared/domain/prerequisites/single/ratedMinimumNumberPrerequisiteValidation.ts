import { count } from "@elyukai/utils/array/reductions"
import { isNotNullish } from "@elyukai/utils/nullable"
import type {
  Aspect_ID,
  Property_ID,
  RatedMinimumNumberPrerequisite,
  RatedMinimumNumberPrerequisiteTarget,
  Skill_ID,
} from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { CharacterCombatTechnique } from "../../rated/combatTechnique.ts"
import type { CharacterLiturgicalChant } from "../../rated/liturgicalChant.ts"
import type { CharacterActivatableRatedWithEnhancements } from "../../rated/ratedEntry.ts"
import type { CharacterSkill } from "../../rated/skill.ts"
import type { CharacterSpellwork } from "../../rated/spell.ts"

/**
 * Counts the number of entries that match the the requirements of the rated
 * minimum number prerequisite.
 */
export const countMatchingRatedMinimumNumberEntries = (
  caps: {
    getSkillById: (id: Skill_ID) => CharacterSkill | undefined
    closeCombatTechniques: CharacterCombatTechnique<"CloseCombatTechnique">[]
    rangedCombatTechniques: CharacterCombatTechnique<"RangedCombatTechnique">[]
    getSpellworksByProperty: (id: Property_ID) => CharacterSpellwork<"Spell" | "Ritual">[]
    getLiturgicalChantsByAspect: (
      id: Aspect_ID,
    ) => CharacterLiturgicalChant<"LiturgicalChant" | "Ceremony">[]
  },
  minimumValue: number,
  targets: RatedMinimumNumberPrerequisiteTarget,
): number => {
  const matchRated = (rated: { value: number }) => rated.value >= minimumValue
  const matchActivatableRated = (
    activatableRated: CharacterActivatableRatedWithEnhancements<
      "Spell" | "Ritual" | "LiturgicalChant" | "Ceremony"
    >,
  ) => activatableRated.value !== undefined && activatableRated.value >= minimumValue

  switch (targets.kind) {
    case "Skills":
      return count(
        targets.Skills.targets.map(caps.getSkillById),
        e => isNotNullish(e) && matchRated(e),
      )
    case "CombatTechniques":
      switch (targets.CombatTechniques.group.kind) {
        case "All":
          return count([...caps.closeCombatTechniques, ...caps.rangedCombatTechniques], matchRated)
        case "Close":
          return count(caps.closeCombatTechniques, matchRated)
        case "Ranged":
          return count(caps.rangedCombatTechniques, matchRated)
        default:
          return assertExhaustive(targets.CombatTechniques.group)
      }
    case "Spellworks":
      return count(caps.getSpellworksByProperty(targets.Spellworks.property), matchActivatableRated)
    case "Liturgies":
      return count(
        caps.getLiturgicalChantsByAspect(targets.Liturgies.aspect),
        matchActivatableRated,
      )
    default:
      return assertExhaustive(targets)
  }
}

/**
 * Checks a single rated minimum number prerequisite if it’s matched.
 */
export const checkRatedMinimumNumberPrerequisite = (
  caps: {
    getSkillById: (id: Skill_ID) => CharacterSkill | undefined
    closeCombatTechniques: CharacterCombatTechnique<"CloseCombatTechnique">[]
    rangedCombatTechniques: CharacterCombatTechnique<"RangedCombatTechnique">[]
    getSpellworksByProperty: (id: Property_ID) => CharacterSpellwork<"Spell" | "Ritual">[]
    getLiturgicalChantsByAspect: (
      id: Aspect_ID,
    ) => CharacterLiturgicalChant<"LiturgicalChant" | "Ceremony">[]
  },
  p: RatedMinimumNumberPrerequisite,
): boolean => countMatchingRatedMinimumNumberEntries(caps, p.value, p.targets) >= p.number
