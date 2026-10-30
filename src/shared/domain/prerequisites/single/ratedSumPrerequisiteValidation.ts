import { sumWith } from "@elyukai/utils/array/reductions"
import type { RatedSumPrerequisite, Skill_ID } from "@optolith/database-schema/gen"
import type { CharacterSkill } from "../../rated/skill.ts"

/**
 * Get the sum of skill ratings of entries that are listed in the rated sum
 * prerequisite.
 */
export const sumMatchingRatedSumEntries = (
  caps: {
    getSkillById: (id: Skill_ID) => CharacterSkill | undefined
  },
  targets: Skill_ID[],
): number => sumWith(targets, id => caps.getSkillById(id)?.value ?? 0)

/**
 * Checks a single rated sum prerequisite if it’s matched.
 */
export const checkRatedSumPrerequisite = (
  caps: {
    getSkillById: (id: Skill_ID) => CharacterSkill | undefined
  },
  p: RatedSumPrerequisite,
): boolean => sumMatchingRatedSumEntries(caps, p.targets) >= p.sum
