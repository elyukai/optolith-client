import { createSelector } from "@reduxjs/toolkit"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { getCurrentExperienceLevel } from "../../shared/domain/experienceLevel.ts"
import {
  selectExperienceLevelStartId,
  selectTotalAdventurePoints,
} from "../slices/characterSlice.ts"
import { selectStaticExperienceLevels } from "../slices/databaseSlice.ts"

/**
 * Returns the experience level the character started with.
 */
export const selectStartExperienceLevel = createSelector(
  selectStaticExperienceLevels,
  selectExperienceLevelStartId,
  (experienceLevels, experienceLevelStartId): ExperienceLevel | undefined =>
    experienceLevelStartId === undefined ? undefined : experienceLevels[experienceLevelStartId],
)

/**
 * Returns the experience level the character has reached with the current
 * amount of adventure points.
 */
export const selectCurrentExperienceLevel = createSelector(
  selectStaticExperienceLevels,
  selectTotalAdventurePoints,
  (experienceLevels, totalAdventurePoints): ExperienceLevel | undefined =>
    totalAdventurePoints === undefined
      ? undefined
      : getCurrentExperienceLevel(experienceLevels, totalAdventurePoints),
)

/**
 * Returns the maximum number of attribute points that can be spent.
 */
export const selectMaximumTotalAttributePoints = createSelector(
  selectStartExperienceLevel,
  (experienceLevel): number => experienceLevel?.max_attribute_total ?? 0,
)
