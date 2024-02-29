import { SkillIdentifier } from "optolith-database-schema/types/_Identifier"
import { RatedSumPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedSumPrerequisite"
import { sumWith } from "../../../utils/array.ts"
import { GetById } from "../../getTypes.ts"
import { getSkillValue } from "../../rated/skill.ts"

/**
 * Get the sum of skill ratings of entries that are listed in the rated sum
 * prerequisite.
 */
export const sumMatchingRatedSumEntries = (
  targets: SkillIdentifier[],
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
  },
): number => sumWith(targets, id => getSkillValue(caps.getDynamicSkillById(id.skill)))

/**
 * Checks a single rated sum prerequisite if it’s matched.
 */
export const checkRatedSumPrerequisite = (
  caps: {
    getDynamicSkillById: GetById.Dynamic.Skill
  },
  p: RatedSumPrerequisite,
): boolean => sumMatchingRatedSumEntries(p.targets, caps) >= p.sum
