import { Culture } from "optolith-database-schema/types/Culture"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Skill } from "optolith-database-schema/types/Skill"
import { filterNonNullable } from "../utils/array.ts"
import { mapNullable } from "../utils/nullable.ts"
import { Activatable, countOptions, isActive } from "./activatableEntry.ts"
import { getSingleHighestAttribute } from "./attribute.ts"
import { SkillIdentifier } from "./identifier.ts"
import { Rated, RatedDependency, RatedMap, flattenMinimumRestrictions } from "./ratedEntry.ts"
import { getSkillCheckValues, getSkillCheckWithId } from "./skillCheck.ts"

export const getSkillValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 0

const getSkillMinimumByCraftInstruments = (
  skills: RatedMap,
  dynamicSkill: Rated,
  craftInstruments: Activatable | undefined,
) => {
  if (
    (dynamicSkill.id === SkillIdentifier.Woodworking ||
      dynamicSkill.id === SkillIdentifier.Metalworking) &&
    isActive(craftInstruments)
  ) {
    // Sum of Woodworking and Metalworking must be at least 12.
    const MINIMUM_SUM = 12
    const otherSkillId =
      dynamicSkill.id === SkillIdentifier.Woodworking
        ? SkillIdentifier.Metalworking
        : SkillIdentifier.Woodworking
    const otherSkillRating = getSkillValue(skills[otherSkillId])
    return MINIMUM_SUM - otherSkillRating
  }

  return undefined
}

export const getSkillMinimum = (
  skills: RatedMap,
  dynamicSkill: Rated,
  craftInstruments: Activatable | undefined,
  filterApplyingDependencies: (dependencies: RatedDependency[]) => RatedDependency[],
): number => {
  const minimumValues: number[][] = [
    [0],
    flattenMinimumRestrictions(filterApplyingDependencies(dynamicSkill.dependencies)),
    mapNullable(getSkillMinimumByCraftInstruments(skills, dynamicSkill, craftInstruments), min => [
      min,
    ]) ?? [],
  ]

  return Math.max(...minimumValues.flat())
}

export const getSkillMaximum = (
  attributes: RatedMap,
  skill: Skill,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel | undefined,
  exceptionalSkill: Activatable | undefined,
): number => {
  const maximumValues = filterNonNullable([
    Math.max(...getSkillCheckValues(attributes, skill.check)) + 2,
    isInCharacterCreation && startExperienceLevel !== undefined
      ? startExperienceLevel.max_skill_rating
      : undefined,
  ])

  const exceptionalSkillBonus = countOptions(exceptionalSkill, { type: "Skill", value: skill.id })

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

export const getHighestRequiredAttributeForSkill = (
  attributes: RatedMap,
  staticSkill: Skill,
  dynamicSkill: Rated,
  exceptionalSkill: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const singleHighestAttribute = getSingleHighestAttribute(
    getSkillCheckWithId(attributes, staticSkill.check),
  )

  if (singleHighestAttribute === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type: "Skill",
    value: staticSkill.id,
  })

  return {
    id: singleHighestAttribute.id,
    value: dynamicSkill.value - 2 - exceptionalSkillBonus,
  }
}

export const isSkillDecreasable = (dynamic: Rated, min: number, canRemove: boolean) =>
  min < dynamic.value && canRemove

export const isSkillIncreasable = (dynamic: Rated, max: number) => dynamic.value < max

export const getSkillCommonness = (
  culture: Culture,
  skill: Skill,
): "common" | "uncommon" | undefined =>
  culture.common_skills.some(({ id: { skill: id } }) => skill.id === id)
    ? "common"
    : culture.uncommon_skills?.some(({ id: { skill: id } }) => skill.id === id) ?? false
    ? "uncommon"
    : undefined
