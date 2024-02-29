import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { SkillTradition } from "optolith-database-schema/types/_Blessed"
import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { filterNonNullable } from "../../utils/array.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import { FilterApplyingRatedDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { createIdentifierObject } from "../identifier.ts"
import { flattenAspectIds } from "./liturgicalChant.ts"
import { flattenMinimumRestrictions } from "./ratedDependency.ts"
import { ActivatableRated, ActiveActivatableRated } from "./ratedEntry.ts"

const getLiturgicalChantMinimumFromAspectKnowledgePrerequistes = (
  liturgicalChantsAbove10ByAspect: Record<number, number>,
  activeAspectKnowledges: number[],
  aspectIds: number[],
  value: number | undefined,
): number | undefined =>
  aspectIds.some(
    aspectId =>
      activeAspectKnowledges.includes(aspectId) &&
      (liturgicalChantsAbove10ByAspect[aspectId] ?? 0) <= 3,
  ) &&
  value !== undefined &&
  value >= 10
    ? 10
    : undefined

/**
 * Returns the minimum value for a liturgical chant.
 */
export const getLiturgicalChantMinimum = (
  liturgicalChantsAbove10ByAspect: Record<number, number>,
  activeAspectKnowledges: number[],
  staticLiturgicalChant: { traditions: SkillTradition[] },
  dynamicLiturgicalChant: ActivatableRated,
  filterApplyingDependencies: FilterApplyingRatedDependencies,
): number | undefined => {
  const minimumValues: number[] = filterNonNullable([
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicLiturgicalChant.dependencies)),
    getLiturgicalChantMinimumFromAspectKnowledgePrerequistes(
      liturgicalChantsAbove10ByAspect,
      activeAspectKnowledges,
      flattenAspectIds(staticLiturgicalChant.traditions),
      dynamicLiturgicalChant.value,
    ),
  ])

  return minimumValues.length > 0 ? Math.max(...minimumValues) : undefined
}

const getLiturgicalChantMaximumFromAspectKnowledge = (
  activeAspectKnowledges: number[],
  aspectIds: number[],
): number | undefined =>
  aspectIds.some(aspectId => activeAspectKnowledges.includes(aspectId)) ? undefined : 14

/**
 * Returns the maximum value for a liturgical chant.
 */
export const getLiturgicalChantMaximum = (
  getHighestAttributeValue: (attributes: AttributeReference[]) => number,
  activeAspectKnowledges: number[],
  staticLiturgicalChant: { id: number; check: SkillCheck; traditions: SkillTradition[] },
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  exceptionalSkill: Activatable | undefined,
  type: "LiturgicalChant" | "Ceremony",
): number => {
  const maximumValues = filterNonNullable([
    getHighestAttributeValue(staticLiturgicalChant.check) + 2,
    isInCharacterCreation ? startExperienceLevel.max_skill_rating : undefined,
    getLiturgicalChantMaximumFromAspectKnowledge(
      activeAspectKnowledges,
      flattenAspectIds(staticLiturgicalChant.traditions),
    ),
  ])

  const exceptionalSkillBonus = countOptions(
    exceptionalSkill,
    createIdentifierObject(type, staticLiturgicalChant.id),
  )

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

/**
 * Checks if the liturgical chant is decreasable.
 * @param dynamicEntry The dynamic liturgical chant entry.
 * @param min The value returned from {@link getLiturgicalChantMinimum}.
 */
export const isLiturgicalChantDecreasable = (
  dynamicEntry: ActiveActivatableRated,
  min: number | undefined,
  canRemove: boolean,
) => (min === undefined || dynamicEntry.value > Math.max(min, 0)) && canRemove

/**
 * Checks if the liturgical chant is increasable.
 * @param dynamicEntry The dynamic liturgical chant entry.
 * @param max The value returned from {@link getLiturgicalChantMaximum}.
 */
export const isLiturgicalChantIncreasable = (dynamicEntry: ActiveActivatableRated, max: number) =>
  dynamicEntry.value < max
