import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Skill } from "optolith-database-schema/types/Skill"
import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { filterNonNullable } from "../../utils/array.ts"
import { Activatable, countOptions, isActive } from "../activatable/activatableEntry.ts"
import { SkillIdentifier } from "../identifier.ts"
import { RatedDependency, flattenMinimumRestrictions } from "./ratedDependency.ts"
import { Rated } from "./ratedEntry.ts"
import { getSkillValue } from "./skill.ts"

const getSkillMinimumByCraftInstruments = (
  getDynamicSkill: (id: number) => Rated | undefined,
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
    const otherSkillRating = getSkillValue(getDynamicSkill(otherSkillId))
    return MINIMUM_SUM - otherSkillRating
  }

  return undefined
}

/**
 * Returns the minimum value for a skill.
 */
export const getSkillMinimum = (
  getDynamicSkill: (id: number) => Rated | undefined,
  dynamicSkill: Rated,
  craftInstruments: Activatable | undefined,
  filterApplyingDependencies: (dependencies: RatedDependency[]) => RatedDependency[],
): number => {
  const minimumValues = filterNonNullable([
    0,
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicSkill.dependencies)),
    getSkillMinimumByCraftInstruments(getDynamicSkill, dynamicSkill, craftInstruments),
  ])

  return Math.max(...minimumValues.flat())
}

/**
 * Returns the maximum value for a skill.
 */
export const getSkillMaximum = (
  getHighestAttributeValue: (attributes: AttributeReference[]) => number,
  staticSkill: Skill,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel | undefined,
  exceptionalSkill: Activatable | undefined,
): number => {
  const maximumValues = filterNonNullable([
    getHighestAttributeValue(staticSkill.check) + 2,
    isInCharacterCreation && startExperienceLevel !== undefined
      ? startExperienceLevel.max_skill_rating
      : undefined,
  ])

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type: "Skill",
    value: staticSkill.id,
  })

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

/**
 * Checks if the skill is decreasable.
 * @param dynamicEntry The dynamic skill entry.
 * @param min The value returned from {@link getSkillMinimum}.
 */
export const isSkillDecreasable = (dynamicEntry: Rated, min: number, canRemove: boolean) =>
  min < dynamicEntry.value && canRemove

/**
 * Checks if the skill is increasable.
 * @param dynamicEntry The dynamic skill entry.
 * @param max The value returned from {@link getSkillMaximum}.
 */
export const isSkillIncreasable = (dynamicEntry: Rated, max: number) => dynamicEntry.value < max
