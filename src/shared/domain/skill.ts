import { Culture } from "optolith-database-schema/types/Culture"
import { Skill } from "optolith-database-schema/types/Skill"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { Activatable, countOptions } from "./activatableEntry.ts"
import { Rated } from "./ratedEntry.ts"

/**
 * Returns the value for a dynamic skill entry that might not exist yet.
 */
export const getSkillValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 0

/**
 * Returns the highest required attribute and its value for a skill, if any.
 */
export const getHighestRequiredAttributeForSkill = (
  getSingleHighestCheckAttributeId: (check: SkillCheck) => number | undefined,
  staticSkill: Skill,
  dynamicSkill: Rated,
  exceptionalSkill: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const singleHighestAttributeId = getSingleHighestCheckAttributeId(staticSkill.check)

  if (singleHighestAttributeId === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type: "Skill",
    value: staticSkill.id,
  })

  return {
    id: singleHighestAttributeId,
    value: dynamicSkill.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Returns if a skill is common or uncommon for a culture.
 */
export const getSkillCommonness = (
  culture: Pick<Culture, "common_skills" | "uncommon_skills">,
  skill: Skill,
): "common" | "uncommon" | undefined =>
  culture.common_skills.some(({ id: { skill: id } }) => skill.id === id)
    ? "common"
    : culture.uncommon_skills?.some(({ id: { skill: id } }) => skill.id === id) ?? false
    ? "uncommon"
    : undefined
