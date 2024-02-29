import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { filterNonNullable } from "../../utils/array.ts"
import { Activatable, countOptions, isActive } from "../activatable/activatableEntry.ts"
import { FilterApplyingRatedDependencies } from "../dependencies/filterApplyingDependencies.ts"
import {
  CombinedCombatTechnique,
  getCombinedId,
  getCombinedPrimaryAttribute,
} from "./combatTechnique.ts"
import { flattenMinimumRestrictions } from "./ratedDependency.ts"
import { Rated } from "./ratedEntry.ts"

const getCombatTechniqueMinimumForHunter = (
  rangedCombatTechniquesAt10: number,
  staticCombatTechnique: CombinedCombatTechnique,
  dynamicCombatTechnique: Rated,
  hunter: Activatable | undefined,
) =>
  isActive(hunter) &&
  staticCombatTechnique.tag === "RangedCombatTechnique" &&
  dynamicCombatTechnique.value >= 10 &&
  rangedCombatTechniquesAt10 === 1
    ? 10
    : undefined

/**
 * Returns the minimum value for a combat technique.
 */
export const getCombatTechniqueMinimum = (
  rangedCombatTechniquesAt10: number,
  staticCombatTechnique: CombinedCombatTechnique,
  dynamicCombatTechnique: Rated,
  hunter: Activatable | undefined,
  filterApplyingDependencies: FilterApplyingRatedDependencies,
): number => {
  const minimumValues = filterNonNullable([
    6,
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicCombatTechnique.dependencies)),
    getCombatTechniqueMinimumForHunter(
      rangedCombatTechniquesAt10,
      staticCombatTechnique,
      dynamicCombatTechnique,
      hunter,
    ),
  ])

  return Math.max(...minimumValues.flat())
}

/**
 * Returns the maximum value for a combat technique.
 */
export const getCombatTechniqueMaximum = (
  getHighestAttributeValue: (attributes: AttributeReference[]) => number,
  staticCombatTechnique: CombinedCombatTechnique,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  exceptionalCombatTechnique: Activatable | undefined,
): number => {
  const idObject = getCombinedId(staticCombatTechnique)
  const primaryAttribute = getCombinedPrimaryAttribute(staticCombatTechnique)

  const maximumValues = filterNonNullable([
    getHighestAttributeValue(primaryAttribute) + 2,
    isInCharacterCreation ? startExperienceLevel.max_combat_technique_rating : undefined,
  ])

  const exceptionalCombatTechniqueBonus = countOptions(exceptionalCombatTechnique, idObject)

  return Math.min(...maximumValues) + exceptionalCombatTechniqueBonus
}

/**
 * Checks if the combat technique is decreasable.
 * @param dynamicEntry The dynamic combat technique entry.
 * @param min The value returned from {@link getCombatTechniqueMinimum}.
 */
export const isCombatTechniqueDecreasable = (
  dynamicEntry: Rated,
  min: number,
  canRemove: boolean,
) => min < dynamicEntry.value && canRemove

/**
 * Checks if the combat technique is increasable.
 * @param dynamicEntry The dynamic combat technique entry.
 * @param max The value returned from {@link getCombatTechniqueMaximum}.
 */
export const isCombatTechniqueIncreasable = (dynamicEntry: Rated, max: number) =>
  dynamicEntry.value < max
